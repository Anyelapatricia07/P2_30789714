const path = require('path');
const sqlite3 = require('sqlite3')


class ContactosModel {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, "/database", "database.db"), (err) => {
            err ? console.log('Database created successfully') : console.log(err)
        });
    }

    connection() {
        this.db.run('CREATE TABLE IF NOT EXISTS contacts(name VARCHAR(255), email VARCHAR(255), message TEXT,ip TEXT,fecha VARCHAR(255))');
    }

    save(name, email, message, ip, date) {
        this.db.run("INSERT INTO contacts VALUES (?, ?, ?, ?, ?)", [name, email, message, ip, date]);
    }

}


class ContactosController {
    constructor() {
        this.modelDatabase = new ContactosModel();
        this.modelDatabase.connection();
    }

    async save(req, res) {
        const { username, email, message } = req.body;
        console.log(req.body)
        const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
        const date = new Date();
        this.modelDatabase.save(username, email, message, ip, date);
        res.send({
            success: "Form submitted successfully",
            username: username,
            email: email,
            message: message,
            ip: ip,
            date: date
        });
    }
}


module.exports = ContactosController