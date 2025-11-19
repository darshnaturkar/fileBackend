const File = require('../models/File');

exports.createFile = async (req, res) => {
    try {
        console.log("Incoming body:", req.body);

        const { type, name, number, noting, support } = req.body;

        if (!type || !name || !number || !noting || !support) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const file = new File({
            type,
            name,
            number,
            noting,
            sheet: support   // Ensure this matches your model field name
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
