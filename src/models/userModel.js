import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
    {
      firstName: {
        type: String,
        required: [true, "First Name is required"],
        minlength: [5, "First name must be atleast 5 character long"],
        lowercase: true,
        trim: true, // if the user gives extra spaces then it will automatically remove it
        maxlength: [20, "First name should be less than or equal to 20 characters"]
    },

    lastName: {
        type: String,
        minlength: [5, "Last name must be atleast 5 character long"],
        lowercase: true,
        trim: true, // if the user gives extra spaces then it will automatically remove it
        maxlength: [20, "Last name should be less than or equal to 20 characters"]
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

// Hashes password before saving to the database
userSchema.pre('save', async function(){
  this.password = await bcrypt.hash(this.password, 10);
})

const User = model('User', userSchema);

export default User;