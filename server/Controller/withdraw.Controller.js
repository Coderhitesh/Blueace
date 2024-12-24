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
            })
        }
        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required",
                error: "Amount is required"
            })
        }
        const withdraw = new Withdraw({
            vendor: vendor,
            amount: amount
        })
        await withdraw.save()
        res.status(201).json({
            success: true,
            message: "Withdrawal request created successfully",
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

exports.getSingleWithdraw = async (req, res) => {
    try {
        const { id } = req.params;
        const withdraw = await Withdraw.findById(id)
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
        const allWithdraw = await Withdraw.find();
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
        const withdraw = await Withdraw.findById(id)
        if (!withdraw) {
            return res.status(400).json({
                success: false,
                message: "Withdrawal not found",
                error: "Withdrawal not found"
            })
        }
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
                error: "Status is required"
            })
        }
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: "Vendor ID is required",
                error: "Vendor ID is required"
            })
        }
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Vendor not found",
                error: "Vendor not found"
            })
        }
        const vendorWallet = vendor?.walletAmount;
        const withdrawAmount = withdraw?.amount;
        if (status === 'Approved') {
            if (vendorWallet < withdrawAmount) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient balance",
                    error: "Insufficient balance"
                })
            }
            withdraw.status = status;
            vendor.walletAmount -= withdrawAmount;
            await withdraw.save();
            await vendor.save();
            return res.status(200).json({
                success: true,
                message: "Withdrawal approved",
                data: withdraw
            })
        }
        if (status === 'Rejected') {
            withdraw.status = status;
            await withdraw.save();
            return res.status(200).json({
                success: true,
                message: "Withdrawal rejected",
                data: withdraw
            })
        }
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteWithdrawRequest = async (req, res) => {
    try {
        const withdrawId = req.params.withdrawId;
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