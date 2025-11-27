const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');
const fileController = require('../controllers/FileController');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 

router.post('/', authenticateJWT, upload.fields([
    { name: "support", maxCount: 1 },
    { name: "noting", maxCount: 1 },
  ]), fileController.createFile);
router.get('/get', authenticateJWT, fileController.getFile);

module.exports = router;