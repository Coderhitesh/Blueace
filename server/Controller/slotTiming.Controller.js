const SlotTiming = require('../Model/slotTiming.Model');

// Create Slot Timing
exports.createSlotTiming = async (req, res) => {
    try {
        const { time } = req.body;
        if (!time) {
            return res.status(400).json({
                success: false,
                message: "Please enter time"
            });
        }
        const slotTiming = new SlotTiming({ time });
        await slotTiming.save();
        res.status(201).json({
            success: true,
            message: "Slot Timing created successfully",
            data: slotTiming
        });
    } catch (error) {
        console.log("Internal server error in creating timing", error);
        res.status(500).json({
            success: false,
            message: "Internal server error in creating timing",
            error: error.message
        });
    }
};

// Get All Slot Timings
exports.getAllSlotTiming = async (req, res) => {
    try {
        const allSlotTiming = await SlotTiming.find().sort({ time: 1 });
        if (!allSlotTiming || allSlotTiming.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No Slot Timings found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'All Slot Timings found',
            data: allSlotTiming
        });
    } catch (error) {
        console.log("Internal server error in getting all timing", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting all slot timings',
            error: error
        });
    }
};

// Get Slot Timing By ID
exports.getSlotTimingById = async (req, res) => {
    try {
        const id = req.params._id;
        const foundedSlot = await SlotTiming.findById(id);
        if (!foundedSlot) {
            return res.status(400).json({
                success: false,
                message: 'No Slot Timing found with this ID'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Slot Timing Found',
            data: foundedSlot
        });
    } catch (error) {
        console.log("Internal server error in getting timing by id", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting slot timing by ID',
            error: error.message
        });
    }
};

// Update Slot Timing by ID
exports.updateSlotTiming = async (req, res) => {
    try {
        const {_id} = req.params;
        const { time } = req.body;
        if (!time) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid time to update"
            });
        }

        const updatedSlotTiming = await SlotTiming.findByIdAndUpdate(
            _id,
            { time },
            { new: true }
        );

        if (!updatedSlotTiming) {
            return res.status(404).json({
                success: false,
                message: "Slot Timing not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Slot Timing updated successfully",
            data: updatedSlotTiming
        });
    } catch (error) {
        console.log("Internal server error in updating timing", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating slot timing',
            error: error.message
        });
    }
};

// Delete Slot Timing by ID
exports.deleteSlotTiming = async (req, res) => {
    try {
        const id = req.params._id;
        const deletedSlotTiming = await SlotTiming.findByIdAndDelete(id);

        if (!deletedSlotTiming) {
            return res.status(404).json({
                success: false,
                message: "Slot Timing not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Slot Timing deleted successfully",
            data: deletedSlotTiming
        });
    } catch (error) {
        console.log("Internal server error in deleting timing", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting slot timing',
            error: error.message
        });
    }
};
