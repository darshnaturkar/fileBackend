const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');
const fileController = require('../controllers/FileController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
let support_file = "";
let noting_file = "";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         let filename = "";
//         console.log(ext);

//         if (file.fieldname === "support") {
//             filename = `support_${req.body.number}${ext}`;
//         } else if (file.fieldname === "noting") {
//             filename = `noting_${req.body.number}${ext}`;
//         } else {
//             filename = `${file.fieldname}${ext}`;
//         }

//         cb(null, filename);
//     },
// });

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
 // Specify the upload directory
 cb(null, 'uploads/');
 },
 filename: function (req, file, cb) {
 // Define the file name format
 cb(null, file.originalname);
 }
});

const upload = multer({ storage: storage });

router.post('/', authenticateJWT, upload.fields([
    { name: "support", maxCount: 1 },
    { name: "noting", maxCount: 1 },
]), async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming files:", req.files);

        const { type, name, number, noting, sheet } = req.body;

        // Validate the required fields
        if (!type || !name || !number || !noting) {
            return res.status(400).json({ error: "Missing required fields or support file" });
        }

        // Get file paths for uploaded files
        const supportFilePath = req.files["support"] ? req.files["support"][0].filename : null;
        const notingFilePath = req.files["noting"] ? req.files["noting"][0].filename : null;

        // Create a new file record
        const file = new File({
            type,
            name,
            number,
            noting,
            sheet,
            supportFile: supportFilePath,
            notingFile: notingFilePath
        });

        // Save the file to the database
        await file.save();

        // Send the response back
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