"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper

async function sendMail(data) {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: "Gmail",
        auth: {
            user: "erm.tzcgl.exmple.intern@gmail.com",
            pass: "123a456a789a"
        }
    });
    if(data == undefined) data = ""
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Erim Tuzcuoglu" <erimtuzcuoglu@gmail.com>', // sender address
        to: data.mailAddress, // list of receivers
        subject: data.mailSubject, // Subject line
        text: data.mailContent, // plain text body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)
    
    //console.log("Message sent: %s", info);
    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return info
}

sendMail().catch(console.error);

module.exports = { sendMail };