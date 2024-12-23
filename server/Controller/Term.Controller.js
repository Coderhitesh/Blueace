const Term = require('../Model/Term.Model')

exports.createTerm = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is Required',
                error: 'Title is Required'
            })
        }
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is Required',
                error: 'Content is Required'
            })
        }

        const newTerm = new Term({
            title,
            content
        })

        await newTerm.save();

        res.status(200).json({
            success: true,
            message: 'Term page is added successfully'
        })

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.getAllTerm = async (req, res) => {
    try {
        const allTerm = await Term.find()
        if (!allTerm) {
            return res.status(400).json({
                success: false,
                message: 'No Term found',
                error: 'No Term found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All Term founded'
        })
    } catch (error) {
        console.log("Internal sever error", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.getSingleTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const singleTerm = await Term.findById(id)
        if (!singleTerm) {
            return res.status(400).json({
                success: false,
                message: 'No Term found',
                error: 'No Term found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Term founded'
        })
    } catch (error) {
        console.log("Internal sever error", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.deleteTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const term = await Term.findByIdAndDelete(id)
        if (!term) {
            return res.status(400).json({
                success: false,
                message: 'No Term found',
                error: 'No Term found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Term founded and deleted successfully'
        })
    } catch (error) {
        console.log("Internal sever error", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.updateTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const findTerm = await Term.findById(id)
        if (!findTerm) {
            return res.status(400).json({
                success: false,
                message: 'No term founded by id',
                error: 'No term founded by id'
            })
        }
        const { title, content } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is Required',
                error: 'Title is Required'
            })
        }
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is Required',
                error: 'Content is Required'
            })
        }

        if (title) findTerm.title = title;
        if (content) findTerm.content = content;

        await findTerm.save()

        res.status(200).json({
            success: true,
            message: 'Term updated successfully'
        })

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}