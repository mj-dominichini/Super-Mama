const layout = require('../layout');

function formatDate(d) {
  return d.substring(6, 8) + '/' + d.substring(4, 6) + '/' + d.substring(0, 4);
}
module.exports = (name, text, calendarItems, weather, date) => {
  const renderedCalendarItems = calendarItems
    .map((calendarItem) => {
      return `
      <tr>
        <td>${formatDate(calendarItem.dateofevent)}</td>
        <td>${calendarItem.event}</td>
      </tr>
    `;
    })
    .join('');

  return layout(
    {
      content: `

      <h1 class="title">Welcome ${name}</h1>
      <br>
      <a class="subtitle">${date}.&nbsp;&nbsp;</a> <a id="txt" class="subtitle"></a>
     
      <p>Temperature outside is ${Math.round(
        weather.temp
      )}, but it feels like ${Math.round(weather.feels)} degrees Celsius.  
      Air humidity is ${weather.hum}% -- ${weather.desc}.</p>
      <img src="${weather.png}">
      <h1 class="subtitle">Your schedule for today:</h1>
      <table class="table">
      <thead>
        <tr>
          <th>Date of event</th>
          <th>Event</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>TODAY</td><td>${text}</td><tr>
      </tbody>
    </table>
    <br><br>
    <h1 class="subtitle">Your schedule for next seven days:</h1>
      <table class="table">
        <thead>
          <tr>
            <th>Date of event</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          ${renderedCalendarItems}
        </tbody>
      </table>
      <script>
      document.addEventListener("DOMContentLoaded", startTime);
      function startTime() {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        document.getElementById('txt').innerHTML =  h + ":" + m + ":" + s;
        setTimeout(startTime, 1000);
      }
      
      function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
      }
      </script>
    `
    },
    true
  );
};
