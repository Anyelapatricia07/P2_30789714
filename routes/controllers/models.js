const path = require('path');
const sqlite3 = require('sqlite3');
const nodemailer = require('nodemailer');
require('dotenv').config();

class ContactosModel {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, "/database", "database.db"), (err) => {
            err ? console.log('Database created successfully') : console.log(err)
        });
    }

    connection() {
        this.db.run('CREATE TABLE IF NOT EXISTS contacts(name VARCHAR(255), email VARCHAR(255), message TEXT,ip TEXT,fecha VARCHAR(255), country TEXT)');
    }

    save(name, email, message, ip, date, country) {
        this.db.run("INSERT INTO contacts VALUES (?, ?, ?, ?, ?, ?)", [name, email, message, ip, date, country]);
    }

}


class ContactosController {
    constructor() {
        this.modelDatabase = new ContactosModel();
        this.modelDatabase.connection();
    }

    async save(req, res) {
        const { username, email, message } = req.body;
        const ipClient = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
        const date = new Date();



        const urlFetch = 'http://ipwho.is/' + ipClient;
        const fetchJson = await fetch(urlFetch);
        const responde = await fetchJson.json();
        const country = response.country



        const response = req.body["g-recaptcha-response"];
        const secret = process.env.RECAPTCHAPV;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`;

        const googleResponse = await fetch(url, { method: "post", });
        const jsonResponse = await googleResponse.json();
        if (jsonResponse.success) {

            let transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                secureConnection: false,
                port: 465,
                tls: {
                    ciphers: 'SSLv3'
                },
                
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const html =
                `
            <p>Email: ${email}</p>
            <p>Name: ${username}</p>
            <p>Message: ${message}</p>
            <p>Date: ${date}</p>
            <p>IP: ${ipClient}</p>
            <pli>Country: ${country}</p>`;

            const receiver = {
                from: process.env.EMAIL,
                to: 'programacion2ais@dispostable.com',
                subject: 'Contact information by P2',
                html: html
            };


            transporter.sendMail(receiver, (err, info) => {
                if (err) console.log(err);
                 console.log(info)
                this.modelDatabase.save(username, email, message, ipClient, date, country);
                res.send({
                    success: "Form and email submitted successfully",
                    username: username,
                    email: email,
                    message: message,
                    ip: ipClient,
                    date: date
                });




            })






        }

        else {
            res.send({
                failed: "Verify the recaptcha!!!!"
            })
        }





    }
}


module.exports = ContactosController
