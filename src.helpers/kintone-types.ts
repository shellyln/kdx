// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln



export interface SubmitEvent<T> {
    appId: number;
    record: T;
    recordId: number;
    type: 'app.record.create.submit' |
          'mobile.app.record.create.submit' |
          'app.record.edit.submit' |
          'mobile.app.record.edit.submit' |
          'app.record.index.edit.submit';
    error?: string;
}
