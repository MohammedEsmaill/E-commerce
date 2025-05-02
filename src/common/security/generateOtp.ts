import * as otpGenerator from 'otp-generator';

export const generateOtp = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
}

export const generatecustomId = (prefix: string) => `${prefix}${generateOtp()}`