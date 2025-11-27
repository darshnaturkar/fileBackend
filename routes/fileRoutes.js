const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');
const fileController = require('../controllers/FileController');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.fieldname);

    if (file.fieldname == "support") {
      // custom filename for file1
      const ext = path.extname(file.originalname);
      // console.log('cheque_'+req.body.panNumber + ext);
      support_file = "support_" + req.body.number + ext;
      cb(null, "support_" + req.body.number + ext);
    } else if (file.fieldname == "noting") {
      // custom filename for file2

      const ext = path.extname(file.originalname);
      // console.log('panCardFile_'+req.body.panNumber + ext);
      noting_file = "noting" + req.body.number + ext;
      cb(null, "noting" + req.body.number + ext);
    } else {
      // fallback
      cb(null, file.fieldname + ext);
    }
  },
});

const upload = multer({ storage: storage });

router.post('/', authenticateJWT, upload.fields([
    { name: "support", maxCount: 1 },
    { name: "noting", maxCount: 1 },
  ]), fileController.createFile);
router.get('/get', authenticateJWT, fileController.getFile);

module.exports = router;