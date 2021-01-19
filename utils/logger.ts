export const _logger = (msg: string, data?: any) => {
    console.log(`${new Date().toUTCString()} ${msg}`, data);
}