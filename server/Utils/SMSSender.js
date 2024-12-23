const axios = require('axios');
require("dotenv").config()

exports.sendSMS = async (mobileNumber, message) => {
    const SMS_API_KEY = process.env.SMS_API_KEY;
    const SMS_USER_NAME = process.env.SMS_USER_NAME;
    const SMS_SENDER_NAME = process.env.SMS_SENDER_NAME;
    const SMS_TYPE = process.env.SMS_TYPE;
    const url = `http://sms.hspsms.com/sendSMS`;
    const params = {
        username: SMS_USER_NAME,              // Your username
        message: message,                 // The message to send
        sendername: SMS_SENDER_NAME,                // Sender name
        smstype: SMS_TYPE,                 // SMS type
        numbers: mobileNumber,            // Mobile number(s) separated by comma for multiple numbers
        apikey: SMS_API_KEY // Your API key
    };

    try {
        const response = await axios.get(url, { params });
        console.log('SMS sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};