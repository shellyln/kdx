// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import * as path                 from 'path';
import * as crypto               from 'crypto';
import { config }                from 'dotenv';
import { TypeAssertion,
         ValidationContext }     from 'tynder/modules/types';
import { deserializeFromObject } from 'tynder/modules/serializer';
import { validate as validate_ } from 'tynder/modules/validator';
import KintoneMetaSchema_        from '../../schema-compiled/kintone-meta';
import KdxMetaSchema_            from '../../schema-compiled/kdx-meta';



const ENV_PATH = path.join(__dirname, '../.env');
export const dotenv = config({
    path: ENV_PATH,
});

export const TARGET_PROFILE = (dotenv.parsed ? dotenv.parsed['TARGET'] : void 0) ?? 'development';


export const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
export const hash = (s: string) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');


export const KintoneMetaSchema = deserializeFromObject(KintoneMetaSchema_);
export const KdxMetaSchema = deserializeFromObject(KdxMetaSchema_);


export function validate<T>(data: any, ty: TypeAssertion, ctx?: Partial<ValidationContext>) {
    const z = validate_<T>(data, ty, ctx);
    if (!z) {
        throw new Error(JSON.stringify(ctx?.errors));
    }
    return z.value;
}


export const escapeString = (s: string) => {
    return (s
        // eslint-disable-next-line no-control-regex
        .replace(/\x08/g, '\\b')
        .replace(/\f/g, '\\f')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\v/g, '\\v')
        .replace(/\\/g, '\\\\')
        // eslint-disable-next-line no-useless-escape
        .replace(/\'/g, '\\\'')
        // eslint-disable-next-line no-useless-escape
        .replace(/\"/g, '\\\"')
        // eslint-disable-next-line no-useless-escape
        .replace(/\`/g, '\\\`')
    );
};
