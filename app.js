const express = require('express');
const cors = require('cors');
const app = express();
const upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const mammoth = require('mammoth');

app.use(cors());
app.use(upload());

const extend_pdf = '.pdf';
const extend_docx = '.docx';

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

app.post('/convert', async function (req, res) {
    if (req.files.upfile) {
        const file = req.files.upfile;
        const name = file.name;
        const uploadPath = path.join(__dirname, '/uploads/' + name);
        const first_name = name.split('.')[0];
        
        await file.mv(uploadPath);

        try {
            // Convert DOCX to HTML
            const { value: htmlContent } = await mammoth.convertToHtml({ path: uploadPath });
            
            // Use Puppeteer to convert HTML to PDF
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });            const page = await browser.newPage();
            await page.setContent(htmlContent);
            const pdfPath = path.join(__dirname, `/uploads/${first_name}${extend_pdf}`);
            await page.pdf({ path: pdfPath });
            await browser.close();

            // Download the PDF file
            res.download(pdfPath, function(err) {
                if (err) {
                    res.status(500).json({ error: 'Error downloading PDF' });
                } else {
                    // Delete the files from the directory after use
                    try {
                        fs.unlinkSync(uploadPath);
                        fs.unlinkSync(pdfPath);
                        console.log('Files deleted');
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error converting to PDF' });
        }
    } else {
        res.status(400).json({ error: 'No file selected!' });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
