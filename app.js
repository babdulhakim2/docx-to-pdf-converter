const express = require('express');
const cors = require('cors');
var app = express();
app.use(cors());
var upload = require('express-fileupload');
var docxConverter = require('docx-pdf');
var path = require('path');
var fs = require('fs');

const extend_pdf = '.pdf'
const extend_docx = '.docx'

var down_name
// app.use(co///)
app.use(upload());

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})


app.post('/convert', function (req, res) {
    if (req.files.upfile) {
      const file = req.files.upfile;
      const name = file.name;
  
      const uploadpath = path.join(__dirname, '/uploads/' + name);
      const First_name = name.split('.')[0];
      down_name = First_name;
  
      file.mv(uploadpath, function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'Error uploading file' });
        } else {
          const initialPath = path.join(__dirname, `./uploads/${First_name}${extend_docx}`);
          const upload_path = path.join(__dirname, `./uploads/${First_name}${extend_pdf}`);
  
          docxConverter(initialPath, upload_path, function (err, result) {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'Error converting to PDF' });
            } else {
              const pdfFilePath = `${down_name}${extend_pdf}`;
              res.download(upload_path, pdfFilePath, function (err) {
                if (err) {
                  res.status(500).json({ error: 'Error downloading PDF' });
                } else {
                  // Delete the files from the directory after use
                  const delete_path_doc = path.join(__dirname, `/uploads/${down_name}${extend_docx}`);
                  const delete_path_pdf = path.join(__dirname, `/uploads/${down_name}${extend_pdf}`);
                  try {
                    fs.unlinkSync(delete_path_doc);
                    fs.unlinkSync(delete_path_pdf);
                    console.log('Files deleted');
                  } catch (err) {
                    console.error(err);
                  }
                }
              });
            }
          });
        }
      });
    } else {
      res.status(400).json({ error: 'No File selected!' });
    }
  });



// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});