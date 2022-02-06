const util = require('util');
const sqlite3 = require('sqlite3');

class CalendarDAO {
  constructor(dbLocation) {
    console.log('In constructor, dbLocation is: ' + dbLocation);
    this.dbConn = new sqlite3.Database(dbLocation, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    });
    this.dbConn.serialize(() => {
      this.calendar = [];
      this.dbConn.run(
        'CREATE TABLE IF NOT EXISTS CALENDAR (DATEOFEVENT TEXT, USERID TEXT, EVENT TEXT, REMINDER7DAY INTEGER, REMINDER1DAY INTEGER, REMINDER0DAY INTEGER)'
      );
      this.dbConn.each(
        'SELECT DATEOFEVENT, USERID, EVENT, REMINDER7DAY, REMINDER1DAY, REMINDER0DAY FROM CALENDAR ORDER BY USERID',
        (err, row) => {
          if (err) {
            throw err;
          }
          const calendar = {
            dateofevent: row.DATEOFEVENT,
            userid: row.USERID,
            event: row.EVENT,
            reminder7day: row.REMINDER7DAY,
            reminder1day: row.REMINDER1DAY,
            reminder0day: row.REMINDER0DAY
          };
          this.calendar.push(calendar);
        }
      );
      console.log(this.calendar);
    });
  }

  async delete(userid, event) {
    const sql = `delete from calendar where userid = '${userid}' and dateofevent='${event.dateofevent}'`;
    this.dbConn.run(sql);
    this.calendar.splice(
      this.calendar.findIndex(
        (item) => item.userid == userid && item.dateofevent == event.dateofevent
      ),
      1
    );
  }

  async update(userid, event) {
    const found = this.calendar.findIndex(
      (item) => item.userid === userid && item.dateofevent == event.dateofevent
    );

    if (found != -1) {
      this.dbConn.run(
        `update calendar set event = '${event.event}', reminder1day = '${event.reminder1day}', reminder7day='${event.reminder7day}', reminder0day = '${event.reminder0day}' where userid =  '${userid}' and dateofevent = '${event.dateofevent}' `
      );
      this.calendar.splice(found, 1);
    } else {
      this.dbConn.run(
        `INSERT INTO CALENDAR (DATEOFEVENT, USERID, EVENT, REMINDER7DAY, REMINDER1DAY, REMINDER0DAY) VALUES ('${event.dateofevent}','${event.userid}',  '${event.event}', '${event.reminder7day}','${event.reminder1day}', '${event.reminder0day}' )`
      );
    }
    this.calendar.push(event);
  }
}
module.exports = new CalendarDAO('./supermom.db');
