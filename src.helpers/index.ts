// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { ValidationContext,
         TypeAssertion,
         ObjectAssertion, 
         TypeAssertionMap }                 from 'tynder/modules/types';
import { validate }                         from 'tynder/modules/validator';
import { stereotypes as dateStereotypes }   from 'tynder/modules/stereotypes/date';
import { constraints as uniqueConstraints } from 'tynder/modules/constraints/unique';
import { SubmitEvent }                      from './kintone-types';



const SUBTABLE_ID_FIELD = '$$_subtable_id_$$';


export function mapRecord(rec: any): unknown {
    const ret = {};
    const keys = Object.keys(rec);

    const subTableMapper = (x: any) => {
        const r = mapRecord(x.value);
        (r as any)[SUBTABLE_ID_FIELD] = x.id;
        return r;
    };

    for (const k of keys) {
        if (rec[k].value === void 0) {
            continue;
        }
        switch (rec[k].type) {
        case 'NUMBER':
            ret[k] = typeof rec[k].value === 'string' ?
                Number(rec[k].value.replace(/[,]/g, '')) :
                rec[k].value;
            if (Number.isNaN(ret[k])) {
                ret[k] = null;
            }
            break;
        case 'SUBTABLE':
            ret[k] = rec[k].value.map(subTableMapper);
            break;
        default:
            ret[k] = rec[k].value;
            break;
        }
    }
    return ret;
}


function getObjectTypeMembers(members: Map<string, TypeAssertion>, ty: TypeAssertion) {
    if (ty.kind !== 'object') {
        throw new Error(`Unexpected type assertion kind: ${ty.kind} (${ty.typeName})`);
    }
    for (const m of ty.members) {
        members.set(m[0], m[1]);
    }
    return members;
}


export function writeBackToKintoneRecord<T, U>(rec: T, input: U, ty: TypeAssertion): T {
    const members = new Map<string, TypeAssertion>();
    if (ty.kind === 'one-of') {
        for (const one of ty.oneOf) {
            getObjectTypeMembers(members, one);
        }
    } else {
        getObjectTypeMembers(members, ty);
    }

    for (const k of members.keys()) {
        const mTy = members.get(k) as TypeAssertion;
        if (rec[k] === void 0 || rec[k] === null) {
            // NOTE: fieldType 'STATUS' and 'CATEGORY' are readonly.
            // const fieldType = mTy.meta.fieldType;
            // if (fieldType === 'STATUS' || fieldType === 'CATEGORY') {
            //     continue;
            // }

            // NOTE: If field permission is set to not visible, rec[k] should not have a value.
            // rec[k] = { type: fieldType, value: void 0 };
            continue;
        }
        if (input[k] === void 0 || input[k] === null) {
            rec[k].value = void 0;
            continue;
        }

        switch (rec[k].type || mTy.meta?.fieldType) {
        case 'NUMBER':
            rec[k].value = String(input[k]);
            break;
        case 'SUBTABLE':
            {
                const r: any[] = [];
                for(const q of input[k]) {
                    let s: any = null;
                    if (q[SUBTABLE_ID_FIELD] !== null && q[SUBTABLE_ID_FIELD] !== void 0) {
                        s = (rec[k].value as any[]).find(x => x.id === q[SUBTABLE_ID_FIELD]);
                        if (!s) {
                            throw new Error(`Missing subtable id is found: ${q[SUBTABLE_ID_FIELD]}`);
                        }
                    } else {
                        s = { id: null, value: {} };
                    }
                    const subTy = mTy.kind === 'optional' ? mTy.optional : mTy;
                    if (subTy.kind !== 'repeated') {
                        throw new Error(`Subtable type should be repeated: ${subTy.kind}`);
                    }
                    writeBackToKintoneRecord(s.value, q, subTy.repeated);
                    r.push(s);
                }
                rec[k].value = r;
            }
            break;
        default:
            rec[k].value = input[k];
            break;
        }
    }
    return rec;
}


export function removeBlankTableRow(rec: any, tableFieldCode: string): unknown {
    const validRecs = [];
    for (const r of rec[tableFieldCode].value) {
        if (r.id !== null) {
            validRecs.push(r);
            continue;
        }
        const keys = Object.keys(r.value);
        for (const k of keys) {
            const q = r.value[k];
            if (q.type === 'CALC') {
                continue;
            }
            if (q.value !== void 0 && q.value !== null && q.value !== '') {
                validRecs.push(r);
                break;
            }
        }
    }
    rec[tableFieldCode].value = validRecs;
    return rec;
}


export function displayValidationErrorMessages<T>(
        event: SubmitEvent<T>,
        ctx: Partial<ValidationContext>): SubmitEvent<T> {

    for (const m of ctx.errors ?? []) {
        const dp = m.dataPath.split('.').map(x => x.split(':').slice(-1)[0]);
        const fieldCode = dp[0];
        if (m.dataPath.includes('repeated).')) {
            const index = /\.\(([0-9]+):repeated\)\./.exec(m.dataPath);
            if (index) {
                const subFieldCode = dp[dp.length - 1];
                event.record[fieldCode].value[Number(index[1])].value[subFieldCode].error = m.message;
            }
        } else {
            if (event.record[fieldCode]) {
                event.record[fieldCode].error = m.message;
            }
        }
    }
    event.error = 'Validation error';
    return event;
}



const ctxGen: Partial<ValidationContext> = {
    checkAll: true,
    stereotypes: new Map([...dateStereotypes]),
    customConstraints: new Map([...uniqueConstraints]),
};


export function validateThen<T>(
        ev: SubmitEvent<unknown>,
        schema: TypeAssertionMap,
        tyApp: TypeAssertion,
        fn: (rec: T, ev: SubmitEvent<unknown>) => T | void,
        errFn?: (ev: SubmitEvent<unknown>) => void) {

    for (const m of (tyApp as ObjectAssertion).members) {
        if (m[1].meta.fieldType === 'SUBTABLE') {
            ev.record = removeBlankTableRow(ev.record, m[0]);
        }
    }
    const unknownInput = mapRecord(ev.record);

    const ctx = {
        ...ctxGen,
        schema,
    }

    const validated = validate<T>(unknownInput, tyApp, ctx);
    if (! validated) {
        displayValidationErrorMessages(ev, ctx);
        try {
            if (errFn) {
                errFn(ev);
            }
        } catch (e) {
            ev.error = e.message;
        }
        return ev;
    }

    const rec = validated.value;

    try {
        const retVal = fn(rec, ev);
        if (retVal) {
            writeBackToKintoneRecord(ev.record, retVal, tyApp);
        }
    } catch (e) {
        ev.error = e.message;
        try {
            if (errFn) {
                errFn(ev);
            }
        } catch (e2) {
            ev.error = e2.message;
        }
    }

    return ev;
}
