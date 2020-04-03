export interface MetaIndex {
    apps: {
        [propName0: string]: {
            [propName0: string]: {
                appId: number;
                guestSpaceId?: number;
                preview: boolean;
            };
        };
    };
}

export interface MetaHashIndex {
    [propName0: string]: string;
}

export interface MetaResourceEntry {
    name: string;
    target: string[];
    file: (string | {
        [propName0: string]: string;
    });
}

export interface MetaResourcesIndex {
    js: MetaResourceEntry[];
    css: MetaResourceEntry[];
}

export interface ViewEntryBase {
    index: (string | number);
    builtinType?: 'ASSIGNEE';
    filterCond: string;
    sort: string;
}

export interface ListViewEntry extends ViewEntryBase {
    type: 'LIST';
    fields: string[];
}

export interface CalendarViewEntry extends ViewEntryBase {
    type: 'CALENDAR';
    date: string;
    title: string;
}

export interface CustomViewEntry extends ViewEntryBase {
    type: 'CUSTOM';
    html: string;
    pager: boolean;
    device: ('DESKTOP' | 'ANY');
}

export type ViewEntry = (ListViewEntry | CalendarViewEntry | CustomViewEntry);

export interface MetaViewsIndex {
    [propName0: string]: {
        view: ViewEntry;
        [propName0: string]: {
            id: string;
            name: string;
        };
    };
}

