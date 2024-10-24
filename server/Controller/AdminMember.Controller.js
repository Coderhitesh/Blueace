const AdminMember = require('../Model/AdminMember.Model');
const sendEmail = require('../Utils/SendEmail');
const sendToken = require('../Utils/SendToken');

exports.createAdminMember = async (req, res) => {
    try {
        const { name, ContactNumber, Email, Password } = req.body;
        const emptyField = [];
        if (!name) emptyField.push('Name')
        if (!ContactNumber) emptyField.push('ContactNumber')
        if (!Email) emptyField.push('Email')
        if (!Password) emptyField.push('Password')
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            })
        }

        const existingAdminMember = await AdminMember.findOne({ Email });
        if (existingAdminMember) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            })
        }

        const existingVendorNumber = await AdminMember.findOne({ ContactNumber });
        if (existingVendorNumber) {
            return res.status(403).json({
                success: false,
                message: "Number already exists"
            });
        }

        if (Password.length <= 6) {
            return res.status(403).json({
                success: false,
                msg: 'Password Length Must be Greater than 6 Digits'
            });
        }

        const AdminMemberData = {
            name,
            ContactNumber,
            Email,
            Password,
        }

        const newMember = new AdminMember(AdminMemberData)

        await newMember.save()

        const emailOptions = {
            email: Email,
            subject: 'Welcome to Blueace!',
            message: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            background-color: #f5f5f5;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .header {
                            background-color: #007bff;
                            color: #fff;
                            padding: 10px;
                            text-align: center;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content p {
                            margin-bottom: 10px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Blueace, ${name}!</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${name},</p>
                            <p>We are excited to inform you that you have been successfully added as a member of Blueace.</p>
                            <p>As a member, you will now have access to exclusive resources and support from our team.</p>
                            <p>If you have any questions or need further assistance, feel free to reach out to us at any time.</p>
                        </div>
                        <div class="footer">
                            <p>Best regards,</p>
                            <p>The Blueace Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await sendEmail(emailOptions)

        await sendToken(newMember, res, 201)

    } catch (error) {
        console.log("Internal server error in creating the member", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in creating the  member",
            error: error.message

        })
    }
}