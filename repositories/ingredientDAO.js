const util = require('util');
const sqlite3 = require('sqlite3');
const { runInNewContext } = require('vm');

class IngredientDAO {
  constructor(dbLocation) {
    this.dbConn = new sqlite3.Database(dbLocation);
    this.dbConn.serialize(() => {
      this.ingredients = [];
      this.dbConn.run(
        'CREATE TABLE IF NOT EXISTS INGREDIENTS (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERID TEXT, RECIPEID INTEGER, NAME TEXT, QUANTITY REAL, UNIT TEXT)'
      );
      this.dbConn.each(
        'SELECT ID, USERID, RECIPEID, NAME, QUANTITY, UNIT FROM INGREDIENTS ORDER BY USERID, RECIPEID',
        (err, row) => {
          if (err) {
            throw err;
          }
          const IngredientItem = {
            id: row.ID,
            userid: row.USERID,
            recipeid: row.RECIPEID,
            name: row.NAME,
            quantity: row.QUANTITY,
            unit: row.UNIT
          };
          this.ingredients.push(IngredientItem);
        }
      );
    });
  }

  async createIngredient(IngredientItem) {
    const sql = `INSERT INTO INGREDIENTS (USERID, RECIPEID, NAME, QUANTITY, UNIT) VALUES ("${IngredientItem.userid}", ${IngredientItem.recipeid}, "${IngredientItem.name}", ${IngredientItem.quantity}, "${IngredientItem.unit}")`;
    this.dbConn.run(sql);

    this.dbConn.each(
      `select seq from sqlite_sequence where name='INGREDIENTS'`,
      (err, row) => {
        if (err) {
          throw err;
        }
        this.ingredients.push({ id: row.seq, ...IngredientItem });
      }
    );
  }

  async delete(id) {
    console.log(`delete from INGREDIENTS where id = ${id}`);
    this.dbConn.run(`delete from INGREDIENTS where id = ${id}`);

    this.ingredients.splice(
      this.ingredients.findIndex((item) => item.id === parseInt(id)),
      1
    );
  }

  async update(id, IngredientItem) {
    const index = this.ingredients.findIndex(
      (item) => item.id === parseInt(id)
    );
    console.log('IN DAO');
    console.log(IngredientItem);
    this.dbConn.run(
      `update Ingredients set name='${IngredientItem.name}', quantity=${IngredientItem.quantity}, unit='${IngredientItem.unit}' where id = ${id}`
    );

    this.ingredients.splice(index, 1, IngredientItem);
  }
}
module.exports = new IngredientDAO('./supermom.db');
