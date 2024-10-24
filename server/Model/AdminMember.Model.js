const mongoose = require('mongoose')

const AdminMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        default: 'AdminMember'
    }
})

AdminMemberSchema.pre('save', async function (next) {
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

// Method to compare passwords
AdminMemberSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};


const AdminMember = mongoose.model('AdminMember',AdminMemberSchema)
module.exports = AdminMember