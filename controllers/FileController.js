const File = require('../models/File');

exports.createFile = async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file); 

        const { type, name, number, noting } = req.body; 

        const supportFilePath = req.file ? req.file.path : null; 
        
        if (!type || !name || !number || !noting || !supportFilePath) {
            return res.status(400).json({ error: "Missing required fields or support file" });
        }

        const file = new File({
            type,
            name,
            number,
            noting,
            sheet: supportFilePath 
        });

        await file.save();

        return res.status(201).json({
            msg: "File saved successfully",
            file
        });

    } catch (error) {
        console.error("Error saving file:", error);
        res.status(500).json({ error: error.message || error });
    }
};