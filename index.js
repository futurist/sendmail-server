'use strict'
const nodemailer = require('nodemailer')
const http = require('http')
const url = require('url')

const [,, PASS, USER] = process.argv

const mailConfig = {
  host: 'smtp.126.com',
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: USER || 'noambitions@126.com', // generated ethereal user
    pass: PASS || '' // generated ethereal password
  }
}
const mailSender = createMailSender(mailConfig)
let sendCounter = 0

http.createServer((req, res) => {
  const response = (obj, code) => {
    res.writeHead(code == null ? 200 : code)
    res.end(JSON.stringify(obj), 'utf8')
  }

  const {pathname, query} = url.parse(req.url, true)
  // console.log(req.url, req.method, req.query, urlObj)
  if (pathname == '/sendmail') {
    let counter = ++sendCounter
    console.log(`start sending mail ${counter}:`, query.to)
    mailSender(query, (err, info) => {
      console.log(err ? `${counter} failed ${JSON.stringify(err)}` : `${counter} ` + info.response)
      if (err) response(err)
      else response(info)
    })
    return
  }

  response({})
}).listen(9191)

function createMailSender (config) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(config)

  // setup email data with unicode symbols
  // let mailOptions = {
  //   from: '"Fred Foo 👻" <noambitions@126.com>', // sender address
  //   to: 'noambitions@126.com', // list of receivers
  //   subject: 'Hello ✔', // Subject line
  //   text: 'Hello world?', // plain text body
  //   html: '<b>Hello world?</b>' // html body
  // }

  return (mailOptions, callback) => transporter.sendMail(mailOptions, callback || ((error, info) => {
      if (error) {
        /*
        error is:
        {"code":"EAUTH","response":"535 Error: authentication failed","responseCode":535}
        */
        return console.log(error)
      }
      /*
      info is:
      {"accepted":["noambitions@126.com"],
      "rejected":[],
      "response":"250 Mail OK queued as smtp2,DMmowABnk2WIsnpa2+B9Bw--.60234S3 1517990536",
      "envelope":{"from":"noambitions@126.com","to":["noambitions@126.com"]},
      "messageId":"1517990535592-1fbad5eb-cd17fbbf-d7055e69@126.com"}
      */
      console.log('Message sent: %s', JSON.stringify(info))
      if (info.accepted != '') console.log('Success:', info.accepted)
      if (info.rejected != '') console.log('Failed:', info.rejected)
    }))
}
