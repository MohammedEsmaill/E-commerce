import * as CryptoJS from 'crypto-js';
export const Encrypt = (plainText: string,secret: string = process.env.ENCRYPT_SECRET_KEY as string): string => {
    return CryptoJS.AES.encrypt(plainText, secret).toString();
}

export const Decrypt = (cipherText: string,secret: string = process.env.ENCRYPT_SECRET_KEY as string): string => {
    return CryptoJS.AES.decrypt(cipherText, secret).toString(CryptoJS.enc.Utf8);
}