const VendorRating = require('../Model/vendorRating.Model');
const Vendor = require('../Model/vendor.Model')

exports.createVendorRating = async (req, res) => {
    try {
        // console.log("I am hit")
        const { rating, review, vendorId, userId } = req.body;
        // console.log(req.body)
        // Validate required fields
        if (!rating || !review || !vendorId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'All fields (rating, review, vendorId, userId) are required.'
            });
        }
        const vendor = await Vendor.findById(vendorId)

        // Validate rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating value must be between 1 and 5.'
            });
        }

        // Create a new VendorRating instance
        const newRating = new VendorRating({
            rating,
            review,
            vendorId,
            userId,
        });

        // Save the new rating
        await newRating.save();

        // Calculate the new average rating for the vendor
        const ratings = await VendorRating.find({ vendorId });
        const totalRatings = ratings.length;
        const sumOfRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);

        const newAverageRating = (sumOfRatings / totalRatings).toFixed(1);

        // Update average rating for the vendor
        await VendorRating.updateMany(
            { vendorId },
            { averageRating: newAverageRating }
        );

        vendor.averageRating = newAverageRating
        
        await vendor.save()

        // Respond with the newly created rating and updated average
        res.status(201).json({
            success: true,
            data: {
                rating: newRating,
                averageRating: newAverageRating
            },
            message: 'Rating created successfully and average rating updated.'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllVendorRatings = async (req, res) => {
    try {
        const ratings = await VendorRating.find()
            .populate('vendorId', 'name')   // Populate vendorId with vendor's name
            .populate('userId', 'name');    // Populate userId with user's name

        if (!ratings) {
            return res.status(400).json({
                success: false,
                message: 'No ratings found.'
            })
        }
        res.status(200).json({
            success: true,
            data: ratings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getVendorRatingById = async (req, res) => {
    try {
        const { _id } = req.params;
        const rating = await VendorRating.findById(_id)
            .populate('vendorId', 'name')
            .populate('userId', 'name');

        if (!rating) {
            return res.status(404).json({ success: false, message: 'Rating not found.' });
        }

        res.status(200).json({ success: true, data: rating });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateVendorRating = async (req, res) => {
    try {
        const { _id } = req.params;
        const { rating, review } = req.body;

        // Find and update the rating
        const updatedRating = await VendorRating.findByIdAndUpdate(
            _id,
            { rating, review },
            { new: true, runValidators: true }
        );

        if (!updatedRating) {
            return res.status(404).json({ success: false, message: 'Rating not found.' });
        }

        // Recalculate average rating for the vendor
        const vendorId = updatedRating.vendorId;
        const ratings = await VendorRating.find({ vendorId });
        const totalRatings = ratings.length;
        const sumOfRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const newAverageRating = (sumOfRatings / totalRatings).toFixed(1);

        await VendorRating.updateMany({ vendorId }, { averageRating: newAverageRating });

        res.status(200).json({
            success: true,
            data: { updatedRating, averageRating: newAverageRating },
            message: 'Rating updated successfully and average rating recalculated.'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteVendorRating = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the rating to delete
        const ratingToDelete = await VendorRating.findById(id);
        if (!ratingToDelete) {
            return res.status(404).json({ success: false, message: 'Rating not found.' });
        }

        const vendorId = ratingToDelete.vendorId;

        // Delete the rating
        await VendorRating.findByIdAndDelete(id);

        // Recalculate average rating for the vendor
        const remainingRatings = await VendorRating.find({ vendorId });
        const totalRatings = remainingRatings.length;
        const sumOfRatings = remainingRatings.reduce((sum, rating) => sum + rating.rating, 0);
        const newAverageRating = totalRatings > 0 ? (sumOfRatings / totalRatings).toFixed(1) : 0;

        await VendorRating.updateMany({ vendorId }, { averageRating: newAverageRating });

        res.status(200).json({
            success: true,
            message: 'Rating deleted successfully and average rating updated.',
            averageRating: newAverageRating
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};