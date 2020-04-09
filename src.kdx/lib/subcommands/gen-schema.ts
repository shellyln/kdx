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
import { generateAppSchema }      from '../util/gen-cooked-rec-schema';



const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);


const kdxCtxGen: Partial<ValidationContext> = {
    checkAll: true,
    schema: kdxSchema,
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


export const saveAppsEnum = async (profile: string, projectDir: string) => {
    const enumText = await generateAppsEnum(profile, projectDir);
    await writeFile(path.join(projectDir, 'src/schema-types', `Apps.meta.ts`), enumText, { encoding: 'utf8' });
};


const internalSaveAppSchema = async (profile: string, projectDir: string, appName: string, schemaText: string) => {
    const schema = compile(schemaText);
    const compiledText = serialize(schema, true);
    const typesText = generateTypeScriptCode(schema);

    await mkdir(path.join(projectDir, 'schema'), { recursive: true });
    await mkdir(path.join(projectDir, 'src/schema-compiled'), { recursive: true });
    await mkdir(path.join(projectDir, 'src/schema-types'), { recursive: true });
    await writeFile(path.join(projectDir, 'schema', `${appName}.tss`), schemaText, { encoding: 'utf8' });
    await writeFile(path.join(projectDir, 'src/schema-compiled', `${appName}.ts`), compiledText, { encoding: 'utf8' });
    await writeFile(path.join(projectDir, 'src/schema-types', `${appName}.d.ts`), typesText, { encoding: 'utf8' });

    await saveAppsEnum(profile, projectDir);
}


export const compileAppSchema = async (profile: string, projectDir: string, appName: string) => {
    const schemaText = await readFile(path.join(projectDir, 'schema', `${appName}.tss`), { encoding: 'utf8' });
    internalSaveAppSchema(profile, projectDir, appName, schemaText);
}


export const saveAppSchema = async (profile: string, projectDir: string, appName: string) => {
    const schemaText = await generateAppSchema(projectDir, appName);
    internalSaveAppSchema(profile, projectDir, appName, schemaText);
}
