import { ValidationError } from '@domain/errors/AppError.js';
import type IHashService from '@domain/service/hash.service.js';
import bcrypt from 'bcrypt';

export default class HashService implements IHashService {
    async hash(password: string): Promise<string> {
        if(!password || password.length == 0){
            throw new ValidationError(['Not found password'])
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }

    async compare(password: string, hash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }
}