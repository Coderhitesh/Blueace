const Order = require("../Model/Order.Model");

exports.getAnylaticalData = async (req, res) => {
    try {
        const { user_id, OrderStatus, secondStatus } = req.query;
        const userId = req.user?.id?._id || user_id;

        // Check if userId is available
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Using Promise.all for concurrent execution
        const [allOrders, pendingsHave, allOrderhave, CancelledHave] = await Promise.all([
            Order.find({ userId, OrderStatus }).exec(),
            Order.find({ userId, OrderStatus: secondStatus }).exec(),
            Order.find({ userId }).exec(),
            Order.find({ userId, OrderStatus: "Cancelled" }).exec()
        ]);

        // Send the response with aggregated data
        res.status(200).json({
            success: true,
            message: "Retrieved all data successfully",
            orders: allOrderhave,
            count: allOrders.length,
            Cancelled: CancelledHave.length,
            allOrdersHave: allOrderhave.length,
            pendingsHave: pendingsHave.length
        });

    } catch (error) {
        console.error("Error retrieving analytical data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve data",
            error: error.message // Include error message for debugging
        });
    }
};
