const nodemailer = require("nodemailer");

const sendEmail = async (email, htmlMessage,subject) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.service,
            auth: {
                user: process.env.emailuser,
                pass: process.env.pass
            },
        });
 // Options for sending email
        const options = {
            from: 'kebaieryasmine0@gmail.com',
            to: email,
            subject: subject,
            html: htmlMessage,
        };
// Send email
        await transporter.sendMail(options);
        console.log("Reset email sent successfully to:", email);
        return true; // Success
    } catch (error) {
        console.error("Error sending email:", error);
        return false; // Failure
    }
};

module.exports = sendEmail;

