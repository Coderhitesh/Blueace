const Vendor = require('../Model/vendor.Model');
const Withdraw = require('../Model/withDrawal.Model')

exports.createWithdrawRequest = async (req, res) => {
    try {
        const { vendor, amount } = req.body;

        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Vendor is required",
                error: "Vendor is required"
            });
        }

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required",
                error: "Amount is required"
            });
        }

        const findVendor = await Vendor.findById(vendor);

        if (!findVendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
                error: "Vendor not found"
            });
        }

        // Check if bank details exist
        if (!findVendor.bankDetail || 
            !findVendor.bankDetail.accountHolderName || 
            !findVendor.bankDetail.accountNumber || 
            !findVendor.bankDetail.bankName || 
            !findVendor.bankDetail.branchName || 
            !findVendor.bankDetail.ifscCode) {
            return res.status(400).json({
                success: false,
                message: "Bank details are required to create a withdrawal request",
                error: "Bank details are missing"
            });
        }

        const vendorWallet = findVendor.walletAmount;

        if (vendorWallet < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
                error: "Insufficient balance"
            });
        }

        const withdraw = new Withdraw({
            vendor: vendor,
            amount: amount
        });

        await withdraw.save();

        res.status(201).json({
            success: true,
            message: "Withdrawal request created successfully",
            data: withdraw
        });

    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


exports.getSingleWithdraw = async (req, res) => {
    try {
        const { id } = req.params;
        const withdraw = await Withdraw.findById(id).populate('vendor')
        if (!withdraw) {
            return res.status(400).json({
                success: false,
                message: "Withdrawal not found",
                error: "Withdrawal not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Withdrawal found successfully",
            data: withdraw
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getAllWithdraw = async (req, res) => {
    try {
        const allWithdraw = await Withdraw.find().populate('vendor');
        if (!allWithdraw) {
            return res.status(400).json({
                success: false,
                message: "No withdrawals found",
                error: "No withdrawals found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Withdrawals found successfully",
            data: allWithdraw
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateWithdrawRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, vendorId } = req.body;

        // Fetch withdrawal record
        const withdraw = await Withdraw.findById(id);
        if (!withdraw) {
            return res.status(400).json({ success: false, message: "Withdrawal not found" });
        }

        // Validate status and vendor ID
        if (!status || !['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid or missing status value" });
        }
        if (!vendorId) {
            return res.status(400).json({ success: false, message: "Vendor ID is required" });
        }

        // Fetch vendor details
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(400).json({ success: false, message: "Vendor not found" });
        }

        // Check existing withdrawal status
        if (['Approved', 'Rejected'].includes(withdraw.status)) {
            return res.status(400).json({
                success: false,
                message: `Withdrawal is already ${withdraw.status.toLowerCase()}`,
            });
        }

        // Handle status updates
        const vendorWallet = vendor?.walletAmount;
        const withdrawAmount = withdraw?.amount;

        if (status === 'Approved') {
            if (vendorWallet < withdrawAmount) {
                return res.status(400).json({ success: false, message: "Insufficient balance" });
            }

            // Approve withdrawal and deduct wallet amount
            withdraw.status = status;
            vendor.walletAmount -= withdrawAmount;
            await withdraw.save();
            await vendor.save();

            return res.status(200).json({
                success: true,
                message: "Withdrawal approved",
                data: withdraw
            });
        } else if (status === 'Rejected') {
            // Reject withdrawal
            withdraw.status = status;
            await withdraw.save();

            return res.status(200).json({
                success: true,
                message: "Withdrawal rejected",
                data: withdraw
            });
        }
    } catch (error) {
        console.error("Error in updateWithdrawRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.deleteWithdrawRequest = async (req, res) => {
    try {
        const withdrawId = req.params.withdrawId;
        console.log("withdrawId", withdrawId)
        const deleteWithdraw = await Withdraw.findByIdAndDelete(withdrawId);
        if (!deleteWithdraw) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal not found",
                error: "Withdrawal not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Withdrawal deleted",
            data: deleteWithdraw
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getWithdrawByVendorId = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const withdraw = await Withdraw.find({ vendor: vendorId }).populate('vendor');
        if (!withdraw) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal not found",
                error: "Withdrawal not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Withdrawal found",
            data: withdraw
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}