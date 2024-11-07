import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Name is required"],
            minlength: [5, "Name must be at least 5 characters"],
            maxlength: [30, "Name should be at less than 30 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              'Please fill in a valid email address',
            ], // Matches email against regex
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Will not select password upon looking up a document
        },
        subscription: {
            id: String,
            status: String,
          },
          avatar: {
            public_id: {
              type: String,
            },
            secure_url: {
              type: String,
            },
          },
          role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
          },
          forgetPasswordToken: String,
          forgetPasswordExpiry: Date,
}, {
    timestamps: true,
});

const User = model('User', userSchema);

export default User;