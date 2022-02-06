var cal = {
  // (A) PROPERTIES
  // (A1) COMMON CALENDAR
  sMon: false, // Week start on Monday?
  mName: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ], // Month Names

  // (A2) CALENDAR DATA
  data: null, // Events for the selected period
  sDay: 0,
  sMth: 0,
  sYear: 0, // Current selected day, month, year

  // (A3) COMMON HTML ELEMENTS
  hMth: null,
  hYear: null, // month/year selector
  hForm: null,
  hfHead: null,
  hfDate: null,
  hfTxt: null,
  hfDel: null, // event form

  // (B) INIT CALENDAR
  init: () => {
    // (B1) GET + SET COMMON HTML ELEMENTS
    cal.hMth = document.getElementById('cal-mth');
    cal.hYear = document.getElementById('cal-yr');
    cal.hForm = document.getElementById('cal-event');
    cal.hfHead = document.getElementById('evt-head');
    cal.hfDate = document.getElementById('evt-date');
    cal.hfTxt = document.getElementById('evt-details');
    cal.hfDel = document.getElementById('evt-del');
    cal.hfEvt0 = document.getElementById('evt-chk0');
    cal.hfEvt1 = document.getElementById('evt-chk1');
    cal.hfEvt7 = document.getElementById('evt-chk7');
    document.getElementById('evt-close').onclick = cal.close;
    cal.hfDel.onclick = cal.del;
    cal.hForm.onsubmit = cal.save;

    // (B2) DATE NOW
    let now = new Date(),
      nowMth = now.getMonth(),
      nowYear = parseInt(now.getFullYear());

    // (B3) APPEND MONTHS SELECTOR
    for (let i = 0; i < 12; i++) {
      let opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = cal.mName[i];
      if (i == nowMth) {
        opt.selected = true;
      }
      cal.hMth.appendChild(opt);
    }
    cal.hMth.onchange = cal.list;

    // (B4) APPEND YEARS SELECTOR
    // Set to 10 years range. Change this as you like.
    for (let i = nowYear - 10; i <= nowYear + 10; i++) {
      let opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = i;
      if (i == nowYear) {
        opt.selected = true;
      }
      cal.hYear.appendChild(opt);
    }
    cal.hYear.onchange = cal.list;

    // (B5) START - DRAW CALENDAR
    cal.list();
  },

  // (C) DRAW CALENDAR FOR SELECTED MONTH
  list: () => {
    // (C1) BASIC CALCULATIONS - DAYS IN MONTH, START + END DAY
    // Note - Jan is 0 & Dec is 11
    // Note - Sun is 0 & Sat is 6
    cal.sMth = parseInt(cal.hMth.value); // selected month
    cal.sYear = parseInt(cal.hYear.value); // selected year
    let daysInMth = new Date(cal.sYear, cal.sMth + 1, 0).getDate(), // number of days in selected month
      startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // first day of the month
      endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(), // last day of the month
      now = new Date(), // current date
      nowMth = now.getMonth(), // current month
      nowYear = parseInt(now.getFullYear()), // current year
      nowDay =
        cal.sMth == nowMth && cal.sYear == nowYear ? now.getDate() : null;

    // (C2) LOAD DATA FROM DB
    let merged = {};
    let merged1DayRem = {};
    let merged7DayRem = {};
    fetch('/calendar/get/' + (cal.sYear * 100 + cal.sMth + 1))
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log('in cal.list()', response);
        events = response.map((value) => value['event']);

        reminder0 = response.map((value) => value['reminder0day']);

        reminder1 = response.map((value) => value['reminder1day']);

        reminder7 = response.map((value) => value['reminder7day']);

        day = response.map((value) => (value['dateofevent'] % 10000) % 100);
        month = response.map(
          (value) => parseInt((value['dateofevent'] % 10000) / 100) - 1
        );
        year = response.map((value) => parseInt(value['dateofevent'] / 10000));

        merged = day.reduce(
          (obj, day, index) => ({ ...obj, [day]: events[index] }),
          {}
        );

        merged0DayRem = day.reduce(
          (obj, day, index) => ({ ...obj, [day]: reminder0[index] }),
          {}
        );

        merged1DayRem = day.reduce(
          (obj, day, index) => ({ ...obj, [day]: reminder1[index] }),
          {}
        );

        merged7DayRem = day.reduce(
          (obj, day, index) => ({ ...obj, [day]: reminder7[index] }),
          {}
        );

        cal.reminder0 = JSON.stringify(merged0DayRem);
        cal.reminder1 = JSON.stringify(merged1DayRem);
        cal.reminder7 = JSON.stringify(merged7DayRem);
        cal.data = JSON.stringify(merged);
        if (cal.data == null) {
          cal.data = {};
        } else {
          cal.data = JSON.parse(cal.data);
        }

        if (cal.reminder0 == null) {
          cal.reminder0 = {};
        } else {
          cal.reminder0 = JSON.parse(cal.reminder0);
        }

        if (cal.reminder1 == null) {
          cal.reminder1 = {};
        } else {
          cal.reminder1 = JSON.parse(cal.reminder1);
        }

        if (cal.reminder7 == null) {
          cal.reminder7 = {};
        } else {
          cal.reminder7 = JSON.parse(cal.reminder7);
        }

        // (C3) DRAWING CALCULATIONS
        // Blank squares before start of month
        let squares = [];
        if (cal.sMon && startDay != 1) {
          let blanks = startDay == 0 ? 7 : startDay;
          for (let i = 1; i < blanks; i++) {
            squares.push('b');
          }
        }
        if (!cal.sMon && startDay != 0) {
          for (let i = 0; i < startDay; i++) {
            squares.push('b');
          }
        }

        // Days of the month
        for (let i = 1; i <= daysInMth; i++) {
          squares.push(i);
        }

        // Blank squares after end of month
        if (cal.sMon && endDay != 0) {
          let blanks = endDay == 6 ? 1 : 7 - endDay;
          for (let i = 0; i < blanks; i++) {
            squares.push('b');
          }
        }
        if (!cal.sMon && endDay != 6) {
          let blanks = endDay == 0 ? 6 : 6 - endDay;
          for (let i = 0; i < blanks; i++) {
            squares.push('b');
          }
        }

        // (C4) DRAW HTML CALENDAR
        // Get container
        let container = document.getElementById('cal-container'),
          cTable = document.createElement('table');
        cTable.id = 'calendar';
        container.innerHTML = '';
        container.appendChild(cTable);

        // First row - Day names
        let cRow = document.createElement('tr'),
          days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        if (cal.sMon) {
          days.push(days.shift());
        }
        for (let d of days) {
          let cCell = document.createElement('td');
          cCell.innerHTML = d;
          cRow.appendChild(cCell);
        }
        cRow.classList.add('head');
        cTable.appendChild(cRow);

        // Days in Month
        let total = squares.length;
        cRow = document.createElement('tr');
        cRow.classList.add('day');
        for (let i = 0; i < total; i++) {
          let cCell = document.createElement('td');
          if (squares[i] == 'b') {
            cCell.classList.add('blank');
          } else {
            if (nowDay == squares[i]) {
              cCell.classList.add('today');
            }
            cCell.innerHTML = `<div class="dd">${squares[i]}</div>`;
            if (cal.data[squares[i]]) {
              if (
                cal.reminder0[squares[i]] == 'true' ||
                cal.reminder1[squares[i]] == 'true' ||
                cal.reminder7[squares[i]] == 'true'
              ) {
                cCell.classList.add('reminder');
              }
              cCell.innerHTML +=
                "<div class='evt'>" + cal.data[squares[i]] + '</div>';
            }
            cCell.onclick = () => {
              cal.show(cCell);
            };
          }
          cRow.appendChild(cCell);
          if (i != 0 && (i + 1) % 7 == 0) {
            cTable.appendChild(cRow);
            cRow = document.createElement('tr');
            cRow.classList.add('day');
          }
        }

        // (C5) REMOVE ANY PREVIOUS ADD/EDIT EVENT DOCKET
        cal.close();
        return false;
      });
  },

  // (D) SHOW EDIT EVENT DOCKET FOR SELECTED DAY
  show: (el) => {
    // (D1) FETCH EXISTING DATA
    cal.sDay = el.getElementsByClassName('dd')[0].innerHTML;
    let isEdit = cal.data[cal.sDay] !== undefined;

    // (D2) UPDATE EVENT FORM
    cal.hfTxt.value = isEdit ? cal.data[cal.sDay] : '';

    cal.hfEvt0.checked = cal.reminder0[cal.sDay] == 'true' ? true : false;
    cal.hfEvt1.checked = cal.reminder1[cal.sDay] == 'true' ? true : false;
    cal.hfEvt7.checked = cal.reminder7[cal.sDay] == 'true' ? true : false;

    cal.hfHead.innerHTML = isEdit ? 'EDIT EVENT' : 'ADD EVENT';
    cal.hfDate.innerHTML = `${cal.sDay} ${cal.mName[cal.sMth]} ${cal.sYear}`;
    if (isEdit) {
      cal.hfDel.classList.remove('ninja');
    } else {
      cal.hfDel.classList.add('ninja');
    }
    cal.hForm.classList.remove('ninja');

    let pickedDate = new Date(cal.sYear, cal.sMth, cal.sDay);
    pickedDate.setHours(0, 0, 0, 0);

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = Math.round((pickedDate - today) / (24 * 60 * 60 * 1000));

    const footnote = document.getElementById('footnote');

    if (diff >= 1) {
      document.getElementById('reminder0').classList.remove('hide');
    } else {
      document.getElementById('reminder0').classList.add('hide');
    }

    if (diff >= 2) {
      document.getElementById('reminder1').classList.remove('hide');
    } else {
      document.getElementById('reminder1').classList.add('hide');
    }

    if (diff >= 7) {
      document.getElementById('reminder7').classList.remove('hide');
    } else {
      document.getElementById('reminder7').classList.add('hide');
    }

    if (diff < 1) {
      document.getElementById('footnote').classList.add('hide');
    } else {
      document.getElementById('footnote').classList.remove('hide');
    }
  },

  // (E) CLOSE EVENT DOCKET
  close: () => {
    cal.hForm.classList.add('ninja');
  },

  // (F) SAVE EVENT
  save: () => {
    date =
      parseInt(cal.sYear) * 10000 +
      (parseInt(cal.sMth) + 1) * 100 +
      parseInt(cal.sDay);

    cal.hfEvt0 = document.getElementById('evt-chk0');
    cal.hfEvt1 = document.getElementById('evt-chk1');
    cal.hfEvt7 = document.getElementById('evt-chk7');

    ev = {
      date: date.toString(),
      event: cal.hfTxt.value,
      reminder0day: cal.hfEvt0.checked.toString(),
      reminder1day: cal.hfEvt1.checked.toString(),
      reminder7day: cal.hfEvt7.checked.toString()
    };

    fetch('/calendar/' + date + '/save', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(ev)
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        cal.list();
        //location.reload();
      });

    return false;
  },

  // (G) DELETE EVENT FOR SELECTED DATE
  del: () => {
    date =
      parseInt(cal.sYear) * 10000 +
      (parseInt(cal.sMth) + 1) * 100 +
      parseInt(cal.sDay);
    ev = { date: date, event: cal.hfTxt.value };
    fetch('/calendar/' + date + '/delete', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(ev)
    }).then((res) => {
      location.reload();
    });

    cal.data[cal.sDay] = '';
    cal.list();
    return false;
  }
};
window.addEventListener('load', cal.init);
