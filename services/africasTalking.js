import africastalking from "africastalking";
import dotenv from "dotenv"

dotenv.config();

const credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
}
const At = africastalking(credentials)

export const sendWelcomeSMS = async(phone, name) => {
    try {
        const message = `Welcome to TuChat, ${name}!
                 Stay connected with friends`

                 const response = await sms.send({
                    to: [phone], message
                 });
                 console.log("SMS message sent sucessfully")
    }catch(error) {
        console.error("Error while sending message")
    }
}