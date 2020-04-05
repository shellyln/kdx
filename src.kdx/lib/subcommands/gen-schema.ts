// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { promisify }              from 'util';
import * as fs                    from 'fs';
import * as path                  from 'path';
import { compile }                from 'tynder/modules/compiler';
import { serialize }              from 'tynder/modules/serializer';
import { generateTypeScriptCode } from 'tynder/modules/codegen';
import { ValidationContext }      from 'tynder/modules/types';
import { getType }                from 'tynder/modules/validator';
import { MetaIndex }              from '../../schema-types/kdx-meta';
import { escapeString,
         KdxMetaSchema as kdxSchema,
         validate }               from '../util';



const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);


const kdxCtxGen: Partial<ValidationContext> = {
    checkAll: true,
    schema: kdxSchema,
};


const getFields = (interfaceComment: string, interfaceName: string, fields: object, nestLv: number) => {
    let code = '';
    let subTableCode = '';
    const indent = ''.padEnd((nestLv + 1) * 4);
    const keys = Object.keys(fields);

    OUTER: for (const k of keys) {
        let isArray = false;
        let typeName = 'any';
        let decorators = '';
        const field = fields[k];

        switch (field.type) {
        case 'STATUS':
            typeName = 'string';
            break;
        case 'CATEGORY':
            typeName = 'string';
            break;
        case 'NUMBER':
            typeName = 'number';
            break;
        case 'SINGLE_LINE_TEXT':
            typeName = 'string';
            break;
        case 'MULTI_LINE_TEXT':
            typeName = 'string';
            break;
        case 'RICH_TEXT':
            typeName = 'string';
            break;
        case 'LINK':
            typeName = 'string';
            break;
        case 'DATE':
            decorators += `@stereotype('lcdate')`;
            typeName = 'string';
            break;
        case 'DATETIME':
            decorators += `@stereotype('lcdatetime')`;
            typeName = 'string';
            break;
        case 'TIME':
            decorators += `@match(/^[0-2]\\d:[0-5]\\d$/)`;
            typeName = 'string';
            break;
        case 'RADIO_BUTTON': case 'DROP_DOWN':
            typeName = Object.keys(field.options)
                .map(x => `'${escapeString(x)}'`).join(' | ');
            break;
        case 'CHECK_BOX': case 'MULTI_SELECT':
            isArray = true;
            typeName = `(${Object.keys(field.options)
                .map(x => `'${escapeString(x)}'`).join(' | ')})[${field.required ? ', 1..' : ''}]`;
            break;
        case 'USER_SELECT':
            isArray = true;
            typeName = `Array<{code: string, name: string}${field.required ? ', 1..' : ''}>`;
            break;
        case 'GROUP_SELECT':
            isArray = true;
            typeName = `Array<{code: string, name: string}${field.required ? ', 1..' : ''}>`;
            break;
        case 'ORGANIZATION_SELECT':
            isArray = true;
            typeName = `Array<{code: string, name: string}${field.required ? ', 1..' : ''}>`;
            break;
        case 'SUBTABLE':
            {
                isArray = true;
                typeName = field.code[0].toUpperCase() + field.code.slice(1);
                const sub = getFields(field.label, typeName, field.fields, nestLv);
                subTableCode += sub.subTableCode + sub.code;
                typeName = `${typeName}[${field.required ? ', 1..' : ''}]`;
            }
            break;

        case 'CALC':
        case 'FILE':
        case 'STATUS_ASSIGNEE':
            continue OUTER;

        // system fields
        case 'RECORD_NUMBER':
        case 'CREATED_TIME':
        case 'CREATOR':
        case 'UPDATED_TIME':
        case 'MODIFIER':
            continue OUTER;

        // UI elements (no record fields)
        case 'REFERENCE_TABLE':
        case 'GROUP':
        default:
            continue OUTER;
        }

        if (field.maxValue) {
            let v = '';
            if (field.type === 'NUMBER') {
                v = field.maxValue;
            } else {
                v = `'${escapeString(field.maxValue)}'`;
            }
            decorators += `${decorators ? ' ' : ''}@maxValue(${v})`;
        }
        if (field.minValue) {
            let v = '';
            if (field.type === 'NUMBER') {
                v = field.minValue;
            } else {
                v = `'${escapeString(field.minValue)}'`;
            }
            decorators += `${decorators ? ' ' : ''}@minValue(${v})`;
        }
        if (field.maxLength) {
            let v = '';
            if (field.type === 'NUMBER') {
                v = field.maxLength;
            } else {
                v = `'${escapeString(field.maxLength)}'`;
            }
            decorators += `${decorators ? ' ' : ''}@maxLength(${v})`;
        }
        if (field.minLength) {
            let v = '';
            if (field.type === 'NUMBER') {
                v = field.minLength;
            } else {
                v = `'${escapeString(field.minLength)}'`;
            }
            decorators += `${decorators ? ' ' : ''}@minLength(${v})`;
        }
        decorators += `${decorators ? `\n${indent}` : ''}@meta({fieldType:'${escapeString(field.type)}'})`;

        code += `${code ? '\n' : ''}${
            indent}/** ${field.label} */\n${indent}${
            decorators ? decorators + '\n' + indent : ''}${
            /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(field.code) ? field.code : `'${escapeString(field.code)}'`}${
            (isArray || field.required) ? '' : '?'}: ${typeName};\n`;
    }
    code = `\n\n${interfaceComment ? `/** ${interfaceComment} */\n` : ''}export interface ${interfaceName} {\n${code}}\n\n`;
    return ({subTableCode, code});
};


