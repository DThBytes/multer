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
      const jsonObj = {
        count: "0",
        lastEpoch: "0",
        files: []     
      };
      jsonObj.count = files.length;
      jsonObj.lastEpoch = files.at(-1).slice(-13);
      files.forEach((file, index) => {
        const fileDetail = {
          id: index,
          file: file.slice(0,-14),
          epoch: file.slice(-13),
          size: fs.statSync(__dirname + uploadFolder+ '/'+file).size
        };
        jsonObj.files.push(fileDetail);
      });
      res.json(jsonObj);
    }); 
});