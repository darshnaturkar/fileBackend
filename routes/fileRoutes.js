const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');
const fileController = require('../controllers/FileController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');

let support_file = "";
let noting_file = "";

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const sanitize = (value) =>
    value.replace(/[\/\\]/g, '_');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const safeNumber = sanitize(req.body.number || Date.now().toString());

        let filename;
        if (file.fieldname === "support") {
            filename = `support_${safeNumber}${ext}`;
        } else if (file.fieldname === "noting") {
            filename = `noting_${safeNumber}${ext}`;
        } else {
            filename = `${file.fieldname}_${Date.now()}${ext}`;
        }

        cb(null, filename);
    },

});

const upload = multer({ storage: storage });

router.post('/', authenticateJWT, upload.fields([
    { name: 'support', maxCount: 1 },
    { name: 'noting', maxCount: 1 },
]), async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming files:", req.files);

        const { type, name, number, noting, sheet } = req.body;

        if (!type || !name || !number || !noting) {
            return res.status(400).json({ error: 'Missing required fields or support file' });
        }

        const supportFilePath = req.files["support"] ? req.files["support"][0].filename : null;
        const notingFilePath = req.files["noting"] ? req.files["noting"][0].filename : null;

        const file = new File({
            type,
            name,
            number,
            noting,
            sheet,
            supportFile: supportFilePath,
            notingFile: notingFilePath,
        });

        await file.save();

        return res.status(201).json({
            msg: 'File saved successfully',
            file
        });

    } catch (error) {
        console.error("Error saving file:", error);
        res.status(500).json({ error: error.message || error });
    }
});

router.get('/get', authenticateJWT, fileController.getFile);

module.exports = router;

