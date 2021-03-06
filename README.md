# KDX

![KDX](https://shellyln.github.io/assets/image/kdx-logo.svg)

kintone CLI for development & deployment, with Developer Experience.  
Enjoy type-safe and repository-centric development!

> This is an unstable pre-release


## Features
* Pull and push the kintone multiple Apps settings.
  * You can also deploy to other environments and applications.
* Download and upload app's JavaScript and CSS files.
* Edit custom view HTML file as a separated file.
* Generate the app fields schema and type definitions.
  * You can validate the input with `kdx/helpers` library codes.
  * You can write codes with types.


## Install

```sh
npm install -g kdx
```

## Get started

```sh
# clone a template
git clone https://github.com/shellyln/kdx-project-template.git MyProject
cd MyProject
rm -rf .git/
git init
npm install

# configure
vi .env
vi meta/meta-info.json

# first pull and push
kdx pull MyApp1
npm run build
kdx push MyApp1 --force

# debug app
npm run serve:MyApp1

# first commit
git add .
git commit -m "initial commit"
```

See also:
[https://github.com/shellyln/kdx-project-template](https://github.com/shellyln/kdx-project-template)


## Commands

```
kdx - kintone CLI for development & deployment, with Developer Experience

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
```

### Pull from kintone

* Pull one app:
```sh
kdx pull <AppName>
```

* Pull all apps:
```sh
kdx pull --all
```

### Push to kintone

* Push one app:
```sh
kdx push <AppName>
```

* Push all apps:
```sh
kdx pull --all
```

* Push one app (ignore revision / deproying to the other app):
```sh
kdx push <AppName> --force
```

### Fetch from kintone
Similar to `pull`, but no code generation is performed.

* Fetch one app:
```sh
kdx fetch <AppName>
```

* Fetch all apps:
```sh
kdx fetch --all
```

### Generate definition and validation codes from `meta/**/*.json` info

* Generate code for one app:
```sh
kdx gen-schema <AppName>
```

* Generate code for all apps:
```sh
kdx gen-schema --all
```

### Generate definition and validation codes from `schema/*.tss` info
Similar to `gen-schema`, but it uses pre-generated `schema/*.tss`.

* Generate code for one app:
```sh
kdx compile-schema <AppName>
```

* Generate code for all apps:
```sh
kdx compile-schema --all
```

### Switch target profile

```sh
kdx switch <ProfileName>
```


## Configurations

### .env

```
TARGET = development

KINTONE_URL_development      = https://XXXXXXXX.cybozu.com
KINTONE_USERNAME_development = XXXXXXXXXXXXXXXXXXXXXXXXXX
KINTONE_PASSWORD_development = XXXXXXXXXXXXXXXXXXXXXXXXXX

KINTONE_URL_staging          = https://XXXXXXXX.cybozu.com
KINTONE_USERNAME_staging     = XXXXXXXXXXXXXXXXXXXXXXXXXX
KINTONE_PASSWORD_staging     = XXXXXXXXXXXXXXXXXXXXXXXXXX

KINTONE_URL_production       = https://XXXXXXXX.cybozu.com
KINTONE_USERNAME_production  = XXXXXXXXXXXXXXXXXXXXXXXXXX
KINTONE_PASSWORD_production  = XXXXXXXXXXXXXXXXXXXXXXXXXX
```


### ${projectDir}/meta/meta-info.json

```json
{
    "apps": {
        "foo": {              // <- App name
            "development": {  // <- Target profile
                "appId": 38,  // <- App id
                "preview": false
            },
            "staging": {
                "appId": 22,
                "guestSpaceId": 10,
                "preview": false
            },
            "production": {
                "appId": 43,
                "guestSpaceId": 10,
                "preview": true
            }
        },
        "bar": {
            "development": {
                "appId": 44,
                "guestSpaceId": 5,
                "preview": false
            },
            "staging": {
                "appId": 22,
                "guestSpaceId": 10,
                "preview": false
            },
            "production": {
                "appId": 43,
                "guestSpaceId": 10,
                "preview": true
            }
        }
    }
}
```


### ${projectDir}/meta/apps/${appName}/_views.json

* View settings
  * `views.json` will re-generate from this file.

```json
{
    "Qwerty": {           // <- View name
        "view": {
            "type": "CUSTOM",
            "filterCond": "",
            "sort": "Record_number desc",
            "index": "0",
            "html": "<div>Hello, World!</div>",
            "pager": true,
            "device": "ANY"
        },
        "development": {  // <- Target profile
            "id": "5123450",
            "name": "View 1"
        },
        "staging": {
            "id": "5123451",
            "name": "View 1"
        },
        "production": {
            "id": "5123452",
            "name": "View 1"
        }
    },
    "5123456": {
        "view": {
            "type": "LIST",
            "filterCond": "",
            "sort": "Record_number desc",
            "index": "1",
            "fields": [
                "Record_number",
                "Text",
                "Created_by",
                "Created_datetime"
            ]
        },
        "development": {
            "id": "5123456",
            "name": "View 2"
        }
    },
    "5123457": {
        "view": {
            "type": "LIST",
            "filterCond": "",
            "sort": "Record_number desc",
            "index": "2",
            "fields": [
                "Record_number",
                "Text",
                "Created_by",
                "Created_datetime"
            ]
        },
        "development": {
            "id": "5123457",
            "name": "View 3"
        }
    },
    "5123458": {
        "view": {
            "type": "CALENDAR",
            "filterCond": "",
            "sort": "Record_number desc",
            "index": "3",
            "date": "Updated_datetime",
            "title": "Text"
        },
        "development": {
            "id": "5123458",
            "name": "View 4"
        }
    }
}
```

### ${projectDir}/meta/apps/${appName}/_resources.json

* JavaScript and CSS settings
  * `customize.json` will re-generate from this file.

```json
{
    "js": [
        {
            "name": "react.production.min.js",
            "target": ["desktop", "mobile"],
            "file": "https://cdnjs.cloudflare.com/ajax/libs/react/16.13.0/cjs/react.production.min.js"
        },
        {
            "name": "bbb.js",
            "target": ["desktop", "mobile"],
            "file": {
                "development": "https://localhost:8034/index.js", // URL
                "staging":     "project:bin/apps/foo/index.js",   // Upload the project local file
                "production":  "project:bin/apps/foo/index.js"
            }
        },
        {
            "name": "ddd.js",
            "target": ["desktop", "mobile"],
            "file": {
                "development": "filekey:2020XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Keep the file uploaded by Web Settings console
                "staging":     "project:bin/apps/foo/ddd.js",
                "production":  "project:bin/apps/foo/ddd.js"
            }
        }
    ],
    "css": [
        {
            "name": "aaa.css",
            "target": ["desktop", "mobile"],
            "file": "project:static-resources/aaa.css"
        },
        {
            "name": "ccc.css",
            "target": ["desktop", "mobile"],
            "file": {
                "development": "https://localhost:8034/index.css",
                "staging":     "project:bin/apps/foo/index.css",
                "production":  "project:bin/apps/foo/index.css"
            }
        }
    ]
}
```

---

## License
MIT  
Copyright (c) 2020 Shellyl_N and Authors

---

### Bundled softwares' license
* 51-modern-default.css - Copyright (c) 2014 Cybozu (MIT)
* @kintone/rest-api-client (type definitions) - Copyright (c) Cybozu (MIT)
