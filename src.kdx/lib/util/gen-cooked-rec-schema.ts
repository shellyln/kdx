// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { promisify }    from 'util';
import * as fs          from 'fs';
import * as path        from 'path';
import { escapeString } from './index';



const readFile = promisify(fs.readFile);


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
        case '__ID__':
        case '__REVISION__':
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
            v = field.maxLength;
            decorators += `${decorators ? ' ' : ''}@maxLength(${v})`;
        }
        if (field.minLength) {
            let v = '';
            v = field.minLength;
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
