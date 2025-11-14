const express = require('express');
const {authenticateJWT} = require('../middlewares/auth')
const fileController = require('../controllers/FileController');
const router = express.Router();

router.post('/', authenticateJWT, fileController.createFile );

module.exports = router;