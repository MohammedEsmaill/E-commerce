import * as bcrypt from 'bcrypt';
export const Hash = (plainText: string,saltRounds: number=Number(process.env.SALT_ROUNDS)): string => {
    return bcrypt.hashSync(plainText,saltRounds);
}

export const compare = (plainText: string,hashed: string): boolean => {
    return bcrypt.compareSync(plainText,hashed);
}