// require the installed packages 
const express = require('express')
const multer = require('multer');
//CREATE EXPRESS APP 
const app = express();
//ROUTES WILL GO HERE 
app.get('/', function(req, res) {
    res.json({ message: 'WELCOME' });   
});
app.listen(80, () => 
    console.log('Server started on port 80')
);

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
  })
  var upload = multer({ storage: storage })

  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)
   
  })