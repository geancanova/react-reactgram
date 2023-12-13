const multer = require('multer');
const path = require('path');

// Destination to store image
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    switch (true) {
      case req.baseUrl.includes('users'):
        folder = 'users';
        break;
      case req.baseUrl.includes('photos'):
        folder = 'photos';
        break;
      default:
        break;
    };

    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    // rename file to not subscribe user image
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg formats
      return cb(new Error('Por favor, envie apenas png ou jpg!'));
    }

    cb(undefined, true);
  }
});

module.exports = { imageUpload };