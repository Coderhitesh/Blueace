const Order = require("../../Model/Order.Model");
const Ticket = require("../../Model/Ticket/Ticket");
const sharp = require("sharp")
const fs = require('fs');
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const { pre_signed_url } = require("../../Utils/S3");
const { default: mongoose } = require("mongoose");
exports.create_a_issue = async (req, res) => {
    try {
        const file = req.file || {};
        const { vendor, subject, order_id, message } = req.body || {};

        if (!vendor) {
            return res.status(401).json({
                success: false,
                message: "Please login to raise a support ticket."
            });
        }

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide a subject and message for the ticket."
            });
        }

        const valid_types = [
            "Order Related Issue", "Profile Realated Issue", "App not work",
            "Order Not Come", "Update Profile Information", "Other", "Account Blocked"
        ];

        if (!valid_types.includes(subject)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject type. Please choose a valid issue type."
            });
        }

        let order;
        if (order_id) {
            order = await Order.findById(order_id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found. Please upload a screenshot and choose 'Other' as subject."
                });
            }
        }

        let attachment = null;

        if (file?.path) {
            const { path: filePath, filename: fileName, mimetype: fileType } = file;
            let compressedFileName = `compressed_${fileName}`;
            const compressedFilePath = path.join(path.dirname(filePath), compressedFileName);


            const isImage = fileType.startsWith('image/');
            const isVideo = fileType.startsWith('video/');

            if (isImage) {

                await sharp(filePath)
                    .resize({ width: 1080 })
                    .jpeg({ quality: 70 })
                    .toFile(compressedFilePath);
            } else if (isVideo) {

                await new Promise((resolve, reject) => {
                    ffmpeg(filePath)
                        .outputOptions([
                            '-vf scale=-2:720',
                            '-c:v libx264',
                            '-crf 23',
                            '-preset medium',
                            '-c:a aac',
                            '-b:a 128k'
                        ])
                        .output(compressedFilePath)
                        .on('end', () => resolve())
                        .on('error', (err) => reject(err))
                        .run();
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Unsupported file format. Only images or videos are allowed."
                });
            }

            const compressedFileStats = fs.statSync(compressedFilePath);


            const { signedUrl, fileLink } = await pre_signed_url({
                key: compressedFileName,
                contentType: fileType,
            });

            const compressedFileContent = fs.readFileSync(compressedFilePath);

            const s3UploadResponse = await axios.put(signedUrl, compressedFileContent, {
                headers: {
                    'Content-Type': fileType,
                    'Content-Length': compressedFileStats.size
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            });

            if (s3UploadResponse.status !== 200) {
                throw new Error(`S3 upload failed with status ${s3UploadResponse.status}`);
            }

            const publicFileLink = `https://s3.eu-north-1.amazonaws.com/bucket.hbs.dev/${compressedFileName}`;
            try {
                if (fs.existsSync(filePath)) {
                    await fs.promises.unlink(filePath);
                }

                if (fs.existsSync(compressedFilePath)) {
                    await fs.promises.unlink(compressedFilePath);
                }
            } catch (err) {
                console.warn("File deletion error:", err.message);
            }
            attachment = {
                public_id: compressedFileName,
                url: publicFileLink
            };
        }


        const ticket_prefix = 'BLTIC';
        const random = Math.floor(100000 + Math.random() * 900000);
        const ticketCode = `${ticket_prefix}${random}`;

        const newTicket = new Ticket({
            vendor,
            subject,
            order_id,
            message,
            ticket: ticketCode,
            attachments: attachment ? [attachment] : []
        });

        await newTicket.save();

        return res.status(201).json({
            success: true,
            message: "Ticket raised successfully.",
            data: newTicket
        });

    } catch (error) {
        console.error("Raise Ticket Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while raising the ticket.",
            error: error.message
        });
    }
};


exports.get_all_tickets_by_vendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ success: false, message: "Invalid vendor ID" });
        }
        const id = new mongoose.Types.ObjectId(vendorId)
        console.log("id", id)

        const tickets = await Ticket.find({ vendor: id })
            .populate("order_id")
            .sort({ createdAt: -1 });


        console.log("tickets.length", tickets.length)
        return res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch tickets." });
    }
};



exports.get_all_tickets_admin = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("vendor", "name email phone")
            .populate("order_id")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Unable to fetch tickets." });
    }
};


exports.get_single_ticket_by_id = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await Ticket.findById(ticketId)
            .populate("vendor")
            .populate("order_id");

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error retrieving ticket." });
    }
};


exports.update_ticket_status_by_admin = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;

        if (!["open", "in_progress", "closed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const updated = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({
            success: true,
            message: "Ticket status updated",
            data: updated,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};


exports.admin_reply_to_ticket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Reply message is required" });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        ticket.adminResponse.push({ message });
        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Admin replied to ticket",
            data: ticket,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to reply" });
    }
};


exports.delete_ticket_by_vendor = async (req, res) => {
    try {
        const { ticketId, vendorId } = req.params;

        const ticket = await Ticket.findOneAndDelete({ _id: ticketId, vendor: vendorId });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found or unauthorized access.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting ticket." });
    }
};