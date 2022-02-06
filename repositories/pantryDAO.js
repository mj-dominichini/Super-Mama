const util = require('util');
const sqlite3 = require('sqlite3');

class PantryDAO {
  constructor(dbLocation) {
    this.dbConn = new sqlite3.Database(dbLocation);
    this.dbConn.serialize(() => {
      this.pantry = [];
      this.dbConn.run(
        'CREATE TABLE IF NOT EXISTS PANTRY (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERID TEXT, ITEM TEXT, QUANTITY REAL, UNIT TEXT, PRICE REAL)'
      );

      this.dbConn.each(
        'SELECT ID, USERID, ITEM, QUANTITY, UNIT, PRICE FROM PANTRY ORDER BY USERID',
        (err, row) => {
          if (err) {
            throw err;
          }
          const pantryItem = {
            id: row.ID,
            userid: row.USERID,
            item: row.ITEM,
            quantity: row.QUANTITY,
            unit: row.UNIT,
            price: row.PRICE
          };
          console.log(pantryItem);
          this.pantry.push(pantryItem);
        }
      );
    });
  }

  async createPantryItem(pantryItem) {
    const sql = `INSERT INTO PANTRY (USERID, ITEM, QUANTITY, UNIT, PRICE) VALUES ("${pantryItem.userid}", "${pantryItem.item}",${pantryItem.quantity},"${pantryItem.unit}",${pantryItem.price})`;
    this.dbConn.run(sql);

    this.dbConn.each(
      `select seq from sqlite_sequence where name='PANTRY'`,
      (err, row) => {
        if (err) {
          throw err;
        }

        console.log(row.seq);
        this.pantry.push({ id: row.seq, ...pantryItem });
      }
    );
  }

  async delete(id) {
    this.dbConn.run(`delete from pantry where id = ${id}`);
    this.pantry.splice(
      this.pantry.findIndex((item) => item.id === parseInt(id)),
      1
    );
  }

  async update(id, pantryItem) {
    const index = this.pantry.findIndex((item) => item.id === parseInt(id));
    this.dbConn.run(
      `update pantry set item = '${pantryItem.item}', quantity = ${pantryItem.quantity}, unit = "${pantryItem.unit}", price = ${pantryItem.price} where id = ${id}`
    );

    this.pantry.splice(index, 1, pantryItem);
    console.log(pantryItem);
    console.log(this.pantry);
  }
}
module.exports = new PantryDAO('./supermom.db');
