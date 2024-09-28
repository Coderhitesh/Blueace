const Service = require('../Model/service.Model');
const { uploadImage, deleteImageFromCloudinary } = require('../Utils/Cloudnary');
const fs = require('fs').promises;

exports.createService = async (req, res) => {
    const uploadedImages = [];
    try {
        const { name, description, categoryId } = req.body;
        const emptyField = [];
        if (!name) emptyField.push('name');
        if (!description) emptyField.push('description');
        if (!categoryId) emptyField.push('categoryId');
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        const newService = new Service({
            name,
            description,
            categoryId
        });

        if (req.files) {
            const { serviceImage, serviceBanner } = req.files;

            if (serviceImage && serviceImage[0]) {
                const imgUrl = await uploadImage(serviceImage[0]?.path);
                newService.serviceImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(serviceImage[0].path);
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a service image'
                });
            }

            if (serviceBanner && serviceBanner[0]) {
                const imgUrl = await uploadImage(serviceBanner[0]?.path);
                newService.serviceBanner = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(serviceBanner[0].path);
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a service banner'
                });
            }
        }

        const newServiceSave = await newService.save();

        if (!newServiceSave) {
            for (let public_id of uploadedImages) {
                await deleteImageFromCloudinary(public_id);
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to save the service. Uploaded images have been deleted.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service created successfully',
            data: newServiceSave
        });

    } catch (error) {
        console.log('Internal server error in creating service', error);

        for (let public_id of uploadedImages) {
            await deleteImageFromCloudinary(public_id);
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error in creating service',
            error: error.message
        });
    }
};

exports.getService = async (req, res) => {
    try {
        const allService = await Service.find()
        if (!allService) {
            return res.status(400).json({
                success: false,
                message: 'No services found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Services found',
            data: allService
        })
    } catch (error) {
        console.log("Internal server error in getting service", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting service',
            error: error.message
        });
    }
}

exports.getSingleService = async (req, res) => {
    try {
        const id = req.params._id;
        const service = await Service.findById(id)
        if (!service) {
            return res.status(400).json({
                success: false,
                message: 'Service not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Service founded',
            data: service
        })
    } catch (error) {
        console.log('Internal server error in geting single service by id', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in geting single service by id',
            error: error.message
        })
    }
}

exports.updateService = async (req, res) => {
    const uploadedImages = [];
    try {
        const id = req.params._id;
        const { name, description, categoryId } = req.body;
        const emptyField = [];

        if (!id) emptyField.push('id');
        if (!name) emptyField.push('name');
        if (!description) emptyField.push('description');
        if (!categoryId) emptyField.push('categoryId');
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyField.join(', ')}`
            });
        }

        const existingService = await Service.findById(id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        existingService.name = name;
        existingService.description = description;
        existingService.categoryId = categoryId;

        if (req.files) {
            const { serviceImage, serviceBanner } = req.files;

            if (serviceImage && serviceImage[0]) {
                await deleteImageFromCloudinary(existingService.serviceImage.public_id);

                const imgUrl = await uploadImage(serviceImage[0]?.path);
                existingService.serviceImage = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(serviceImage[0].path);
            }

            if (serviceBanner && serviceBanner[0]) {
                await deleteImageFromCloudinary(existingService.serviceBanner.public_id);

                const imgUrl = await uploadImage(serviceBanner[0]?.path);
                existingService.serviceBanner = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                uploadedImages.push(imgUrl.public_id);
                await fs.unlink(serviceBanner[0].path);
            }
        }

        const updatedService = await existingService.save();

        if (!updatedService) {
            for (let public_id of uploadedImages) {
                await deleteImageFromCloudinary(public_id);
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to update the service. Uploaded images have been deleted.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: updatedService
        });

    } catch (error) {
        console.log('Internal server error in updating service', error);

        for (let public_id of uploadedImages) {
            await deleteImageFromCloudinary(public_id);
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error in updating service',
            error: error.message
        });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const id = req.params._id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Service ID is required'
            });
        }

        const serviceToDelete = await Service.findById(id);
        if (!serviceToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        if (serviceToDelete.serviceImage && serviceToDelete.serviceImage.public_id) {
            await deleteImageFromCloudinary(serviceToDelete.serviceImage.public_id);
        }
        
        if (serviceToDelete.serviceBanner && serviceToDelete.serviceBanner.public_id) {
            await deleteImageFromCloudinary(serviceToDelete.serviceBanner.public_id);
        }

        await Service.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (error) {
        console.log('Internal server error in deleting service', error);

        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting service',
            error: error.message
        });
    }
};