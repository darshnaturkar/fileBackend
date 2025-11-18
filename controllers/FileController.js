const File = require('../models/File');

exports.createFile = async (req, res) => {
    try {
        const { type, name, number, noting, support } = req.body;
        const file = new File({ type, name, number, noting, support });
        await file.save();
        res.json({ file });
    } catch (error) {
        res.status(500).json({ error: error });
    }

};