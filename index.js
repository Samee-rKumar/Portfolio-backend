require('dotenv').config({ path: '/.env' });
const mongoose = require('mongoose')
const express = require('express');
const nodemailer = require("nodemailer");


const app = express()

const port = 5000
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello')
})

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kumar.sameer3517@gmail.com",
        pass: process.env.GMAIL_PASS,
    }
});


async function sendMailToViewer(name, email, msg) {

    const info = await transporter.sendMail({
        from: 'kumar.sameer3517@gmail.com',
        to: email, // list of receivers
        subject: `Hello ${name}`, // Subject line
        text: `Hello ${name}!!\n\nThanks for showing interest. I will connect with you as soon as possible\n\n\nRegards\nSameer Kumar`,
    });

    console.log("Message sent: %s", info.messageId);
}

async function sendMailToMe(name, email, msg) {

    const info = await transporter.sendMail({
        from: 'kumar.sameer3517@gmail.com',
        to: 'sam210594@gmail.com', // list of receivers
        subject: `${name} viewed my portfolio`, // Subject line
        text: `${name} <${email}> says-\n\n${msg}`,
    });

    console.log("Message sent: %s", info.messageId);
}



app.post('/connect', (req, res) => {
    console.log(req.body)


    async function main(req, res) {
        const { name, email, msg } = req.body
        await mongoose.connect(`mongodb+srv://sam210594:${process.env.DB_PASS}@cluster0.oxb2ryr.mongodb.net/Connections?retryWrites=true&w=majority`);
        console.log('connected')

        const connectionSchema = new mongoose.Schema({
            name: String,
            email: String,
            msg: String
        });
        mongoose.models = {}
        const connection = mongoose.model('My-Connections', connectionSchema);
        const myconnection = new connection({ name: name, email: email, msg: msg })
        await myconnection.save();
        console.log('Connection saved successfully');



        // Close the connection after saving
        await mongoose.connection.close();
        await sendMailToMe(name, email, msg).catch(console.error);
        await sendMailToViewer(name, email, msg).catch(console.error);

        res.json({ returnMsg: "Success" })
    }

    main(req, res)
        .catch(err => {
            console.log(err)
            res.json({ returnMsg: "Fail" })
        });


})

app.listen(port, () => {
    console.log('server started')

})






