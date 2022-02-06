class PantryRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
    'CREATE TABLE IF NOT EXISTS PANTRY (ID INTEGER PRIMARY KEY AUTOINCREMENT, USERID TEXT, ITEM TEXT, QUANTITY REAL, UNIT TEXT, PRICE REAL)`;
    return this.dao.run(sql);
  }

  createPantryItem(pantryItem) {
    return this.dao.run(
      'INSERT INTO PANTRY (USERID, ITEM, QUANTITY, UNIT, PRICE) VALUES (?, ?, ?, ?, ?)',
      [
        pantryItem.userid,
        pantryItem.item,
        pantryItem.quantity,
        pantryItem.unit,
        pantryItem.price
      ]
    );
  }

  update(id, pantryItem) {
    return this.dao.run(
      'UPDATE PANTRY SET ITEM = ?, QUANTITY = ?, UNIT = ?, PRICE = ? where ID = ?',
      [
        pantryItem.item,
        pantryItem.quantity,
        pantryItem.unit,
        pantryItem.price,
        id
      ]
    );
  }

  delete(id) {
    return this.dao.run('DELETE FROM PANTRY WHERE ID = ?', [id]);
  }

  getById(id) {
    return this.dao.get(`SELECT * FROM PANTRY WHERE id = ?`, [id]);
  }

  getAll() {
    return this.dao.all(`SELECT * FROM PANTRY`);
  }
}

const dao = new AppDAO('./supermom.db');
const repo = new Repository(dao);
repo.createTable();
module.exports = repo;
