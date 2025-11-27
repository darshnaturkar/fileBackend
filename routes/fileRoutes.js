const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');
const fileController = require('../controllers/FileController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
let support_file = "";
let noting_file = "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        console.log(file.fieldname);
        if (file.fieldname == "support") {
            const ext = path.extname(file.originalname);
            support_file = "support_" + req.body.number + ext;
            cb(null, "support_" + req.body.number + ext);
        } else if (file.fieldname == "noting") {
            const ext = path.extname(file.originalname);
            noting_file = "noting" + req.body.number + ext;
            cb(null, "noting" + req.body.number + ext);
        } else {
            cb(null, file.fieldname + ext);
        }
    },
});

const upload = multer({ storage: storage });

router.post('/', authenticateJWT, upload.fields([
    { name: "support", maxCount: 1 },
    { name: "noting", maxCount: 1 },
]), async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file);

        const { type, name, number, noting, sheet } = req.body;

        const supportFilePath = req.files["support"] ? support_file : null;
        const notingFilePath = req.files["noting"] ? noting_file : null;

        if (!type || !name || !number || !noting) {
            return res.status(400).json({ error: "Missing required fields or support file" });
        }

        const file = new File({
            type,
            name,
            number,
            noting,
            sheet,
            supportFile: supportFilePath,
            notingFile: notingFilePath
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
});

router.get('/get', authenticateJWT, fileController.getFile);

module.exports = router;