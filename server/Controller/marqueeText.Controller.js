const MarqueeText = require('../Model/MarqueeText.Model')

exports.createMarqueeText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Please enter the text'
            })
        }
        const marqueeText = new MarqueeText({
            text
        })

        await marqueeText.save();

        res.status(200).json({
            success: true,
            message: 'marquee text created successfully',
            data: marqueeText
        })

    } catch (error) {
        console.log('Internal server error in creating marquee text', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in creating marquee text',
            error: error.message
        })
    }
}

exports.getMarqueeText = async (req, res) => {
    try {
        const allMarqueeText = await MarqueeText.find()
        if (!allMarqueeText) {
            return res.status(400).json({
                success: false,
                message: 'No marquee text founded'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Marquee text founded',
            data: allMarqueeText
        })
    } catch (error) {
        console.log('Internal server error in getting marquee text', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in getting marquee text',
            error: error.message
        })
    }
}

exports.getSingleMarquee = async (req, res) => {
    try {
        const id = req.params._id;
        const marqueeText = await MarqueeText.findById(id)
        if (!marqueeText) {
            return res.status(400).json({
                success: false,
                message: 'No marquee text founded'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Marquee text founded',
            data: marqueeText
        })

    } catch (error) {
        console.log('Internal server error in fetching single marquee text', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in fetching single marquee text',
            error: error.message
        })
    }
}

exports.deleteMarqueeText = async (req, res) => {
    try {
        const id = req.params._id;
        const marqueeText = await MarqueeText.findByIdAndDelete(id)
        if (!marqueeText) {
            return res.status(400).json({
                success: false,
                message: 'No marquee text founded'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Marquee text deleted',
            data: marqueeText
        })
    } catch (error) {
        console.log('Internal server error in deleting  marquee text', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in deleting marquee text',
            error: error.message
        })
    }
}

exports.updateMarqueeText = async (req, res) => {
    try {
        const id = req.params._id;
        const { text } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Marquee text ID is required'
            });
        }

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Marquee text is required'
            });
        }

        const marqueeText = await MarqueeText.findById(id)
        if (!marqueeText) {
            return res.status(400).json({
                success: false,
                message: 'No marquee text founded'
            })
        }

        marqueeText.text = text;
        await marqueeText.save()

        res.status(200).json({
            success: true,
            message: 'Marquee text updated',
            data: marqueeText
        })

    } catch (error) {
        console.log("Internal server error in updating marquee text", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error in updating marquee text',
            error: error.message
        })
    }
}