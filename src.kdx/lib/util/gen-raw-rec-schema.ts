// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { promisify }    from 'util';
import * as fs          from 'fs';
import * as path        from 'path';
import { escapeString } from './index';



const readFile = promisify(fs.readFile);


const getRawFields = (interfaceComment: string, interfaceName: string, fields: object, nestLv: number) => {
    let code = '';
    let subTableCode = '';
    const indent = ''.padEnd((nestLv + 1) * 4);
    const indent2 = ''.padEnd((nestLv + 2) * 4);
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
            decorators += `@match(/^[+-]?(?:[1-9][0-9]*|0)(?:\\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?$/)`;
            typeName = 'string';
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
                const sub = getRawFields(field.label, typeName, field.fields, nestLv);
                subTableCode += sub.subTableCode + sub.code;
                typeName = `${typeName}[${field.required ? ', 1..' : ''}]`;
            }
            break;

        case 'CALC':
            typeName = 'string';
            break;
        case 'FILE':
            isArray = true;
            typeName = `Array<{contentType: string, fileKey: string, name: string, size: string}>`;
            break;
        case 'STATUS_ASSIGNEE':
            isArray = true;
            typeName = `Array<{code: string, name: string}>`;
            break;

        // system fields
        case 'RECORD_NUMBER':
            typeName = 'string';
            break;
        case 'CREATED_TIME':
            decorators += `@stereotype('lcdatetime')`;
            typeName = 'string';
            break;
        case 'CREATOR':
            typeName = `{code: string, name: string}`;
            break;
        case 'UPDATED_TIME':
            decorators += `@stereotype('lcdatetime')`;
            typeName = 'string';
            break;
        case 'MODIFIER':
            typeName = `{code: string, name: string}`;
            break;
        case '__ID__':
            typeName = 'string';
            break;
        case '__REVISION__':
            typeName = 'string';
            break;

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

        code += `${code ? '\n' : ''}${
            indent}/** ${field.label} */\n${indent}@meta({fieldType:'${escapeString(field.type)}'})\n${
            indent}${/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(field.code) ? field.code : `'${escapeString(field.code)}'`}${
            (isArray || field.required) ? '' : '?'}: {\n${
            indent2}type: '${escapeString(field.type)}';\n${
            indent2}${decorators ? decorators + '\n' + indent2 : ''}value: ${typeName};\n${
            indent2}lookup?: boolean | 'UPDATE';\n${
            indent2}error?: string;\n${
            indent2}disabled?: boolean;\n${
            indent}};\n`;
    }
    code = `\n\n${interfaceComment ? `/** ${interfaceComment} */\n` : ''}export interface ${interfaceName} {\n${code}}\n\n`;
    return ({subTableCode, code});
};


export const generateRawAppSchema = async (projectDir: string, appName: string) => {
    // app.json
    const metaApp = JSON.parse(await readFile(path.join(projectDir, 'meta/apps', appName, 'app.json'), { encoding: 'utf8' }));
    // form/fields.json
    const metaFields = JSON.parse(await readFile(path.join(projectDir, 'meta/apps', appName, 'form/fields.json'), { encoding: 'utf8' }));

    const fields = metaFields.properties;
    const { subTableCode, code } = getRawFields(metaApp.name, 'RawApp', fields, 0);

    return '// @ts-nocheck\n\n' + subTableCode + code;
};
