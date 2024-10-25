const Order = require('../Model/Order.Model')
const EstimatedBudget = require('../Model/EsitimetBudget')
const vendors = require('../Model/vendor.Model')

exports.makeEstimated = async (req, res) => {
    try {
        const { vendor, orderId,Items, EstimatedTotalPrice } = req.body;
        console.log(req.body)
        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check vendor in the Vendor model
        const VendorExistOrNot = await vendors.findById(vendor);
        if (!VendorExistOrNot) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Verify if the vendor is authorized for this order
        const FindRightVendor = order.vendorAlloted?.toString() === VendorExistOrNot._id.toString();
        if (!FindRightVendor) {
            return res.status(403).json({ message: 'Unauthorized vendor' });
        }

       

        // Check if there are any items added
        if (!Items || Items.length === 0) {
            return res.status(400).json({ message: 'No items added. Please add at least one item.' });
        }

        // Calculate Total Price if not provided
        let TotalPrice;
        if (!EstimatedTotalPrice) {
            TotalPrice = Items.reduce((acc, item) => {
                const discount = item.price * item.quantity * (item.Discount || 0) / 100;
                return acc + (item.price * item.quantity - discount);
            }, 0);
        }

        // Create an estimated budget entry
        const estimatedBudget = await EstimatedBudget.create({
            orderId,
            vendorId: VendorExistOrNot._id,
            Items,
            EstimatedTotalPrice: EstimatedTotalPrice || TotalPrice
        });

        order.EstimatedBill = estimatedBudget._id
        await order.save()
        return res.status(201).json({ message: 'Estimated budget created successfully', estimatedBudget });

    } catch (error) {
        console.error('Error creating estimated budget:', error);
        res.status(500).json({ message: 'An error occurred while creating the estimated budget. Please try again later.' });
    }
};

exports.UpdateStatusOfBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const { status } = req.body;

        // Find the bill by ID
        const bill = await EstimatedBudget.findById(billId);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        if(bill.statusOfBill === true){
            return res.status(400).json({ message: 'Bill is already approved' });
        }

        // Update the bill status
        bill.statusOfBill = status;
        await bill.save();

        return res.status(200).json({ message: 'Bill status updated successfully', updatedBill: bill });

    } catch (error) {
        console.error('Error updating bill status:', error);
        res.status(500).json({ message: 'An error occurred while updating the bill status. Please try again later.' });
    }
};


exports.deleteBill = async (req, res) => {
    try {
        const { billId } = req.params;

        const deletedBill = await EstimatedBudget.findByIdAndDelete(billId);
        if (!deletedBill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        return res.status(200).json({ message: 'Bill deleted successfully', deletedBill });
    } catch (error) {
        console.error('Error deleting bill:', error);
        res.status(500).json({ message: 'An error occurred while deleting the bill. Please try again later.' });
    }
};

exports.updateBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const updatedData = req.body;

        // Find and update the bill
        const updatedBill = await Bill.EstimatedBudget(billId, updatedData, { new: true });
        if (!updatedBill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        return res.status(200).json({ message: 'Bill updated successfully', updatedBill });
    } catch (error) {
        console.error('Error updating bill:', error);
        res.status(500).json({ message: 'An error occurred while updating the bill. Please try again later.' });
    }
};


exports.getAllBills = async (req, res) => {
    try {
        const { statusOfBill, orderId, vendor } = req.query;

        const filter = {};
        if (statusOfBill) filter.statusOfBill = statusOfBill;
        if (orderId) filter.orderId = orderId;
        if (vendor) filter.vendor = vendor


        const bills = await EstimatedBudget.find(filter);

        if (bills.length === 0) {
            return res.status(404).json({ message: 'No bills found' });
        }

        return res.status(200).json({ message: 'Bills retrieved successfully', bills });
    } catch (error) {
        console.error('Error retrieving bills:', error);
        res.status(500).json({ message: 'An error occurred while retrieving the bills. Please try again later.' });
    }
};

