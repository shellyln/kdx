export type AppID = (string | number);

export type RecordID = (string | number);

export type Revision = (string | number);

export type Lang = ('ja' | 'en' | 'zh' | 'user' | 'default');

export interface MetaSettings {
    name: string;
    description: string;
    icon: ({
        type: 'FILE';
        file: {
            contentType: string;
            fileKey: string;
            name: string;
            size: string;
        };
    } | {
        type: 'PRESET';
        key: string;
    });
    theme: ('WHITE' | 'CLIPBOARD' | 'BINDER' | 'PENCIL' | 'CLIPS' | 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK');
    revision: string;
}

export interface AssigneeEntity {
    entity: ({
        type: ('USER' | 'GROUP' | 'ORGANIZATION' | 'FIELD_ENTITY' | 'CUSTOM_FIELD');
        code: string;
    } | {
        type: 'CREATOR';
        code?: null;
    });
    includeSubs: boolean;
}

export interface State {
    index: (string | number);
    name: string;
    assignee: {
        type: ('ONE' | 'ALL' | 'ANY');
        entities: AssigneeEntity[];
    };
}

export interface Action {
    name: string;
    from: string;
    to: string;
    filterCond: string;
}

export interface MetaStatus {
    enable?: (boolean | null);
    states?: ({
        [propName0: string]: State;
    } | null);
    actions?: (Action[] | null);
    revision?: Revision;
}

export interface FieldBase {
    code: string;
    label: string;
}

export interface StatusField {
    type: 'STATUS';
}

export interface StatusAssigneeField {
    type: 'STATUS_ASSIGNEE';
}

export type Field = (StatusField | StatusAssigneeField);

export interface MetaFields {
    properties: {
        [propName0: string]: {};
    };
    revision?: Revision;
}

export interface MetaLayout {
    layout: {}[];
    revision?: Revision;
}

export interface ViewBase {
    index: (string | number);
    builtinType?: 'ASSIGNEE';
    id: string;
    name: string;
    filterCond: string;
    sort: string;
}

export interface ListView extends ViewBase {
    type: 'LIST';
    fields: string[];
}

export interface CalendarView extends ViewBase {
    type: 'CALENDAR';
    date: string;
    title: string;
}

export interface CustomView extends ViewBase {
    type: 'CUSTOM';
    html: string;
    pager: boolean;
    device: ('DESKTOP' | 'ANY');
}

export type View = (ListView | CalendarView | CustomView);

export interface MetaViews {
    views: {
        [propName0: string]: View;
    };
    revision?: Revision;
}

export interface AppRightEntity {
    entity: ({
        type: ('USER' | 'GROUP' | 'ORGANIZATION');
        code: string;
    } | {
        type: 'CREATOR';
        code: null;
    });
    includeSubs: boolean;
    appEditable: boolean;
    recordViewable: boolean;
    recordAddable: boolean;
    recordEditable: boolean;
    recordDeletable: boolean;
    recordImportable: boolean;
    recordExportable: boolean;
}

export interface MetaAclApp {
    rights: AppRightEntity[];
    revision?: Revision;
}

export interface FieldRightEntity {
    accessibility: ('READ' | 'WRITE' | 'NONE');
    entity: {
        code: string;
        type: ('USER' | 'GROUP' | 'ORGANIZATION' | 'FIELD_ENTITY');
    };
    includeSubs: boolean;
}

export interface FieldRight {
    code: string;
    entities: FieldRightEntity[];
}

export interface MetaAclField {
    rights: FieldRight[];
    revision?: Revision;
}

export interface RecordRightEntity {
    entity: {
        code: string;
        type: ('USER' | 'GROUP' | 'ORGANIZATION' | 'FIELD_ENTITY');
    };
    viewable: boolean;
    editable: boolean;
    deletable: boolean;
    includeSubs: boolean;
}

export interface RecordRight {
    entities: RecordRightEntity[];
    filterCond: string;
}

export interface MetaAclRecord {
    rights: RecordRight[];
    revision?: Revision;
}

export type AppCustomizeScope = ('ALL' | 'ADMIN' | 'NONE');

export type AppCustomizeResource = ({
    type: 'URL';
    url: string;
} | {
    type: 'FILE';
    file: {
        fileKey: string;
        name: string;
        contentType: string;
        size: string;
    };
});

export interface AppCustomize {
    js: AppCustomizeResource[];
    css: AppCustomizeResource[];
}

export interface MetaCustomize {
    scope?: AppCustomizeScope;
    desktop?: AppCustomize;
    mobile?: AppCustomize;
    revision?: Revision;
}

