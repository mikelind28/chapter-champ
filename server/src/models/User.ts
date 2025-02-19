import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    }
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    toObject: {
      getters: true
    },
  }
);

// hash user password
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = model<UserDocument>('User', userSchema);

export default User;
