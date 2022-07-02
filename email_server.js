const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    provider: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: 'YOUR_EMAIL_ADDRESS@gmail.com', // Enter here email address from which you want to send emails
        pass: 'YOUR_EMAIL_PASSWORD' // Enter here password for email account from which you want to send emails
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.use(bodyParser.json());

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type');

    if(req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    } else {
        return next();
    }
});

app.post('/send-email', function (req, res) {
    const senderName = req.body.name;
    const senderEmail = req.body.email;
    const messageSubject = req.body.subject;
    const messageText = req.body.message;

    if (!senderName || !senderEmail || !messageSubject || !messageText) {
        res.status(400);
        res.send({
            message: 'Bad request'
        });
        return;
    }

    const mailOptions = {
        to: ['YOUR_EMAIL_ADDRESS@gmail.com'], // Enter here the email address on which you want to send emails from your customers
        from: senderName,
        subject: messageSubject,
        text: messageText,
        replyTo: senderEmail
    };

    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end('error');
        } else {
            console.log('Message sent: ', response);
            res.end('sent');
        }
    });
});

app.listen(port, function () {
    console.log('Express started on port: ', port);
});
