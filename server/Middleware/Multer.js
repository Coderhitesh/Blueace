// const multer = require("multer");
// const fs = require('fs');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join(__dirname, './public/artits');
    
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdir(uploadDir, { recursive: true }, (err) => {
//         if (err) {
//           console.error('Error creating directory:', err);
//           return cb(err); 
//         }
//         cb(null, uploadDir); 
//       });
//     } else {  
//       cb(null, uploadDir); 
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require("multer");
const fs = require("fs")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './public/artits'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
     cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
