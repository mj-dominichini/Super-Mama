const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/auth');
const pantryRouter = require('./routes/pantry');
const dashboardRouter = require('./routes/dashboard');
const calendarRouter = require('./routes/calendar');
const listsRouter = require('./routes/lists');
const recipesRouter = require('./routes/recipes');
const config = require('config');
const port = config.get('server.port');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['fhdiuew37']
  })
);
app.use(authRouter);
app.use(pantryRouter);
app.use(dashboardRouter);
app.use(calendarRouter);
app.use(listsRouter);
app.use(recipesRouter);

app.listen(3000, () => {
  console.log('Listening');
});
