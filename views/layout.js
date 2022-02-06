module.exports = ({ content }, loggedin, banner) => {
  return (
    `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>---</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet">
        <link href="/css/main.css" rel="stylesheet">
        <!--<link rel="stylesheet" href="/css/debug.css">-->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css"></link>
        <link rel="stylesheet" type="text/css" href="/css/print.css">
        <script async src="scripts/calendar.js"></script>
        <script src="scripts/burger.js"></script>
        <script src="scripts/print.js"></script>
      </head>

      <body class="admin">
        <header>
        <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/dashboard">
            <img src="/images/logo.png" style="max-height: 110px" class="py-2 px-2">
          </a>
      
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      
        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
          ` +
    (loggedin
      ? `
            <a class="navbar-item larger" href ="/pantry">
              Pantry
            </a>
      
            <a class="navbar-item larger" href ="/lists">
              Lists
            </a>

            <a class="navbar-item larger" href ="/calendar">
            Calendar
            </a>

            <a class="navbar-item larger" href ="/recipes">
            Recipes
            </a>`
      : '') +
    `
          </div>
      
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">` +
    (!loggedin
      ? `<a class="navbar-item larger" href ="/signin">Sign In</a>
                   <a class="navbar-item larger" href ="/signup">Sign Up</a>`
      : `<a class="navbar-item larger" href ="/signout">Sign Out</a>`) +
    `
              </div>
            </div>
          </div>
        </div>
      </nav> 
    
        </header>
        <div class="${banner}"></div>
        <div class="container">
          ${content}
        </div>
    
        <footer class="footer">
        <div class="content has-text-centered">
          <strong><italic>Super Mama</italic></strong> by <a href="/me.html">Marijana Dominichini</a>. This website content
          is produced for Final Year Project (FYP) at <a href="https://fsktm.um.edu.my/">University of Malaya Computer Science faculty.</a><br>Copyright©2022
        </div>
      </footer> 
      </body>
    </html>
  `
  );
};
