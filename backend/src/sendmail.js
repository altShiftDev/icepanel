import nodemailer from 'nodemailer'
// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  secure: false, // use SSL
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
})

// Configure the mailoptions object
const mailOptions = {
  subject: 'Sending Email using Node.js',
  from: 'no_reply@altshiftdev.com',
  to: '',
  html: ''
}

// Send the email
export const sendEmail = ({to, body}) => {
  mailOptions.to = to
  mailOptions.html = body
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Error:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}