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

// VARS
const uploadFolder = '/uploads';

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + uploadFolder)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
      res.send(file);   
});

// LIST FILES
app.get('/listfiles', (req, res) => {
    //res.json({ message: 'List of files' });  
    const fs = require('fs');
    const listFiles=[];
    fs.readdir(__dirname + uploadFolder, (err, files) => {
      files.forEach(file => {
        const fileDetail = {
          File: file.slice(0,-14),
          Epoch: file.slice(-13),
          Size: fs.statSync(__dirname + uploadFolder+ '/'+file).size
        };
        listFiles.push(fileDetail);
      });
      res.json(listFiles);
    }); 
});