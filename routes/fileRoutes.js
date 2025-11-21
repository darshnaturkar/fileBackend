const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');
const fileController = require('../controllers/FileController');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 

router.post('/', authenticateJWT, upload.single('support'), fileController.createFile);
router.get('/get', authenticateJWT, fileController.getFile);

module.exports = router;