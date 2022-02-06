const crypto = require('crypto');
const util = require('util');
const sqlite3 = require('sqlite3');
const scrypt = util.promisify(crypto.scrypt);

class UserDAO {
  constructor(dbLocation) {
    this.dbConn = new sqlite3.Database(dbLocation);
    this.dbConn.serialize(() => {
      this.users = [];
      this.dbConn.run(
        'CREATE TABLE IF NOT EXISTS USERS (ID TEXT, NAME TEXT, EMAIL TEXT, PWD TEXT)'
      );
      this.dbConn.each('SELECT ID, NAME, EMAIL, PWD FROM USERS', (err, row) => {
        if (err) {
          throw err;
        }
        const user = {
          id: row.ID,
          name: row.NAME,
          email: row.EMAIL,
          password: row.PWD
        };
        console.log(user);
        this.users.push(user);
      });
    });
  }

  randomId(bytes) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  async update(user) {
    console.log('user info');
    console.log(user.password);
    console.log(user.id);
    const salt = this.randomId(8);
    const buf = await scrypt(user.password, salt, 64);
    const password = `${buf.toString('hex')}.${salt}`;

    try {
      this.dbConn.run(`
    UPDATE USERS SET PWD = "${password}" WHERE ID = "${user.id}"
    `);
      user.password = password;
    } catch (err) {
      console.log(err.messge);
    }
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1, user);
    }

    console.log(this.users);
  }

  async createUser(user) {
    const id = this.randomId(4);
    const salt = this.randomId(8);
    const buf = await scrypt(user.password, salt, 64);
    const password = `${buf.toString('hex')}.${salt}`;
    this.dbConn.run(`
    INSERT INTO USERS (ID, NAME, EMAIL, PWD)
    VALUES ("${id}", "${user.name}","${user.email}","${password}")`);

    this.users.push({ ...user, id, password });
    console.log(this.users);
    return id;
  }

  async comparePasswords(saved, supplied) {
    // Saved -> password saved in our database. 'hashed.salt'
    // Supplied -> password given to us by a user trying sign in
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString('hex');
  }
}
module.exports = new UserDAO('./supermom.db');
