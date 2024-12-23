const Commission = require('../Model/Commission.Model')

exports.createCommission = async (req, res) => {
    try {
        const { name, percent } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" })
        }
        if (!percent) {
            return res.status(400).json({ success: false, message: "Percent is required" })
        }
        const commission = new Commission({
            name: name,
            percent: percent
        })
        await commission.save()
        res.status(201).json({
            success: true,
            message: "Commission created successfully",
            data: commission
        })

    } catch (error) {
        console.log("Internal server error", error)
        res.status(5000).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getAllCommission = async (req, res) => {
    try {
        const commission = await Commission.find()
        if (!commission) {
            return res.status(404).json({ success: false, message: "No commission found" })
        }
        res.status(200).json({
            success: true,
            message: "All commission fetched successfully",
            data: commission
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(5000).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSingleCommission = async (req, res) => {
    try {
        const { id } = req.params;
        const commission = await Commission.findById(id)
        if (!commission) {
            return res.status(404).json({ success: false, message: "Commission not found" })
        }
        res.status(200).json({
            success: true,
            message: "Commission fetched successfully",
            data: commission
        })
    } catch (error) {
        console.log("Internal server error", error)
    }
}

exports.deleteCommission = async (req, res) => {
    try {
        const { id } = req.params;

        const commission = await Commission.findByIdAndDelete(id);
        if (!commission) {
            return res.status(404).json({ 
                success: false, 
                message: "Commission not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Commission deleted successfully",
            data: commission
        });
    } catch (error) {
        console.error("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.updateCommission = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, percent } = req.body;

        const commission = await Commission.findByIdAndUpdate(
            id,
            { name, percent },
            { new: true, runValidators: true }
        );

        if (!commission) {
            return res.status(404).json({ 
                success: false, 
                message: "Commission not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Commission updated successfully",
            data: commission
        });
    } catch (error) {
        console.error("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};