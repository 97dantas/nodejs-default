
const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY
})

module.exports.send = (User, Template, Description) => {
    const ses = new AWS.SES()
    const template = Template
    const html = template(User)
    const params = {
        Destination: {
            ToAddresses: [User.email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: html
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: Description
            }
        },
        ReturnPath: process.env.AWS_EMAIL,
        Source: process.env.AWS_EMAIL
    }
    ses.sendEmail(params, (err, _) => {
        if (err) console.log(err, err.stack)
    })
}
