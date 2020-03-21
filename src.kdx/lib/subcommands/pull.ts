// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { promisify }          from 'util';
import * as fs                from 'fs';
import * as path              from 'path';
import * as url               from 'url';
import * as rimraf_           from 'rimraf';
import { ValidationContext }  from 'tynder/modules/types';
import { getType }            from 'tynder/modules/validator';
import getClient              from '../client';
import { Lang }               from '../../schema-types/kintone-meta';
import { MetaIndex,
         MetaHashIndex,
         MetaViewsIndex,
         MetaResourcesIndex } from '../../schema-types/kdx-meta';
import { hash,
         KdxMetaSchema as kdxSchema,
         validate }           from '../util';



const readFile  = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists    = promisify(fs.exists);
const mkdir     = promisify(fs.mkdir);
const rimraf    = promisify((rimraf_ as any).default || rimraf_);


const kdxCtxGen: Partial<ValidationContext> = {
    checkAll: true,
    schema: kdxSchema,
};


export const pullMetaInfos =
        async (profile: string, projectDir: string, appName: string,
                lang?: Lang, preview?: boolean) => {

    const metaIndexText = await readFile(path.join(projectDir,
        'meta/meta-info.json'), { encoding: 'utf8' });
    const metaIndex =
        validate<MetaIndex>(JSON.parse(metaIndexText),
            getType(kdxSchema, 'MetaIndex'), { ...kdxCtxGen });

    const client = getClient(profile, metaIndex.apps[appName][profile].guestSpaceId);
    const appId = metaIndex.apps[appName][profile].appId;

    await mkdir(path.join(projectDir, 'meta/apps', appName, 'form'), { recursive: true });
    await mkdir(path.join(projectDir, 'meta/apps', appName, 'acl'), { recursive: true });

    let text = '';
    const hashIndex: MetaHashIndex = {};


    console.log(`(AppId: ${appId}) Start fetching...`);


    // app.json
    const metaApp = await client.app.getApp({ id: appId });
    text = JSON.stringify(metaApp, null, 4);
    hashIndex['app.json'] = hash(text);
    console.log('Fetching app.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'app.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    // settings.json
    const metaSettings = await client.app.getAppSettings({ app: appId, lang: lang, preview: preview ?? false });
    text = JSON.stringify(metaSettings, null, 4);
    hashIndex['settings.json'] = hash(text);
    console.log('Fetching settings.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'settings.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    // status.json
    const metaStatus = await client.app.getProcessManagement({ app: appId, lang: lang, preview: preview ?? false });
    text = JSON.stringify(metaStatus, null, 4);
    hashIndex['status.json'] = hash(text);
    console.log('Fetching status.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'status.json'), text, { encoding: 'utf8' });
    console.log('Done!');


    // form/fields.json
    const metaFields = await client.app.getFormFields({ app: appId, lang: lang, preview: preview ?? false });
    text = JSON.stringify(metaFields, null, 4);
    hashIndex['form/fields.json'] = hash(text);
    console.log('Fetching form/fields.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'form/fields.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    // form/layout.json
    const metaLayout = await client.app.getFormLayout({ app: appId, preview: preview ?? false });
    text = JSON.stringify(metaLayout, null, 4);
    hashIndex['form/layout.json'] = hash(text);
    console.log('Fetching form/layout.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'form/layout.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    // views.json
    const metaViews = await client.app.getViews({ app: appId, lang: lang, preview: preview ?? false });
    text = JSON.stringify(metaViews, null, 4);
    hashIndex['views.json'] = hash(text);
    console.log('Fetching views.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'views.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    {
        let viewIndex: MetaViewsIndex = {};
        const viewIndexNameToEnt = new Map<string, any>();
        const viewIndexNameToViewResName = new Map<string, string>();
        const viewIndexPath = path.join(projectDir, 'meta/apps', appName, '_views.json');

        if (await exists(viewIndexPath)) {
            let viewIndexText = '';
            viewIndexText = await readFile(viewIndexPath, { encoding: 'utf8' });
            viewIndex = validate<MetaViewsIndex>(JSON.parse(viewIndexText),
                getType(kdxSchema, 'MetaViewsIndex'), { ...kdxCtxGen });
        }

        for (const viewResName of Object.keys(viewIndex)) {
            const entry = viewIndex[viewResName];
            if (entry[profile] && entry[profile].id && entry[profile].name) {
                viewIndexNameToEnt.set(entry[profile].name, entry[profile]);
                viewIndexNameToViewResName.set(entry[profile].name, viewResName);
            }
        }

        for (const viewName of Object.keys(metaViews.views)) {
            const id = String(metaViews.views[viewName].id);
            const name = String(metaViews.views[viewName].name);
            if (viewIndexNameToEnt.has(name)) {
                // Update existing entry
                const resName = viewIndexNameToViewResName.get(name) as string;
                viewIndex[resName].view = {
                    ...metaViews.views[viewName],
                };
                delete (viewIndex[resName].view as any).id;
                delete (viewIndex[resName].view as any).name;

                const ent = viewIndexNameToEnt.get(name);
                ent.id = id;
                ent.name = metaViews.views[viewName].name;
            } else {
                // Append entry
                viewIndex[id] = viewIndex[id] || {};
                viewIndex[id].view = {
                    ...metaViews.views[viewName],
                };
                delete (viewIndex[id].view as any).id;
                delete (viewIndex[id].view as any).name;

                viewIndex[id][profile] = viewIndex[id][profile] || {};
                const ent = viewIndex[id][profile] = viewIndex[id][profile] || {};
                ent.id = id;
                ent.name = metaViews.views[viewName].name;
                viewIndexNameToEnt.set(name, ent);
            }
        }
        await writeFile(viewIndexPath, JSON.stringify(viewIndex, null, 4), { encoding: 'utf8' });

        const viewsDir = path.join(projectDir, 'views/apps', appName);
        await rimraf(viewsDir, {});
        await mkdir(viewsDir, { recursive: true });

        for (const viewName of Object.keys(metaViews.views)) {
            const id =  metaViews.views[viewName].id;
            const name =  metaViews.views[viewName].name;
            const html = (metaViews.views[viewName] as any).html;
            if (typeof html === 'string') {
                const resName = viewIndexNameToViewResName.get(name);
                await writeFile(
                    path.join(viewsDir, `${resName ?? id}.html`),
                    html, { encoding: 'utf8' });
            }
        }
    }


    // acl/app.json
    const metaAclApp = await client.app.getAppAcl({ app: appId, preview: preview ?? false });
    text = JSON.stringify(metaAclApp, null, 4);
    hashIndex['acl/app.json'] = hash(text);
    console.log('Fetching acl/app.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'acl/app.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    // acl/field.json
    const metaAclField = await client.app.getFieldAcl({ app: appId, preview: preview ?? false });
    text = JSON.stringify(metaAclField, null, 4);
    hashIndex['acl/field.json'] = hash(text);
    console.log('Fetching acl/field.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'acl/field.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    // acl/record.json
    const metaAclRecord = await client.app.getRecordAcl({ app: appId, lang: lang, preview: preview ?? false });
    text = JSON.stringify(metaAclRecord, null, 4);
    hashIndex['acl/record.json'] = hash(text);
    console.log('Fetching acl/record.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'acl/record.json'), text, { encoding: 'utf8' });
    console.log('Done!');


    // customize.json
    const metaCustomize = await client.app.getAppCustomize({ app: appId, preview: preview ?? false });
    text = JSON.stringify(metaCustomize, null, 4);
    hashIndex['customize.json'] = hash(text);
    console.log('Fetching customize.json...');
    await writeFile(path.join(projectDir, 'meta/apps', appName, 'customize.json'), text, { encoding: 'utf8' });
    console.log('Done!');

    text = JSON.stringify(hashIndex, null, 4);
    await writeFile(path.join(projectDir, 'meta/apps', appName, '_hash.json'), text, { encoding: 'utf8' });

    {
        const resourceIndexPath = path.join(projectDir, 'meta/apps', appName, '_resources.json');
        const resourcesDir = path.join(projectDir, 'meta/apps', appName, 'resources', profile);
        await rimraf(resourcesDir, {});
        await mkdir(resourcesDir, { recursive: true });

        const newResourceIndex: MetaResourcesIndex = {
            js: [],
            css: [],
        };

        const pushFileResourceEntry = (target: string, fileType: string, custItem: any) => {
            newResourceIndex[fileType].push({
                name: custItem.file.name,
                target: [target],
                file: {
                    [profile]: `filekey:${custItem.file.fileKey}`,
                }
            });
        };

        const pushLinkResourceEntry = (target: string, fileType: string, custItem: any) => {
            newResourceIndex[fileType].push({
                name: new url.URL(custItem.url).pathname.split('/').pop(),
                target: [target],
                file: {
                    [profile]: custItem.url,
                }
            });
        };

        const fileKeys: string[] = [];

        for (const item of metaCustomize.desktop.js) {
            if (item.type === 'FILE') {
                fileKeys.push(item.file.fileKey);
                pushFileResourceEntry('desktop', 'js', item);
            } else if (item.type === 'URL') {
                pushLinkResourceEntry('desktop', 'js', item);
            }
        }
        for (const item of metaCustomize.desktop.css) {
            if (item.type === 'FILE') {
                fileKeys.push(item.file.fileKey);
                pushFileResourceEntry('desktop', 'css', item);
            } else if (item.type === 'URL') {
                pushLinkResourceEntry('desktop', 'css', item);
            }
        }
        for (const item of metaCustomize.mobile.js) {
            if (item.type === 'FILE') {
                fileKeys.push(item.file.fileKey);
                pushFileResourceEntry('mobile', 'js', item);
            } else if (item.type === 'URL') {
                pushLinkResourceEntry('mobile', 'js', item);
            }
        }
        for (const item of metaCustomize.mobile.css) {
            if (item.type === 'FILE') {
                fileKeys.push(item.file.fileKey);
                pushFileResourceEntry('mobile', 'css', item);
            } else if (item.type === 'URL') {
                pushLinkResourceEntry('mobile', 'css', item);
            }
        }

        for (const key of fileKeys) {
            const ab = await client.file.downloadFile({ fileKey: key });
            await writeFile(path.join(resourcesDir, key), ab);
        }

        if (await exists(resourceIndexPath)) {
            const resourceIndexText = await readFile(resourceIndexPath, { encoding: 'utf8' });
            const resourceIndex =
                validate<MetaResourcesIndex>(JSON.parse(resourceIndexText),
                    getType(kdxSchema, 'MetaResourcesIndex'), { ...kdxCtxGen });

            const mergeInfo = (fileType: string) => {
                OUTER: for (const newEnt of newResourceIndex[fileType]) {
                    for (const origEnt of resourceIndex[fileType]) {
                        if (! origEnt.target.includes(newEnt.target[0])) {
                            continue;
                        }
                        if (newEnt.file[profile].startsWith('https:')) {
                            if (typeof origEnt.file === 'string') {
                                if (origEnt.file === newEnt.file[profile]) {
                                    continue OUTER;
                                }
                            } else {
                                if (origEnt.file[profile] === newEnt.file[profile]) {
                                    continue OUTER;
                                }
                            }
                        } else if (newEnt.name === origEnt.name) {
                            if (typeof origEnt.file === 'string') {
                                if (origEnt.file.startsWith('filekey:')) {
                                    origEnt.file = newEnt.file[profile];
                                }
                            } else {
                                if (origEnt.file[profile].startsWith('filekey:')) {
                                    origEnt.file[profile] = newEnt.file[profile];
                                }
                            }
                            continue OUTER;
                        }
                    }
                    resourceIndex[fileType].push(newEnt);
                }
            };
            mergeInfo('js');
            mergeInfo('css');
            text = JSON.stringify(resourceIndex, null, 4);
            await writeFile(resourceIndexPath, text, { encoding: 'utf8' });
        } else {
            text = JSON.stringify(newResourceIndex, null, 4);
            await writeFile(resourceIndexPath, text, { encoding: 'utf8' });
        }
    }

    console.log('All done!');
}
