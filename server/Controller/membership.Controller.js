const MembershipPlan = require('../Model/memberShip.Model');

exports.createMemberShipPlan = async (req, res) => {
    try {
        const { name, price, offer } = req.body;

        const emptyField = [];
        if (!name) emptyField.push('name');
        if (offer == null) emptyField.push('offer'); // Ensure offer is provided
        if (price == null) emptyField.push('price');  // Ensure price is provided (even if it's 0)

        if (emptyField.length > 0) {
            return res.status(400).json({
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        const newMemberShipPlan = new MembershipPlan({
            name,
            price: price !== undefined ? price : 0, // Preserve 0 if passed, default to 0 if undefined
            offer
        });

        await newMemberShipPlan.save();

        res.status(200).json({
            success: true,
            message: 'Membership plan created successfully',
            data: newMemberShipPlan
        });

    } catch (error) {
        console.log("Internal server error in creating membership plan", error);
        res.status(500).json({
            success: false,
            message: "Internal server error in creating membership plan",
            error: error.message
        });
    }
};


exports.getAllMemberShipPlan = async (req, res) => {
    try {
        const allMembershipPlan = await MembershipPlan.find();
        if (!allMembershipPlan) {
            return res.status(404).json({
                success: false,
                message: 'No membership plan found',
            })
        }
        res.status(200).json({
            successs: true,
            message: 'Membership plans retrieved successfully',
            data: allMembershipPlan
        })
    } catch (error) {
        console.log('Internal server error in fetching all membership plan', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in fetching all membership plan',
            error: error.message

        })
    }
}

exports.getSingleMemberShipPlan = async (req, res) => {
    try {
        const id = req.params._id;
        const membershipPlan = await MembershipPlan.findById(id);
        if (!membershipPlan) {
            return res.status(404).json({
                success: false,
                message: 'Membership plan not found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Membership plan retrieved successfully',
            data: membershipPlan
        })
    } catch (error) {
        console.log("Internal server error in fetching single membership plan", error),
            res.status(500).json({
                success: false,
                message: "Internal server error in fetching single membership plan",
                error: error.message
            })
    }
}

exports.deleteMemberShipPlan = async (req, res) => {
    try {
        const id = req.params._id;
        const membershipPlan = await MembershipPlan.findById(id);
        if (!membershipPlan) {
            return res.status(400).json({
                success: false,
                message: 'Membership plan not found',
            })
        }

        const deleteMemberPlan = await MembershipPlan.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: 'Membership Plan deleted successfully',
            data: deleteMemberPlan
        })

    } catch (error) {
        console.log("Internal server error in deleting membership plan", error)
        res.status(500).json({
            success: false,
            message: "Internal server error in deleting membership plan",
            error: error.message
        })
    }
}

exports.updateMemberShipPlan = async (req, res) => {
    try {
        const id = req.params._id;
        const { name, price, offer } = req.body;
        const existingMemberShipPlan = await MembershipPlan.findById(id)
        if (!existingMemberShipPlan) {
            return res.status(400).json({
                success: false,
                message: 'Membership plan not found',
            })
        }
        existingMemberShipPlan.name = name;
        existingMemberShipPlan.price = price;
        existingMemberShipPlan.offer = offer;

        await existingMemberShipPlan.save();

        res.status(200).json({
            success: true,
            message: 'Membership plan updated successfully',
            data: existingMemberShipPlan
        })
    } catch (error) {
        console.log('Internal server error in updating membership plan', error)
        res.status(500).json({
            success: false,
            message: "Internal server error in updating membership plan",
            error: error.message
        })
    }
}