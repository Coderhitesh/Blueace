const WorkingHours = require('../Model/workingHours.Model');
const Vendor = require('../Model/vendor.Model');

// Create Working Hours
exports.createWorkingHours = async (req, res) => {
    try {
        const { schedule } = req.body;
        const vendorId = req.params.vendorId;

        if (!schedule || !Array.isArray(schedule)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid schedule data'
            });
        }

        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const newWorkingHours = new WorkingHours({ schedule });
        const savedWorkingHours = await newWorkingHours.save();

        vendor.workingHour = savedWorkingHours._id;
        await vendor.save();

        res.status(201).json({
            success: true,
            message: 'Working hours created and assigned to vendor successfully',
            data: savedWorkingHours
        });
    } catch (error) {
        console.error('Internal server error in creating working hours', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


// Get All Working Hours
exports.getAllWorkingHours = async (req, res) => {
    try {
        const workingHoursList = await WorkingHours.find();
        res.status(200).json({
            success: true,
            data: workingHoursList
        });
    } catch (error) {
        console.error('Error fetching working hours', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Working Hours by ID
exports.getWorkingHoursById = async (req, res) => {
    try {

        // const { schedule } = req.body;
        const vendorId = req.params.vendorId;

        // Validation check
        // if (!schedule || !Array.isArray(schedule)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid schedule data'
        //     });
        // }

        // Find the vendor by ID
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Check if vendor has working hours
        if (!vendor.workingHour) {
            return res.status(404).json({
                success: false,
                message: 'No working hours found for this vendor'
            });
        }

        // Find the existing WorkingHours document
        const workingHours = await WorkingHours.findById(vendor.workingHour);

        if (!workingHours) {
            return res.status(404).json({
                success: false,
                message: 'Working hours document not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Working hours Founded successfully',
            data: workingHours
        });




        // const { _id } = req.params;
        // const workingHours = await WorkingHours.findById(_id);

        // if (!workingHours) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Working hours not found'
        //     });
        // }

        // res.status(200).json({
        //     success: true,
        //     data: workingHours
        // });
    } catch (error) {
        console.error('Error fetching working hours by ID', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update Working Hours
// exports.updateWorkingHours = async (req, res) => {
//     try {
//         const { _id } = req.params;
//         const { schedule } = req.body;

//         const updatedWorkingHours = await WorkingHours.findByIdAndUpdate(
//             _id,
//             { schedule },
//             { new: true, runValidators: true }
//         );

//         if (!updatedWorkingHours) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Working hours not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Working hours updated successfully',
//             data: updatedWorkingHours
//         });
//     } catch (error) {
//         console.error('Error updating working hours', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };

// Update Working Hours
exports.updateWorkingHours = async (req, res) => {
    try {
        const { schedule } = req.body;
        const vendorId = req.params.vendorId;

        // Validation check
        if (!schedule || !Array.isArray(schedule)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid schedule data'
            });
        }

        // Find the vendor by ID
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // Check if vendor has working hours
        if (!vendor.workingHour) {
            return res.status(404).json({
                success: false,
                message: 'No working hours found for this vendor'
            });
        }

        // Find the existing WorkingHours document
        const workingHours = await WorkingHours.findById(vendor.workingHour);

        if (!workingHours) {
            return res.status(404).json({
                success: false,
                message: 'Working hours document not found'
            });
        }

        // Update the schedule
        workingHours.schedule = schedule;
        const updatedWorkingHours = await workingHours.save();

        res.status(200).json({
            success: true,
            message: 'Working hours updated successfully',
            data: updatedWorkingHours
        });
    } catch (error) {
        console.error('Internal server error in updating working hours', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


// Delete Working Hours
exports.deleteWorkingHours = async (req, res) => {
    try {
        const { _id } = req.params;

        const deletedWorkingHours = await WorkingHours.findByIdAndDelete(_id);

        if (!deletedWorkingHours) {
            return res.status(404).json({
                success: false,
                message: 'Working hours not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Working hours deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting working hours', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
