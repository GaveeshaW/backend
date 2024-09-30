const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors'); // Import the CORS package
require('dotenv').config(); // Ensure dotenv is set up

const app = express();
const port = 5000;

// Middleware to enable CORS
app.use(cors()); // Enable all CORS requests
app.use(express.json()); // Parse JSON bodies

// Serve static files
app.use(express.static(path.join(__dirname, '../main')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../main', 'main.html'));
});

// Send email route
app.post('/send', (req, res) => {
    console.log('Received data: ', req.body);
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        },
        // Add timeout options
        pool: true,
        maxConnections: 1,
        rateDelta: 20000,
        rateLimit: 1,
    });    

    const mailOptions = {
        from: `Portfolio Contact Form <${process.env.EMAIL_USER}>`, // Your email will send the message
        to: process.env.EMAIL_USER, // Your own email address
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        replyTo: email // Gayanie's email, so you can reply directly to her
    };    

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email: ' + error.message });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

app.post('/feedback', (req, res) => {
    console.log('Received feedback form data: ', req.body);
    const { rating, reasons, platform, preferredPlatform } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        },
        // Add timeout options
        pool: true,
        maxConnections: 1,
        rateDelta: 20000,
        rateLimit: 1,
    });   

    const mailOptions = {
        from: `Portfolio Feedback Form <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'New Feedback Submission',
        text: `Rating: ${rating}\nReasons: ${reasons}\nPlatform used: ${platform}\nPreferred platform: ${preferredPlatform}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending feedback email:', error);
            return res.status(500).json({ error: 'Error sending email: ' + error.message });
        }
        console.log('Feedback email sent:', info.response);
        res.status(200).json({ message: 'Feedback sent successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
