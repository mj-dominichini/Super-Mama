const express = require('express');
const userDAO = require('../repositories/userDAO');
const calendarDAO = require('../repositories/calendarDAO');
const { handleErrors, requireAuth } = require('./middlewares');
const dashBoardTemplate = require('../views/dashboard/dashboard');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/dashboard', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const userObject = userDAO.users.find((user) => user.id === userId);
  const userName = userObject['name'];

  const url =
    'https://api.openweathermap.org/data/2.5/weather?q=Kuala Lumpur&appid=8ab6364f0b4cc004f534f848b9fddde0&units=metric';

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const temp = data.main.temp;
      const feels = data.main.feels_like;
      const humidity = data.main.humidity;
      const weatherDescription = data.weather[0].description;
      const icon = data.weather[0].icon;
      const imageURL = 'http://openweathermap.org/img/wn/' + icon + '@4x.png';

      let weather = {
        temp: temp,
        feels: feels,
        hum: humidity,
        desc: weatherDescription,
        png: imageURL
      };
      let today = new Date();

      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = today.getFullYear();

      today = yyyy + mm + dd;

      const calendar = calendarDAO.calendar.filter(
        (calendarItem) =>
          calendarItem.userid === userId && calendarItem.dateofevent === today
      );

      let eventsToday = '';
      if (calendar.length != 0) {
        eventsToday = `${calendar[0].event} `;
      }

      let nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const d = String(nextWeek.getDate()).padStart(2, '0');

      const m = String(nextWeek.getMonth() + 1).padStart(2, '0');
      const y = nextWeek.getFullYear();
      nextWeek = y + m + d;

      const eventsNext7Days = calendarDAO.calendar.filter(
        (calendarItem) =>
          calendarItem.userid === userId &&
          calendarItem.dateofevent > today.toString() &&
          calendarItem.dateofevent <= nextWeek.toString()
      );

      let now = new Date();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      const date = `Today is ${now.getDate()} ${
        monthNames[now.getMonth()]
      } ${now.getFullYear()}`;

      let e7d = [...eventsNext7Days];

      e7d.sort((a, b) => {
        return parseInt(a.dateofevent) - parseInt(b.dateofevent);
      });

      console.log(e7d);
      return res.send(
        dashBoardTemplate(
          userName,
          eventsToday == '' ? 'No events today' : eventsToday,
          e7d,
          weather,
          date
        )
      );
    });
});

module.exports = router;
