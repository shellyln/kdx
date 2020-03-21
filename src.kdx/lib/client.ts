// Copyright (c) 2020 Shellyl_N and Authors
// license: MIT
// https://github.com/shellyln

import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { dotenv }               from './util';



function getClient(profile: string, guestSpaceId: number | undefined) {
    const additionalParams: any = {};

    if (dotenv.parsed && dotenv.parsed['KINTONE_BASIC_AUTH_USERNAME_' + profile]) {
        additionalParams.basicAuth = {};
        additionalParams.basicAuth.username = dotenv.parsed['KINTONE_BASIC_AUTH_USERNAME_' + profile];
        additionalParams.basicAuth.password = dotenv.parsed['KINTONE_BASIC_AUTH_PASSWORD_' + profile];
    }

    if (typeof guestSpaceId === 'number') {
        additionalParams.guestSpaceId = guestSpaceId;
    }

    return new KintoneRestAPIClient({
        ...additionalParams,
        baseUrl: dotenv.parsed ? dotenv.parsed['KINTONE_URL_' + profile] : void 0,
        auth: {
            username: dotenv.parsed ? dotenv.parsed['KINTONE_USERNAME_' + profile] : void 0,
            password: dotenv.parsed ? dotenv.parsed['KINTONE_PASSWORD_' + profile] : void 0,
        }
    });
}

export default getClient;
