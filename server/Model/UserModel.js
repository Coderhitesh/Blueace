const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: [true, "Please provide a Full Name"]
    },
    ContactNumber: {
        type: String,
        unique: true,
        required: [true, "Please provide a Contact Number"]
    },
    Email: {
        type: String,
        required: [true, "Please provide an Email"],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    Password: {
        type: String,
        required: [true, "Please provide a Password"]
    },
    PasswordChangeOtp: {
        type: String
    },
    OtpExpiredTime: {
        type: Date
    },
    NewPassword: {
        type: String
    },
    Role: {
        type: String,
        enum: ['Customer', 'Admin'],
        default: 'Customer'
    },
    UserType:{
        type:String,
        enum: ['Normal', 'Corporate'],
        default: 'Normal'
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    City: {
        type: String,
    },
    PinCode: {
        type: String,
        match: [/^\d{6}$/, 'Please enter a valid PinCode with 6 digits']
    },
    HouseNo: {
        type: String,
        required: true
    },
    Street: {
        type: String,
        required: true
    },
    NearByLandMark: {
        type: String,
        required: true
    },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('Password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(user.Password, 10);
        user.Password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.index({ latitude: 1, longitude: 1 });

// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;