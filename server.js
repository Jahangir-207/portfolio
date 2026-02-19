const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware for parsing application/json
app.use(bodyParser.json());

// Twilio configuration
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID'; // Your Twilio Account SID
const authToken = 'YOUR_TWILIO_AUTH_TOKEN'; // Your Twilio Auth Token
const client = twilio(accountSid, authToken);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com', // Your email
        pass: 'YOUR_EMAIL_PASSWORD' // Your email password
    }
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Send SMS via Twilio
    client.messages
        .create({
            body: `New message from ${name}: ${message}`,
            from: 'YOUR_TWILIO_PHONE_NUMBER', // Your Twilio phone number
            to: 'RECIPIENT_PHONE_NUMBER' // Recipient's phone number
        })
        .then(() => {
            console.log('SMS sent successfully.');
        })
        .catch(err => {
            console.error('Error sending SMS:', err);
        });

    // Send email via Nodemailer
    const mailOptions = {
        from: 'YOUR_EMAIL@gmail.com', // sender address
        to: 'RECIPIENT_EMAIL@gmail.com', // list of receivers
        subject: 'Contact Form Submission',
        text: `You have received a new message from ${name} (Email: ${email}): ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Email sent: ' + info.response);
    });

    res.status(200).json({ message: 'Form submitted successfully!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});