// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { promisify }       from 'util';
import * as fs             from 'fs';
import * as path           from 'path';
import { TARGET_PROFILE }  from './util';
import { compileAppSchema,
         saveAppSchema }   from './subcommands/gen-schema';
import { pullMetaInfos }   from './subcommands/pull';
import { pushMetaInfos }   from './subcommands/push';
import { switchProfile }   from './subcommands/switch';



const readFile = promisify(fs.readFile);


async function getAllAppNames(projectDir: string) {
    const metaIndex = JSON.parse(await readFile(path.join(projectDir, 'meta/meta-info.json'), { encoding: 'utf8' }));
    return Object.keys(metaIndex.apps);
}


const commandRunner = async (command: (aName: string) => Promise<void>, projectDir: string, appName: string) => {
    const allAppNames = await getAllAppNames(projectDir);
    if (appName !== '--all') {
        if (appName.startsWith('-')) {
            throw new Error(`App name ${appName} is invalid.`);
        }
        if (! allAppNames.includes(appName)) {
            throw new Error(`App name ${appName} is not found in 'meta/meta-info.json'.`);
        }
        await command(appName);
    } else {
        for (const an of allAppNames) {
            await command(an);
        }
    }
};


const profileNameCommandRunner = async (command: (aName: string) => Promise<void>, projectDir: string, profileName: string) => {
    if (! profileName.startsWith('-')) {
        await command(profileName);
    } else {
        throw new Error(`Profile name ${profileName} is invalid.`);
    }
};


async function cli() {
    const projectDir = process.cwd();
    const subcommand = process.argv[2];
    const options = {
        all: false,
        force: false,
        appName: '',
    };
    for (const p of process.argv.slice(3)) {
        switch (p) {
        case '--all':
            options.all = true;
            options.appName = p;
            break;
        case '--force':
            options.force = true;
            break;
        default:
            if (p.startsWith('-')) {
                throw new Error(`Invalid cli option specified: ${p}.`);
            }
            if (! options.appName) {
                options.appName = p;
            } else {
                throw new Error(`Invalid cli option specified: ${p}.`);
            }
        }
    }

    switch (subcommand) {
    case 'compile-schema':
        {
            await commandRunner(async (aName) => await compileAppSchema(TARGET_PROFILE, projectDir, aName), projectDir, options.appName);
        }
        break;
    case 'gen-schema':
        {
            await commandRunner(async (aName) => await saveAppSchema(TARGET_PROFILE, projectDir, aName), projectDir, options.appName);
        }
        break;
    case 'fetch':
        {
            await commandRunner(async (aName) => await pullMetaInfos(TARGET_PROFILE, projectDir, aName), projectDir, options.appName);
        }
        break;
    case 'push':
        {
            await commandRunner(async (aName) => await pushMetaInfos(TARGET_PROFILE, projectDir, aName, options.force), projectDir, options.appName);
        }
        // Fall throught
    case 'pull': // fetch + gen-schema
        {
            await commandRunner(async (aName) => await pullMetaInfos(TARGET_PROFILE, projectDir, aName), projectDir, options.appName);
            await commandRunner(async (aName) => await saveAppSchema(TARGET_PROFILE, projectDir, aName), projectDir, options.appName);
        }
        break;
    case 'switch':
        {
            await profileNameCommandRunner(async (aName) => await switchProfile(TARGET_PROFILE, aName, projectDir), projectDir, options.appName);
        }
        break;
    case 'help' : default:
        console.log(
`kdx - kintone CLI for development & deployment, with Developer Experience

kdx <Subcommand> <AppName> [--force]
kdx <Subcommand> --all     [--force]
kdx switch <profile>

Subcommands:
    compile-schema  : Generate definition and validation codes from schema/*.tss info.
    gen-schema      : Generate definition and validation codes from meta/**/*.json info.
    fetch           : Fetch from kintone, but no code generation is performed.
    push            : Push to kintone.
    pull            : Pull from kintone, and perform code generation.
    switch          : Switch target profile (e.g. development, staging, production).
                      Update .env and re-generate AppID enum.
    help            : Show this help.
`
        );
        break;
    }
}

export default cli;
