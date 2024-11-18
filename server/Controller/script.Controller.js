const Script = require('../Model/script.Model')

exports.createScript = async (req, res) => {
    try {
        const { headScript, bodyScript, footerScript } = req.body;
        if (!headScript) {
            return res.status(400).json({
                success: false,
                message: 'Please enter head script'
            })
        }
        if (!bodyScript) {
            return res.status(400).json({
                success: false,
                message: 'Please enter body script'
            })
        }
        if (!footerScript) {
            return res.status(400).json({
                success: false,
                message: 'Please enter footer script'
            })
        }

        const newScript = new Script({
            headScript,
            bodyScript,
            footerScript
        })

        await newScript.save()
        res.status(201).json({
            success: true,
            message: 'script created successfully',
            data: newScript
        })

    } catch (error) {
        console.log("Internal server error in creating script", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateScript = async (req, res) => {
    try {
        const id = req.params._id;
        const { headScript, bodyScript, footerScript } = req.body;
        if (!headScript) {
            return res.status(400).json({
                success: false,
                message: 'Please enter head script'
            })
        }
        if (!bodyScript) {
            return res.status(400).json({
                success: false,
                message: 'Please enter body script'
            })
        }
        if (!footerScript) {
            return res.status(400).json({
                success: false,
                message: 'Please enter footer script'
            })
        }
        const updatedScript = await Script.findById(id)
        if (!updatedScript) {
            return res.status(400).json({
                success: false,
                message: 'Script not found'
            })
        }
        updatedScript.headScript = headScript
        updatedScript.bodyScript = bodyScript
        updatedScript.footerScript = footerScript

        await updatedScript.save()
        res.status(200).json({
            success: true,
            message: 'Script updated successfully',
            data: updatedScript
        })
    } catch (error) {
        console.log("Internal server error in updating script", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSingleScript = async (req, res) => {
    try {
        const id = req.params._id
        const script = await Script.findById(id)
        if (!script) {
            return res.status(400).json({
                success: false,
                message: 'Script not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Script found',
            data: script
        })
    } catch (error) {
        console.log("Internal server error in getting script", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getAllScript = async (req, res) => {
    try {
        const scripts = await Script.find()
        if (!scripts) {
            return res.status(400).json({
                success: false,
                message: 'No scripts found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Scripts found',
            data: scripts
        })
    } catch (error) {
        console.log("Internal server error in getting script", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteScript = async (req, res) => {
    try {
        const id = req.params._id;
        const script = await Script.findByIdAndDelete(id);
        if (!script) {
            return res.status(400).json({
                success: false,
                message: 'Script not found'
            })
        }
        const deleteScript = await Script.findOneAndDelete(id)
        if (!deleteScript) {
            return res.status(400).json({
                success: false,
                message: 'Script not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Script deleted',
            data: deleteScript
        })
    } catch (error) {
        console.log("Internal server error in deleting script", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}