require("dotenv").config();
const express = require("express");
const cors = require('cors')
const bp = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require('multer')

const app = express();

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.post('/sending', async (req, res) => {
    const { email, objet, content } = req.body;

    // Configuration du transporteur (SMTP)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Options du mail à envoyer
    const mailOptions = {
        from: {
            name: "Lycoris",
            address: process.env.SMTP_USERNAME
        },
        to: email,
        subject: objet,
        text: content
    };

    try {
        // Envoi du mail
        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.response);

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
  
  const upload = multer({storage})
  
  app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body)
    console.log(req.file)
  })

app.listen(process.env.APP_PORT, () =>{
    console.log("________________________________________________");
    console.log();
    console.log('server running');
    console.log("________________________________________________");
});
