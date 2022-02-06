const util = require('util');
const sqlite3 = require('sqlite3');

class ListDAO {
  constructor(dbLocation) {
    this.dbConn = new sqlite3.Database(dbLocation);
    this.dbConn.serialize(() => {
      this.lists = [];
      this.dbConn.run(
        'CREATE TABLE IF NOT EXISTS LISTS (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERID TEXT, TITLE TEXT, CONTENT TEXT)'
      );
      this.dbConn.each(
        'SELECT ID, USERID, TITLE, CONTENT FROM LISTS ORDER BY USERID',
        (err, row) => {
          if (err) {
            throw err;
          }
          const list = {
            id: row.ID,
            userid: row.USERID,
            title: row.TITLE,
            content: row.CONTENT
          };
          console.log(list);
          this.lists.push(list);
        }
      );
    });
  }

  async createList(list) {
    const sql = `INSERT INTO LISTS (USERID, TITLE, CONTENT) VALUES ('${list.userid}', '${list.title}' ,'${list.content}')`;
    this.dbConn.run(sql);

    this.dbConn.each(
      `select seq from sqlite_sequence where name='LISTS'`,
      (err, row) => {
        if (err) {
          throw err;
        }

        console.log(row.seq);
        this.lists.push({ id: row.seq, ...list });
      }
    );
  }

  async delete(id) {
    this.dbConn.run(`delete from lists where id = ${id}`);
    this.lists.splice(
      this.lists.findIndex((item) => item.id === parseInt(id)),
      1
    );
  }

  async update(id, list) {
    const index = this.lists.findIndex((item) => item.id === parseInt(id));
    this.dbConn.run(
      `update lists set content = '${list.content}', title = '${list.title}' where id = ${id}`
    );

    this.lists.splice(index, 1, list);
    console.log(list);
    console.log(this.lists);
  }
}
module.exports = new ListDAO('./supermom.db');
