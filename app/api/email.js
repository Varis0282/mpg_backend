import EmailCrtl from '../controller/email.js'


export default (app) => {
    app.post('/email/send-otp-mail', async (req, res) => {
        const { body } = req
        let resp = await EmailCrtl.sendOTPMail(body)
        res.send(resp)
    })
}