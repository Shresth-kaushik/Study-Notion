const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                port:465, // new added
                secure:true,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false // disable strict SSL checking
                }
            });

            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Server is ready to take our messages");
                }
            });
            


            let info = await transporter.sendMail({
                from: 'StudyNotion || CodeHelp - by Babbar',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
            console.error("Error occurred while sending email:", error);
    }
}


module.exports = mailSender;