const layout = require('../layout');

module.exports = (calendar) => {
  return layout(
    {
      content: `

    <div class="control">
      <h1 class="title">Calendar</h1>  
      <hr>
    </div>  
    <div class="columns is-vcentered">
      <div class="column">
        <div id="cal-wrap" class="container">
          <!-- (A) PERIOD SELECTOR -->
          <div id="cal-date">
            <select id="cal-mth"></select>
            <select id="cal-yr"></select>
          </div>

          <!-- (B) CALENDAR -->
          <div id="cal-container"></div>
        </div>

      </div>
      <div class="column is-vcentered">
        <!-- (C) EVENT FORM -->
        <form id="cal-event">
          <h1 id="evt-head"></h1>
          <div id="evt-date"></div>
          <textarea id="evt-details" required></textarea>
          <input class="button is-primary" id="evt-close" type="button" value="Close"/>
          <input class="button is-primary" id="evt-del" type="button" value="Delete"/>
          <input class="button is-primary" id="evt-save" type="submit" value="Save" />
          <hr>
          
          <div id="reminder0" class="field">
            <input id="evt-chk0" type="checkbox" name="evt-chk0" class="checkbox">
            <label for="evt-chk0">Remind me on the day of event</label>
          </div>
          <div id="reminder1" class="field">
            <input id="evt-chk1" type="checkbox" name="evt-chk1" class="checkbox">
            <label for="evt-chk1">Remind me 1 day before event</label>
          </div>
          <div id="reminder7" class="field">
          <input id="evt-chk7" type="checkbox" name="evt-chk7" class="checkbox">
          <label for="evt-chk7">Remind me 7 days before event</label>
          </div>

          <p id="footnote" class="is-size-7">* Reminders are sent at midnight</p>

          
        </form>
      </div>
    </div>
    `
    },
    true,
    'hero-image-calendar'
  );
};
