require('dotenv').config();
const axios = require('axios');

exports.SendWhatsapp = async (phone, template, Param) => {
    const LicenseNumber = process.env.LICENSE_NUMBER;
    const apiKey = process.env.WHATSAPP_API_KEY;
    const templateId = template;
    const baseUrl = `https://ai.advanzala.in/api/sendtemplate.php?LicenseNumber=${LicenseNumber}&APIKey=${apiKey}&Contact=91${phone}&Template=${templateId}`;
    console.log("Param:", Param);

    try {
        // Check if Param is defined and handle both single and multiple values
        let paramString = '';
        if (Param) {
            // If Param is an array, join the values with commas
            if (Array.isArray(Param)) {
                paramString = `&Param=${Param.join(',')}`;
            } else {
                // If Param is a single value, just use it as a string
                paramString = `&Param=${Param}`;
            }
        }

        console.log("Param string:", paramString);
        console.log("Url:", `${baseUrl}${paramString}`);

        const res = await axios.get(`${baseUrl}${paramString}`);

        console.log("Response from API:", res.data);
        console.log("Response from API:", res?.data?.ApiMessage?.ErrorMessage);
        if (res.data.ApiResponse === "Success") {
            console.log("Message sent successfully!");
        }
    } catch (error) {

        console.log("Internal server error in sending Whatsapp", error);
        // Enhanced error handling
        if (error.response) {
            console.error(`API error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error in setting up the request:", error.message);
        }
        throw new Error('Failed to send WhatsApp message');
        // console.error("Internal server error", error);
    }
};


exports.SendOtpWhatsapp = async (phone, Param) => {
    const LicenseNumber = process.env.LICENSE_NUMBER;
    const apiKey = process.env.WHATSAPP_API_KEY;
    // const templateId = template;
    // const baseUrl = `https://ai.advanzala.in/api/sendtemplate.php?LicenseNumber=${LicenseNumber}&APIKey=${apiKey}&Contact=91${phone}&Template=${templateId}`;
    try {
        // Check if Param is defined and handle both single and multiple values
        // let paramString = '';
        // if (Param) {
        //     if (Array.isArray(Param)) {
        //         paramString = `&Param=${Param.join(',')}`;
        //     } else {
        //         paramString = `&Param=${Param}`;
        //     }
        // }

        // console.log("Param string:", paramString);
        // console.log("Url:", `${baseUrl}${paramString}`);

        const res = await axios.get(`https://ai.advanzala.in/api/sendtemplate.php?LicenseNumber=${LicenseNumber}&APIKey=${apiKey}&Contact=91${phone}&Template=verificatation_passcode_new&Param=${Param}&URLParam=${Param}`);

        console.log("Response from API:", res.data);
        console.log("Response from API:", res?.data?.ApiMessage?.ErrorMessage);
        if (res.data.ApiResponse === "Success") {
            console.log("Message sent successfully!");
        }
    } catch (error) {
        console.log("Internal server error in sending Whatsapp", error);
        // Enhanced error handling
        if (error.response) {
            console.error(`API error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error in setting up the request:", error.message);
        }

        console.error("Internal server error", error);
    }
}