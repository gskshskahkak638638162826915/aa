const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ngrok = require('ngrok');
const axios = require('axios');



const app = express();

app.set('view engine','ejs');
app.use(express().static('./download'));


(async()=>{
  await ngrok.connect({
      proto: 'tcp', // Specify that you want a TCP tunnel
      addr: 6381, 
      authtoken:'2VTpkw2Lk0BazrBP97LPU3huZad_6VJjPWQ8nrzi1t9K2ZT5z'// Port number of the service you want to expose
    });
})

setInterval(()=>{
  axios.get('https://hsgsksgkahskaha738362826825.onrender.com').then(()=>{
    console.log('req successful');
  }).catch(()=>{
    console.log('error');
  })
},120000);



const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderName = Math.random().toString(36).substring(7);
  
    const folderPath = path.join(__dirname, 'download', folderName);
    fs.mkdirSync(folderPath,{recursive:true});
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get('/',(req,res)=>{
  res.render('home',{info:''});
});


app.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file_path = path.join(req.file.destination, req.file.filename);
  const flink = req.headers.host;

  res.render('home',{info:`<script>document.getElementById('infoo').innerHTML = '  <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">Your file has been uploaded successfully.<a href="http://${flink}/${file_path}" class="font-semibold underline">http://${flink}/${file_path}</a></div>'</script>`});
});

app.get('/about',(req,res)=>{
  res.render('about');
});

app.listen(6381, () => {
  console.log(`Server is running on port `);
});
