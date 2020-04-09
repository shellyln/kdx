// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln



export interface RecordFieldBase {
    error?: string;
    disabled?: boolean;
}


/*
STATUS
CATEGORY
NUMBER
SINGLE_LINE_TEXT
MULTI_LINE_TEXT
RICH_TEXT
LINK
DATE
DATETIME
TIME
RADIO_BUTTON
DROP_DOWN
CHECK_BOX
MULTI_SELECT
USER_SELECT
GROUP_SELECT
ORGANIZATION_SELECT
SUBTABLE
CALC
FILE
STATUS_ASSIGNEE
RECORD_NUMBER
CREATED_TIME
CREATOR
UPDATED_TIME
MODIFIER
REFERENCE_TABLE
GROUP

__ID__
__REVISION__
*/


export interface SimpleValueRecordField extends RecordFieldBase {
    type: 'SINGLE_LINE_TEXT' |
          'NUMBER' |
          'CALC' |
          'MULTI_LINE_TEXT' |
          'RICH_TEXT' |
          'RADIO_BUTTON' |
          'DROP_DOWN' |
          'LINK' |
          'DATE' |
          'TIME' |
          'DATETIME' |
          'STATUS' |
          '__ID__' |
          '__REVISION__';
    value: string;
    lookup?: boolean | 'UPDATE';
}


export interface MultiSelectRecordField extends RecordFieldBase {
    type: 'CHECK_BOX' |
          'MULTI_SELECT' |
          'CATEGORY';
    value: string[];
    lookup?: boolean | 'UPDATE';
}


export interface UserGroupOrgSelectRecordField extends RecordFieldBase {
    type: 'USER_SELECT' |
          'STATUS_ASSIGNEE' |
          'ORGANIZATION_SELECT' |
          'GROUP_SELECT';
    value: Array<{
        code: string;
        name: string;
    }>;
    lookup?: boolean | 'UPDATE';
}


export interface SubTableRecordField extends RecordFieldBase {
    type: 'SUBTABLE';
    value: {
        [subFieldCode: string]: RecordField;
    };
}


export interface FileRecordField extends RecordFieldBase {
    type: 'FILE';
    value: Array<{
        contentType: string;
        fileKey: string;
        name: string;
        size: string;
    }>;
}


export type RecordField =
    SimpleValueRecordField |
    MultiSelectRecordField |
    UserGroupOrgSelectRecordField |
    SubTableRecordField |
    FileRecordField;
export type RecordFieldForApiUpdate = Pick<RecordField, 'value'> | RecordField;


export type IndexShowEventBase = {
    appId: number;
    viewId: string;
    viewName: string;
    type: 'app.record.index.show' |
          'mobile.app.record.index.show';
};


export type IndexShowEvent<T> = IndexShowEventBase & ({
    viewType: 'list' | 'custom';
    records: T[];
} | {
    viewType: 'calendar';
    records: {
        [dateStr: string]: T[];
    };
});


export interface DetailShowEvent<T> {
    appId: number;
    record: T;
    recordId: number;
    type: 'app.record.detail.show' |
          'mobile.app.record.detail.show';
}


export interface CreateShowEvent<T> {
    appId: number;
    reuse: boolean;
    record: T;
    recordId: number;
    type: 'app.record.create.show' |
          'mobile.app.record.create.show';
    error?: string;
}


export interface EditShowEvent<T> {
    appId: number;
    record: T;
    recordId: number;
    type: 'app.record.edit.show' |
          'mobile.app.record.edit.show' |
          'app.record.index.edit.show';
    error?: string;
}


export interface ChangeEvent<T> {
    appId: number;
    record: T;
    recordId: number;
    changes: {
        field: RecordField;
        row?: {
            [subFieldCode: string]: RecordField;
        } | null;
    };
    type: string;
    error?: string;
}


export interface SubmitEvent<T> {
    appId: number;
    record: T;
    recordId: number;
    type: 'app.record.create.submit' |
          'mobile.app.record.create.submit' |
          'app.record.edit.submit' |
          'mobile.app.record.edit.submit' |
          'app.record.index.edit.submit' |
          'app.record.detail.delete.submit' |
          'mobile.app.record.detail.delete.submit' |
          'app.record.index.delete.submit';
    error?: string;
}


export interface SubmitSucceededEvent<T> {
    appId: number;
    record: T;
    recordId: number;
    type: 'app.record.create.submit.success' |
          'mobile.app.record.create.submit.success' |
          'app.record.edit.submit.success' |
          'mobile.app.record.edit.submit.success' |
          'app.record.index.edit.submit.success';
}


export interface ProcessProceedEvent<T> {
    appId: number;
    record: T;
    type: 'app.record.detail.process.proceed' |
          'mobile.app.record.detail.process.proceed';
    error?: string;
    action: { value: string };
    status: { value: string };
    nextStatus: { value: string };
}


export interface ReportShowEvent {
    appId: number;
    type: 'app.report.show' |
          'mobile.app.report.show';
}
