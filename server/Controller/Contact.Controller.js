const Contact = require('../Model/Contact.Model')

exports.createContact = async (req, res) => {
    try {
        const {
            name,
            email,
            subject,
            mobile,
            message
        } = req.body;
        const emptyField = []
        if (!name) emptyField.push('Name')
        if (!email) emptyField.push('Email')
        if (!subject) emptyField.push('subject')
        if (!mobile) emptyField.push('mobile')
        if (!message) emptyField.push('message')
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }
        const contact = new Contact({
            name,
            email,
            subject,
            mobile,
            message
        })
        const newContact = await contact.save()
        if (!newContact) {
            return res.status(400).json({
                success: false,
                message: 'Contact not save',
            });
        }
        res.status(201).json({
            success: true,
            message: 'Contact saved successfully',
            data: newContact
        })
    } catch (error) {
        console.log("Internal server error in creating contact", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in creating contact",
            error: error.message
        })
    }
}

exports.deleteContact = async (req, res) => {
    try {
        const id = req.params._id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Id is not found',
            });
        }
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(400).json({
                success: false,
                message: 'Contact not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
        })
    } catch (error) {
        console.log("Internal server error in deleting contact", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in deleting contact",
            error: error.message
        })
    }
}

exports.getSingleContact = async (req, res) => {
    try {
        const id = req.params._id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Id is not found',
            })
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(400).json({
                success: false,
                message: 'Contact not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Contact founded',
            data: contact
        })

    } catch (error) {
        console.log("Internal server error in geting single contact", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in geting single contact",
            error: error.message
        })
    }
}

exports.getAllContact = async (req, res) => {
    try {
        const contact = await Contact.find();
        if (!contact) {
            return res.status(400).json({
                success: false,
                message: 'Contact not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Contact founded',
            data: contact
        })
    } catch (error) {
        console.log("Internal server error in geting all contact", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in geting all contact",
            error: error.message
        })
    }
}