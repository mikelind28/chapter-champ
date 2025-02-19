import { type Document } from 'mongoose';
export interface UserDocument extends Document {
    _id: string;
    email: string;
    password: string;
    isCorrectPassword(password: string): Promise<boolean>;
}
declare const User: import("mongoose").Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument> & UserDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default User;
