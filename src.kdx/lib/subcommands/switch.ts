// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { promisify }    from 'util';
import * as fs          from 'fs';
import * as path        from 'path';
import { saveAppsEnum } from './gen-schema';


const readFile  = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


export const switchProfile =
        async (currentProfile: string, nextProfile: string, projectDir: string) => {

    let dotEnvText = await readFile(path.join(projectDir,
        '.env'), { encoding: 'utf8' });

    dotEnvText = dotEnvText.replace(/^TARGET\s?=\s?\w+$/m, `TARGET = ${nextProfile}`);

    await writeFile(path.join(projectDir,
        '.env'), dotEnvText, { encoding: 'utf8' });

    await saveAppsEnum(nextProfile, projectDir);
};
