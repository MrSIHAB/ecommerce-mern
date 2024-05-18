const nodemailer = require('nodemailer');
const { smtpUsername, smtpPassword } = require('../secret');

/** Transporter will be used to authorize email server */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: smtpUsername,
        pass: smtpPassword
    }
})


/** This function will send email with mail options using transporter */
const emailWithNodemailer =async (emailData)=>{
try {
        // getting email options from parameter
        let mailOptions = {
            from: "Ababil",
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html
        }
    
        // sending actual email 
        await transporter.sendMail(mailOptions).then(info => console.log("Message: ", info.response));
} catch (error) {
    console.error("Error occured while sending email: ", error);
    throw error;
}
    
}

module.exports = {
    emailWithNodemailer,
}