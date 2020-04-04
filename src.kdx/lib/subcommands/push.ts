// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { promisify }          from 'util';
import * as fs                from 'fs';
import * as path              from 'path';
import { ValidationContext }  from 'tynder/modules/types';
import { getType }            from 'tynder/modules/validator';
import getClient              from '../client';
import { Lang,
         MetaSettings,
         MetaStatus,
         MetaFields,
         MetaLayout,
         MetaViews,
         MetaAclApp,
         MetaAclField,
         MetaAclRecord,
         MetaCustomize }      from '../../schema-types/kintone-meta';
import { MetaIndex,
         MetaHashIndex,
         MetaViewsIndex,
         MetaResourcesIndex } from '../../schema-types/kdx-meta';
import { sleep,
         hash,
         KintoneMetaSchema as schema,
         KdxMetaSchema     as kdxSchema,
         validate }           from '../util';



const readFile  = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists    = promisify(fs.exists);


const ctxGen: Partial<ValidationContext> = {
    checkAll: true,
    schema,
};

const kdxCtxGen: Partial<ValidationContext> = {
    checkAll: true,
    schema: kdxSchema,
};


export const pushMetaInfos =
        async (profile: string, projectDir: string, appName: string, force: boolean,
            lang?: Lang, preview?: boolean) => {

    const metaIndexText = await readFile(path.join(projectDir,
        'meta/meta-info.json'), { encoding: 'utf8' });
    const metaIndex =
        validate<MetaIndex>(JSON.parse(metaIndexText),
            getType(kdxSchema, 'MetaIndex'), { ...kdxCtxGen });
    const allAppNames = Object.keys(metaIndex.apps);

    const client = getClient(profile, metaIndex.apps[appName][profile].guestSpaceId);
    const appId = metaIndex.apps[appName][profile].appId;

    const hashIndexText =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            '_hash.json'), { encoding: 'utf8' })
    const hashIndex =
        validate<MetaHashIndex>(JSON.parse(hashIndexText),
            getType(kdxSchema, 'MetaHashIndex'), { ...kdxCtxGen });


    // validating files
    const textMetaSettings =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'settings.json'), { encoding: 'utf8' });
    const metaSettings =
        validate<MetaSettings>(JSON.parse(textMetaSettings),
            getType(schema, 'MetaSettings'), { ...ctxGen });

    const textMetaStatus =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'status.json'), { encoding: 'utf8' });
    const metaStatus =
        validate<MetaStatus>(JSON.parse(textMetaStatus),
            getType(schema, 'MetaStatus'), { ...ctxGen });

    const textMetaFields =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'form/fields.json'), { encoding: 'utf8' });
    const metaFields =
        validate<MetaFields>(JSON.parse(textMetaFields),
            getType(schema, 'MetaFields'), { ...ctxGen });

    const textMetaLayout =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'form/layout.json'), { encoding: 'utf8' });
    const metaLayout =
        validate<MetaLayout>(JSON.parse(textMetaLayout),
            getType(schema, 'MetaLayout'), { ...ctxGen });

    const textMetaViews =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'views.json'), { encoding: 'utf8' });
    const metaViews =
        validate<MetaViews>(JSON.parse(textMetaViews),
            getType(schema, 'MetaViews'), { ...ctxGen });

    const textMetaAclApp =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'acl/app.json'), { encoding: 'utf8' });
    const metaAclApp =
        validate<MetaAclApp>(JSON.parse(textMetaAclApp),
            getType(schema, 'MetaAclApp'), { ...ctxGen });

    const textMetaAclField =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'acl/field.json'), { encoding: 'utf8' });
    const metaAclField =
        validate<MetaAclField>(JSON.parse(textMetaAclField),
            getType(schema, 'MetaAclField'), { ...ctxGen });

    const textMetaAclRecord =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'acl/record.json'), { encoding: 'utf8' });
    const metaAclRecord =
        validate<MetaAclRecord>(JSON.parse(textMetaAclRecord),
            getType(schema, 'MetaAclRecord'), { ...ctxGen });

    const textMetaCustomize =
        await readFile(path.join(projectDir, 'meta/apps', appName,
            'customize.json'), { encoding: 'utf8' });
    const metaCustomize =
        validate<MetaCustomize>(JSON.parse(textMetaCustomize),
            getType(schema, 'MetaCustomize'), { ...ctxGen });


    const originalevision = Number(metaSettings.revision);
    let revision = originalevision;


    console.log(`(AppId: ${appId} / Rev: ${revision}) Start deploying...`);


    // settings.json
    if (force || hashIndex['settings.json'] !== hash(textMetaSettings)) {
        console.log('Sending settings.json...');
        const resp = await client.app.updateAppSettings({
            ...metaSettings,
            app: appId,
            revision: force ? -1 : revision++,
        });
        revision = Number(resp.revision);
        console.log('Done!');
    }

    // status.json
    if (force || hashIndex['status.json'] !== hash(textMetaStatus)) {
        console.log('Sending status.json...');
        const resp = await client.app.updateProcessManagement({
            ...metaStatus as any, // TODO: @kintone/rest-api-client .d.ts are broken!
            app: appId,
            revision: force ? -1 : revision++,
        });
        revision = Number(resp.revision);
        console.log('Done!');
    }


    // form/fields.json
    {
        // updating
        const metaFieldsRemote = await client.app.getFormFields({
            app: appId,
            lang: lang,
            preview: true,
        });

        const metaFieldsRemoteFields = Object.keys(metaFieldsRemote.properties);

        const metaFieldsNew: MetaFields = {
            properties: {},
            revision: '-1',
        };

        let hasNewFields = false;
        for (const k of Object.keys(metaFields.properties)) {
            if (! metaFieldsRemoteFields.includes(k)) {
                metaFieldsNew.properties[k] = metaFields.properties[k];
                hasNewFields = true;
            }
        }

        for (const k of Object.keys(metaFields.properties)) {
            const field: any = metaFields.properties[k];
            if (field.type === 'REFERENCE_TABLE') {
                if (field?.referenceTable?.relatedApp?.app) {
                    const m = /^\$appName:(.+)\$$/.exec(field.referenceTable.relatedApp.app);
                    if (m && allAppNames.includes(m[1])) {
                        field.referenceTable.relatedApp.app = metaIndex.apps[m[1]][profile].appId;
                    }
                }
            } else {
                if (field?.lookup?.relatedApp?.app) {
                    const m = /^\$appName:(.+)\$$/.exec(field.lookup.relatedApp.app);
                    if (m && allAppNames.includes(m[1])) {
                        field.lookup.relatedApp.app = metaIndex.apps[m[1]][profile].appId;
                    }
                }
            }
        }

        if (hasNewFields) {
            console.log('Sending fields.json for adding fields...');
            const resp = await client.app.addFormFields({
                app: appId,
                properties: metaFieldsNew.properties,
                revision: force ? -1 : revision++,
            });
            revision = Number(resp.revision);
            console.log('Done!');
        }

        // sending
        if (force || hashIndex['form/fields.json'] !== hash(textMetaFields)) {
            console.log('Sending form/fields.json...');
            const resp = await client.app.updateFormFields({
                app: appId,
                properties: metaFields.properties,
                revision: force ? -1 : revision++,
            });
            revision = Number(resp.revision);
            console.log('Done!');
        }
    }

    // form/layout.json
    if (force || hashIndex['form/layout.json'] !== hash(textMetaLayout)) {
        console.log('Sending form/layout.json...');
        const resp = await client.app.updateFormLayout({
            app: appId,
            layout: metaLayout.layout,
            revision: force ? -1 : revision++,
        });
        revision = Number(resp.revision);
        console.log('Done!');
    }

    // views.json
    {
        let viewIndex: MetaViewsIndex = {};
        const viewIndexIdToEnt = new Map<string, any>();
        const viewIndexIdToViewResName = new Map<string, string>();
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
                viewIndexIdToEnt.set(entry[profile].id, entry[profile]);
                viewIndexIdToViewResName.set(entry[profile].id, viewResName);
            }
        }

        // updating
        let changed = false;
        for (const id of viewIndexIdToViewResName.keys()) {
            const ent = viewIndexIdToEnt.get(id);
            const viewName = ent.name;
            const resName = viewIndexIdToViewResName.get(id) as string;
            if (! viewIndexIdToViewResName.has(id)) {
                delete metaViews.views[viewName];
                changed = true;
                continue;
            }
            const viewOrig = metaViews.views[viewName];
            const view: typeof viewOrig = {
                id: id,
                name: ent.name,
                ...viewIndex[resName].view,
            };
            if (viewOrig) {
                if (view.type === 'CUSTOM') {
                    if (typeof view.html === 'string') {
                        const viewResName = viewIndexIdToViewResName.get(id);
                        const viewHtmlPath = path.join(projectDir, 'views/apps', appName, `${viewResName ?? id}.html`);

                        if (await exists(viewHtmlPath)) {
                            const html = await readFile(viewHtmlPath, { encoding: 'utf8' });
                            if (view.html !== html) {
                                view.html = html;
                                changed = true;
                            }
                        }
                    }
                }
                for (const k of Object.keys(viewOrig)) {
                    if (k !== 'html') {
                        if (JSON.stringify(viewOrig[k]) !== JSON.stringify(view[k])) {
                            changed = true;
                        }
                    }
                }
            } else {
                changed = true;
            }
            metaViews.views[viewName] = view;
        }
        for (const viewName of Object.keys(metaViews.views)) {
            if (! viewIndexIdToViewResName.has(metaViews.views[viewName].id)) {
                delete metaViews.views[viewName];
                changed = true;
            }
        }

        if (changed) {
            const text = JSON.stringify(metaViews, null, 4);
            await writeFile(path.join(projectDir, 'meta/apps', appName,
                'views.json'), text, { encoding: 'utf8' });
        }

        // sending
        {
            const text = await readFile(path.join(projectDir, 'meta/apps', appName,
                'views.json'), { encoding: 'utf8' });

            if (force || hashIndex['views.json'] !== hash(text)) {
                console.log('Sending views.json...');
                const resp = await client.app.updateViews({
                    app: appId,
                    views: metaViews.views,
                    revision: force ? -1 : revision++,
                });
                revision = Number(resp.revision);
                console.log('Done!');
            }
        }
    }


    // acl/app.json
    if (force || hashIndex['acl/app.json'] !== hash(textMetaAclApp)) {
        console.log('Sending acl/app.json...');
        const resp = await client.app.updateAppAcl({
            app: appId,
            rights: metaAclApp.rights,
            revision: force ? -1 : revision++,
        });
        revision = Number(resp.revision);
        console.log('Done!');
    }

    // acl/field.json
    if (force || hashIndex['acl/field.json'] !== hash(textMetaAclField)) {
        console.log('Sending acl/field.json...');
        const resp = await client.app.updateFieldAcl({
            app: appId,
            rights: metaAclField.rights,
            revision: force ? -1 : revision++,
        });
        revision = Number(resp.revision);
        console.log('Done!');
    }

    // acl/record.json
    if (force || hashIndex['acl/record.json'] !== hash(textMetaAclRecord)) {
        console.log('Sending acl/record.json...');
        const resp = await client.app.updateRecordAcl({
            app: appId,
            rights: metaAclRecord.rights,
            revision: force ? -1 : revision++,
        });
        revision = Number(resp.revision);
        console.log('Done!');
    }


    // customize.json
    {
        // updating
        const newMetaCust: MetaCustomize = {
            scope: metaCustomize.scope,
            desktop: {
                js: [],
                css: [],
            },
            mobile: {
                js: [],
                css: [],
            },
            revision: metaCustomize.revision,
        };

        {
            const resourceIndexPath = path.join(projectDir, 'meta/apps', appName, '_resources.json');
            const resourcesDir = path.join(projectDir, 'meta/apps', appName, 'resources', profile);

            const pushFileCustomizeEntry = (target: string, fileType: string, newFileKey: string) => {
                newMetaCust[target][fileType].push({
                    type: 'FILE',
                    file: {
                        fileKey: newFileKey,
                    },
                });
            };

            const pushLinkCustomizeEntry = (target: string, fileType: string, url: string) => {
                newMetaCust[target][fileType].push({
                    type: 'URL',
                    url,
                });
            };

            const makeNewFkey = async (resEnt: any, fkey: string) => {
                const bin = await readFile(path.join(resourcesDir, fkey));
                const newFkey = (await client.file.uploadFile({
                    file: { name: resEnt.name, data: bin },
                })).fileKey;

                if (typeof resEnt.file === 'string') {
                    resEnt.file = `filekey:${newFkey}`;
                } else {
                    resEnt.file[profile] = `filekey:${newFkey}`;
                }
                return newFkey;
            };

            if (await exists(resourceIndexPath)) {
                const resourceIndexText = await readFile(resourceIndexPath, { encoding: 'utf8' });
                const resourceIndex =
                    validate<MetaResourcesIndex>(JSON.parse(resourceIndexText),
                        getType(kdxSchema, 'MetaResourcesIndex'), { ...kdxCtxGen });

                for (const {rInd, fileType} of [
                        {rInd: resourceIndex.js, fileType: 'js'},
                        {rInd: resourceIndex.css, fileType: 'css'},
                    ]) {

                    for (const ent of rInd) {
                        let entUrl = '';

                        if (typeof ent.file === 'string') {
                            entUrl = ent.file;
                        } else {
                            entUrl = ent.file[profile];
                        }
                        if (! entUrl) {
                            continue;
                        }

                        if (entUrl.startsWith('filekey:')) {
                            const fkey = entUrl.slice(8);
                            const resPath = path.join(projectDir, 'meta/apps', appName, 'resources', profile, fkey);

                            if (await exists(resPath)) {
                                for (const target of ent.target) {
                                    const cust = (metaCustomize[target][fileType] as any[])
                                        .find(x => x.file?.name === ent.name);

                                    if (cust && cust.file?.fileKey === fkey) {
                                        console.log(`(customize.json) (matched) re-uploading: ${entUrl}`);
                                    } else {
                                        console.log(`(customize.json) re-uploading: ${entUrl}`);
                                    }

                                    // re-upload and get new filekey
                                    const newFkey = await makeNewFkey(ent, fkey);
                                    pushFileCustomizeEntry(target, fileType, newFkey);
                                }
                            } else {
                                for (const target of ent.target) {
                                    throw new Error(`Local file lost: ${target} ${fileType} ${entUrl}`);
                                }
                            }
                        } else if (entUrl.startsWith('project:')) {
                            // re-upload and get new filekey
                            const bin = await readFile(path.join(projectDir, entUrl.slice(8)));
                            for (const target of ent.target) {
                                const newFkey = (await client.file.uploadFile({
                                    file: { name: ent.name, data: bin },
                                })).fileKey;

                                pushFileCustomizeEntry(target, fileType, newFkey);
                                console.log(`(customize.json) uploading project local file: ${entUrl}`);
                            }
                        } else if (entUrl.startsWith('https:')) {
                            // keep current link
                            for (const target of ent.target) {
                                pushLinkCustomizeEntry(target, fileType, entUrl);
                                console.log(`(customize.json) set link: ${entUrl}`);
                            }
                        } else {
                            throw new Error(`Unknown resource entry: ${entUrl}`);
                        }
                    }
                }
            }

            {
                const text = JSON.stringify(newMetaCust, null, 4);
                await writeFile(path.join(projectDir, 'meta/apps', appName,
                    'customize.json'), text, { encoding: 'utf8' });
            }
        }

        // sending
        {
            const text =
                await readFile(path.join(projectDir, 'meta/apps', appName,
                    'customize.json'), { encoding: 'utf8' });

            if (force || hashIndex['customize.json'] !== hash(text)) {
                console.log('Sending customize.json...');
                const resp = await client.app.updateAppCustomize({
                    ...newMetaCust,
                    app: appId,
                    revision: force ? -1 : revision++,
                });
                revision = Number(resp.revision);
                console.log('Done!');
            }
        }
    }

    if (originalevision !== revision) {
        if (!preview) {
            await client.app.deployApp({ apps: [{
                app: appId,
                revision: force ? -1 : revision,
            }] });

            OUTER: for (let i = 0; i < 20; i++) {
                await sleep(1000);
                const result = await client.app.getDeployStatus({ apps: [ appId ] });
                switch (result.apps[0].status) {
                case 'PROCESSING':
                    console.log('.');
                    break;
                case 'SUCCESS':
                    console.log(`(AppId: ${appId}) Deploy succeeded. (revision: ${revision})`);
                    break OUTER;
                case 'FAIL':
                    console.log('Deploy failed.');
                    console.log(`(AppId: ${appId}) Changes are applied to preview environment. (revision: ${revision})`);
                    break OUTER;
                case 'CANCEL':
                    console.log('Deploy cancelled.');
                    console.log(`(AppId: ${appId}) Changes are applied to preview environment. (revision: ${revision})`);
                    break OUTER;
                }
            }
        } else {
            console.log(`(AppId: ${appId}) Changes are applied to preview environment. (revision: ${revision})`);
        }
    } else {
        console.log('(AppId: ${appId}) No updates are detected. Done!');
    }
}
