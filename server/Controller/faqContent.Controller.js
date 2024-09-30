const FaqContent = require('../Model/faqContent.Model')

exports.createFaqContent = async (req, res) => {
    try {
        const { question, answer } = req.body;
        console.log(answer, question)

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            })
        }
        if (!answer) {
            return res.status(400).json({
                success: false,
                message: "Answer is required"
            })
        }

        const newFaqcontent = new FaqContent({
            question,
            answer
        })

        console.log('newFaqcontent', newFaqcontent)

        const savedFaqcontent = await newFaqcontent.save()

        if (!savedFaqcontent) {
            return res.status(400).json({
                success: false,
                message: "Failed to save FAQ content"
            })
        }

        res.status(200).json({
            success: true,
            message: "FAQ content saved successfully",
            data: savedFaqcontent
        })

    } catch (error) {
        console.log('Internal server error in creating faq content')
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.getFaqContent = async (req, res) => {
    try {
        const faqcontent = await FaqContent.find()
        if (!faqcontent) {
            return res.status(400).json({
                success: false,
                message: "No FAQ content found"
            })
        }
        res.status(200).json({
            success: true,
            message: "FAQ content retrieved successfully",
            data: faqcontent
        })

    } catch (error) {
        console.log('Internal server error in geting faq content')
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.getSingleFaqContent = async (req, res) => {
    try {
        const id = req.params._id
        const faqcontent = await FaqContent.findById(id)
        if (!faqcontent) {
            return res.status(400).json({
                success: false,
                message: "FAQ content not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "FAQ content retrieved successfully",
            data: faqcontent
        })
    } catch (error) {
        console.log("Internal server error in getting single faq content")
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting single faq content',
            error: error.message

        })
    }
}

exports.deleteFaqContent = async (req, res) => {
    try {
        const id = req.params._id
        const faqcontent = await FaqContent.findByIdAndDelete(id)
        if (!faqcontent) {
            return res.status(400).json({
                success: false,
                message: "FAQ content not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "FAQ content deleted successfully",
            data: faqcontent
        })


    } catch (error) {
        console.log('Internal server error in deleting faq content')
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.updateFaqContent = async (req, res) => {
    try {
        const id = req.params._id
        const { question, answer } = req.body;
        const existingFaqContent = await FaqContent.findById(id)
        if (!existingFaqContent) {
            return res.status(400).json({
                success: false,
                message: 'Faq not found'
            })
        }
        existingFaqContent.question = question;
        existingFaqContent.answer = answer;

        const updatedFaqContent = await existingFaqContent.save()
        if (!updatedFaqContent) {
            return res.status(400).json({
                success: false,
                message: 'Failed to update faq content'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Faq content updated successfully',
            data: updatedFaqContent

        })



    } catch (error) {
        console.log("Internal server error in updating faq content")
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}