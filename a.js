const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ngrok = require('ngrok');
const axios = require('axios');


const app = express();


(async()=>{
  await ngrok.connect({
      proto: 'tcp', // Specify that you want a TCP tunnel
      addr: 6381, 
      authtoken:'2VTpkw2Lk0BazrBP97LPU3huZad_6VJjPWQ8nrzi1t9K2ZT5z'// Port number of the service you want to expose
    });
})

setInterval(()=>{
  axios.get('https://google.com').then(()=>{
    console.log('req successful');
  }).catch(()={
    console.log('error');
  })
},120000);



const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderName = Math.random().toString(36).substring(7);
  
    const folderPath = path.join(__dirname, 'uploads', folderName);
    fs.mkdirSync(folderPath);
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(req.file.destination, req.file.filename);
  res.status(200).send(filePath);
});

app.listen(6381, () => {
  console.log(`Server is running on port ${port}`);
});