export const generateAppSchema = async (projectDir: string, appName: string) => {
    // app.json
    const metaApp = JSON.parse(await readFile(path.join(projectDir, 'meta/apps', appName, 'app.json'), { encoding: 'utf8' }));
    // form/fields.json
    const metaFields = JSON.parse(await readFile(path.join(projectDir, 'meta/apps', appName, 'form/fields.json'), { encoding: 'utf8' }));

    const fields = metaFields.properties;
    const { subTableCode, code } = getFields(metaApp.name, 'App', fields, 0);

    return '// @ts-nocheck\n\n' + subTableCode + code;
};


export const generateAppsEnum = async (profile: string, projectDir: string) => {
    const metaIndexText = await readFile(path.join(projectDir,
        'meta/meta-info.json'), { encoding: 'utf8' });
    const metaIndex =
        validate<MetaIndex>(JSON.parse(metaIndexText),
            getType(kdxSchema, 'MetaIndex'), { ...kdxCtxGen });
    const allAppNames = Object.keys(metaIndex.apps);

    const indent = ''.padEnd(4);
    const lines: string[] = [];

    const profileCode = `\n\nexport const TARGET_PROFILE = '${escapeString(profile)}'\n`;

    for (const name of allAppNames) {
        lines.push(`${name} = ${metaIndex.apps[name][profile].appId},`);
    }
    const enumCode = `\n\nexport enum Apps {\n${indent}${lines.join(`\n${indent}`)}\n}\n\n`;

    return profileCode + enumCode;
}



const internalSaveAppSchema = async (profile: string, projectDir: string, appName: string, schemaText: string) => {
    const schema = compile(schemaText);
    const compiledText = serialize(schema, true);
    const typesText = generateTypeScriptCode(schema);
    const enumText = await generateAppsEnum(profile, projectDir);

    await mkdir(path.join(projectDir, 'schema'), { recursive: true });
    await mkdir(path.join(projectDir, 'src/schema-compiled'), { recursive: true });
    await mkdir(path.join(projectDir, 'src/schema-types'), { recursive: true });
    await writeFile(path.join(projectDir, 'schema', `${appName}.tss`), schemaText, { encoding: 'utf8' });
    await writeFile(path.join(projectDir, 'src/schema-compiled', `${appName}.ts`), compiledText, { encoding: 'utf8' });
    await writeFile(path.join(projectDir, 'src/schema-types', `${appName}.d.ts`), typesText, { encoding: 'utf8' });
    await writeFile(path.join(projectDir, 'src/schema-types', `Apps.meta.ts`), enumText, { encoding: 'utf8' });
}


export const compileAppSchema = async (profile: string, projectDir: string, appName: string) => {
    const schemaText = await readFile(path.join(projectDir, 'schema', `${appName}.tss`), { encoding: 'utf8' });
    internalSaveAppSchema(profile, projectDir, appName, schemaText);
}


export const saveAppSchema = async (profile: string, projectDir: string, appName: string) => {
    const schemaText = await generateAppSchema(projectDir, appName);
    internalSaveAppSchema(profile, projectDir, appName, schemaText);
}
