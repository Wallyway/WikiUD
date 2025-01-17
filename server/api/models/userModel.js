import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    // id:{
    //     type: String,
    //     required: true
    // },
    username: {
        type: String,
        required: true,
        trim:true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


//================= Pre-Save Hook for Password Hashing =================

//     How It Works:
// Salt Generation: A unique salt is created to make the hashed password more secure.
// Password Hashing: The plain-text password is hashed using the generated salt.
// Error Handling: Any errors that occur during this process are caught and passed to the next middleware.

userSchema.pre('save', async function(next) {
    try {
      // Check if the password has been modified
      if (!this.isModified('password')) return next();
      
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      
      next(); // Proceed to save
    } catch (error) {
      next(error); // Pass any errors to the next middleware
    }
});


//================= Password Verification Method =================

//   Validating Passwords:
// To authenticate users, we need a method to compare the entered password
// with the hashed password stored in the database.
userSchema.methods.isValidPassword = async function(newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
      throw new Error(error);
    }
};

export default mongoose.model('User', userSchema);