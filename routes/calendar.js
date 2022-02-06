const express = require('express');
const bodyParser = require('body-parser');
const userDAO = require('../repositories/userDAO');
const calendarDAO = require('../repositories/calendarDAO');
const { handleErrors, requireAuth } = require('./middlewares');
const calendarTemplate = require('../views/calendar/calendar');
const router = express.Router();

router.get(
  '/calendar/get/:yearmonth',
  bodyParser.json(),
  requireAuth,
  async (req, res) => {
    const userId = req.session.userId;
    const userObject = userDAO.users.find((user) => user.id === userId);
    const userName = userObject['name'];
    const year = parseInt(req.params.yearmonth / 100);
    const month = req.params.yearmonth % 100;
    const calendar = calendarDAO.calendar.filter(
      (calendarItem) =>
        calendarItem.userid === userId &&
        parseInt((calendarItem.dateofevent % 10000) / 100) == month &&
        parseInt(calendarItem.dateofevent / 10000) == year
    );
    res.setHeader('Content-Type', 'application/json');
    console.log(JSON.stringify(calendar));
    return res.end(JSON.stringify(calendar));
  }
);

router.get('/calendar', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const userObject = userDAO.users.find((user) => user.id === userId);
  const userName = userObject['name'];

  const calendar = calendarDAO.calendar.filter(
    (calendarItem) => calendarItem.userid === userId
  );
  //res.setHeader('Content-Type', 'application/json');
  return res.send(calendarTemplate(calendar));
});

router.post(
  '/calendar/:date/save',
  bodyParser.json(),
  requireAuth,
  async (req, res) => {
    const event = {
      userid: req.session.userId,
      dateofevent: req.body.date,
      event: req.body.event,
      reminder0day: req.body.reminder0day,
      reminder1day: req.body.reminder1day,
      reminder7day: req.body.reminder7day
    };

    console.log(event);
    try {
      await calendarDAO.update(event.userid, event);
    } catch (err) {
      return res.send(`Could not find calendar entry with that date. ${err}`);
    }
    return res.end(JSON.stringify('OK'));
    //res.redirect('/calendar');
  }
);

router.post(
  '/calendar/:date/delete',
  bodyParser.json(),
  requireAuth,
  async (req, res) => {
    const event = {
      userid: req.session.userId,
      dateofevent: req.body.date,
      event: req.body.event
    };

    console.log(event);
    try {
      await calendarDAO.delete(event.userid, event);
    } catch (err) {
      return res.send(`Could not find calendar. ${err}`);
    }
    return res.end(JSON.stringify('OK'));
    //res.redirect('/calendar');
  }
);

module.exports = router;
