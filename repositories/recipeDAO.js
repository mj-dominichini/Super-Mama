const util = require('util');
const sqlite3 = require('sqlite3');

class RecipeDAO {
  constructor(dbLocation) {
    this.dbConn = new sqlite3.Database(dbLocation);
    this.dbConn.serialize(() => {
      this.recipes = [];
      this.dbConn.run(
        'CREATE TABLE IF NOT EXISTS RECIPES (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERID TEXT, NAME TEXT, INSTRUCTIONS TEXT)'
      );
      this.dbConn.each(
        'SELECT ID, USERID, NAME, INSTRUCTIONS FROM RECIPES ORDER BY USERID',
        (err, row) => {
          if (err) {
            throw err;
          }
          const recipeItem = {
            id: row.ID,
            userid: row.USERID,
            name: row.NAME,
            instructions: row.INSTRUCTIONS
          };
          this.recipes.push(recipeItem);
        }
      );
    });
  }

  async createRecipe(recipeItem) {
    const sql = `INSERT INTO RECIPES (USERID, NAME, INSTRUCTIONS) VALUES ("${recipeItem.userid}", "${recipeItem.name}", "${recipeItem.instructions}")`;
    this.dbConn.run(sql);
    this.dbConn.each(
      `select seq from sqlite_sequence where name='RECIPES'`,
      (err, row) => {
        if (err) {
          throw err;
        }
        this.recipes.push({ id: row.seq, ...recipeItem });
      }
    );
  }

  async delete(id) {
    this.dbConn.run(`delete from recipes where id = ${id}`);
    this.recipes.splice(
      this.recipes.findIndex((item) => item.id === parseInt(id)),
      1
    );
  }

  async update(id, recipeItem) {
    const index = this.recipes.findIndex((item) => item.id === parseInt(id));
    console.log('IN DAO');
    console.log(recipeItem);
    this.dbConn.run(
      `update recipes set name='${recipeItem.name}', instructions = '${recipeItem.instructions}' where id = ${id}`
    );

    this.recipes.splice(index, 1, recipeItem);
  }
}
module.exports = new RecipeDAO('./supermom.db');
