var multer = require('multer');
var path = require('path');

var fileUpload = multer({
  storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/top-level')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + path.extname(file.originalname))
      }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed - jpg, jpeg, png & file size should be maximum of 2MB.'), false);
    }
  }
});

module.exports = { fileUpload };
