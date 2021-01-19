export class AccessCode {
    access_token: string;
    expires_in: number;
    token_type: string
}

let accessToken: AccessCode;
export const SetAccessToken = function (token: AccessCode) {
    accessToken = token;
}

export const GetAccessToken = function () {
    return accessToken;
}