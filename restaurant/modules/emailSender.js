// import nodemailer
const nodemailer = require('nodemailer')
// create transporter object to send email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'inkyfischer@gmail.com',
        pass: 'In04Fi01!'
    }
})

function sendEmail(name, email, subject, message, callback) {
    const mailOptions = {
        from: 'inkyfischer@gmail.com',
        to: 'inkyfischer@gmail.com',
        subject: subject,
        text: email + '\n' + name + '\n' + message
    }
    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err);
            callback(false)
            
        } else {
            console.log(info.response);
            callback(true)
            
        }
    })
}

module.exports = {sendEmail}