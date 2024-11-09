import { errorObj, successObj } from '../../config/settings.js';
import EmailModel from '../model/emails.js'
import UserModel from '../model/users.js'
import nodemailer from 'nodemailer'
const userMail = process.env.USER_MAIL;
const userPassword = process.env.USER_PASSWORD;
import _ from 'lodash';

const exp = {
    add: (data) => {
        return new Promise(async (resolve) => {
            try {
                let newEmail = new EmailModel();
                _.each(data, (v, k) => {
                    newEmail[k] = v;
                })
                await newEmail.save();
                return resolve({ ...successObj });
            } catch (error) {
                console.log(error)
                return resolve({ ...errorObj, message: error.message })
            }
        })
    },
    sendOTPMail: (data) => {
        return new Promise(async (resolve) => {
            let user = await UserModel.findOne({ email: data?.email })
            if (!user) {
                return resolve({ ...successObj, message: "User not found" })
            }
            const otp = Math.floor(100000 + Math.random() * 900000);
            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: userMail,
                    pass: userPassword,
                },
            });
            let subject = `OTP verification for Mere Personal Guru`
            let body = `<div style="margin: 0; padding: 0">
                        <div
                            style="
                            background-color: #16143f;
                            text-align: center;
                            padding: 6px;
                            border-radius: 4px 4px 0 0;
                            "
                        >
                            <h1
                            style="
                                color: white;
                                font-weight: bold;
                                margin-bottom: 0;
                                margin-top: 0;
                            "
                            >
                            Mere Personal Guru
                            </h1>
                            <p
                            style="
                                color: #f97316;
                                font-weight: bold;
                                margin-top: 0;
                                margin-bottom: 0;
                            "
                            >
                            Apka Apna Online Tutor
                            </p>
                        </div>
                        <div
                            style="
                            border: 1px solid black;
                            border-top: 0;
                            border-radius: 0 0 2px 2px;
                            margin-top: 0;
                            padding: 12px;
                            font-size: 20px;
                            font-weight: 500;
                            "
                        >
                            Your OTP is ${otp} .<br/>Hello ${user.name} , We found that you've requested for OTP(One Time
                            Password) . Here is your OTP . Note that , this OTP is valid for 15
                            minutes only.<br />
                            <br />
                            <div
                            style="display: flex; justify-content: center; align-items: center"
                            >
                            <div
                                style="width: 15%; background-color: #f97316; text-align: center; padding: 12px; border-radius: 4px; color: white; font-size: 24px; font-weight: 600;"
                            >
                                ${otp}
                            </div>
                            </div>
                            <br />
                            Please do not share this OTP with anyone.<br />
                            Thank you for using Mere Personal Guru.
                            <br />
                            <br />
                            <br />
                            Regards,
                            <br />
                            Technical Team
                            <br />
                            Mere Personal Guru
                        </div>
                        </div>`
            const mailOptions = {
                from: {
                    name: "Mere Personal Guru",
                    address: userMail,
                },
                to: user.email,
                subject: subject,
                html: body,
            }
            try {
                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        console.log(error);
                    }

                    let mailObj = {
                        from: userMail,
                        to: user.email,
                        subject: subject,
                        body: body
                    }

                    user.lastOTPTime = Date.now();
                    user.lastOTP = otp;
                    await user.save();
                    await exp.add(mailObj);

                    return resolve({ ...successObj, message: "Otp sent successfully" })
                });
            } catch (error) {
                console.log(error);
                return resolve({ ...errorObj, message: error.message })
            }
        })
    }
}


export default exp;