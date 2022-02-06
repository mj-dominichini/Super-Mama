const layout = require('../layout');

module.exports = (lists, email) => {
  const renderedLists = lists
    .map((list) => {
      return `
      <div class="container">
      <form id="form${list.id}" autocomplete="off" method="POST" action="/lists/${list.id}/save">
      <div class="card is-fullwidth">

        <header class="card-header">
          <span class="icon is-large is-left">
            <i class="fas fa-tasks"></i>
          </span>
        <input class="input is-medium is-static" type="text" value="${list.title}" name="title">
    
        
          <!--<input type="text" class="input is-primary is-medium is-static" value="${list.title}" name="title">-->
          
          <a class="card-header-icon card-toggle">
            <i class="fa fa-angle-down"></i>
          </a>
          <a id="trash" class="card-header-icon card-trash">
          <i class="fa fa-trash"></i>
          </a>
          <a id="print" class="card-header-icon card-print">
          <i class="fa fa-print"></i>
          </a>
          <a id="email" class="card-header-icon card-envelope .trigger">
          <i class="fa fa-envelope"></i>
          </a>
        </header>
        <div class="card-content is-hidden">
          <div class="content">
            <input id="id" type="hidden" name="id" value = "${list.id}">
            <textarea id="content" name="content" class="textarea" placeholder="My list">${list.content}</textarea>
          </div>
        </div>
        <footer class="card-footer is-hidden">

          <a href="#" class="card-footer-item">        
            <div class="control">
              <button class="button is-primary">Save</button>
            </div>
          </a>
       </footer>
       </form>
      </div>
    </div><br>
      `;
    })
    .join('');

  return layout(
    {
      content: `
    <script>

      document.addEventListener('DOMContentLoaded', function() {
 
	    let cardToggles = document.getElementsByClassName('card-toggle');
	      for (let i = 0; i < cardToggles.length; i++) {
		      cardToggles[i].addEventListener('click', e => {
			    e.currentTarget.parentElement.parentElement.childNodes[3].classList.toggle('is-hidden');
          e.currentTarget.parentElement.parentElement.childNodes[5].classList.toggle('is-hidden');
		      });
	      }

        let cardPrints = document.getElementsByClassName('card-print');
	      for (let i = 0; i < cardPrints.length; i++) {
		      cardPrints[i].addEventListener('click', e => {
			    e.currentTarget.parentElement.parentElement.childNodes[3].classList.remove('is-hidden');
          e.currentTarget.parentElement.parentElement.childNodes[5].classList.remove('is-hidden');
          let listContent = e.currentTarget.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[3];
          let listName = e.currentTarget.parentElement.childNodes[3].value;
          printJS({printable: listContent, type: 'html', header: 'hello'});
		      });
	      }

        let cardEmails = document.getElementsByClassName('card-envelope');
	      for (let i = 0; i < cardEmails.length; i++) {
		      cardEmails[i].addEventListener('click', e => {
			    e.currentTarget.parentElement.parentElement.childNodes[3].classList.remove('is-hidden');
          e.currentTarget.parentElement.parentElement.childNodes[5].classList.remove('is-hidden');
          const listContent = e.currentTarget.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[3].value;
          const listName = e.currentTarget.parentElement.childNodes[3].value;
          const parent = e.currentTarget.parentElement.parentElement.childNodes[3];
          const id = parent.querySelector("#id").value;
          
          let data = {
            id: id,
            title: listName,
            content: listContent
          };

          fetch("/lists/" + id + "/email", {
            method: "POST", 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(res => {
            console.log("Request complete! response:", res);
            
            const modal = document.getElementById("modal");
            modal.classList.toggle('is-active');

            (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
              const $target = $close.closest('.modal');
          
              $close.addEventListener('click', () => {
                $target.classList.remove('is-active');
              });
            });
            //location.reload();
          });

		      });
	      }

        let cardTrashCans = document.getElementsByClassName('card-trash');
	      for (let i = 0; i < cardTrashCans.length; i++) {
		      cardTrashCans[i].addEventListener('click', e => {
			    console.log(e.currentTarget.parentElement.parentElement.childNodes[3]);
          const parent = e.currentTarget.parentElement.parentElement.childNodes[3];
          const id = parent.querySelector("#id").value;
          fetch("/lists/" + id + "/delete", {
            method: "POST", 
            body: JSON.stringify(id)
          }).then(res => {
            console.log("Request complete! response:", res);
            location.reload();
          });

		      });
	      }
      });
    </script>

      <div class="control">
        <h1 class="title">Lists</h1>  
        <a href="#" id="newListButton" class="button is-primary">New List</a>
        

      </div>
      <br>
      <section>

      



      <div id="newListDiv" class="container is-hidden">
      <form id="listform" autocomplete="off" method="POST" action="/lists/9999/new">
      <div class="card is-fullwidth">

        <header class="card-header">
          <span class="icon is-large is-left">
            <i class="fas fa-tasks"></i>
          </span>
        <input class="input is-medium is-static" type="text" name="title" placeholder="Title">
          <a class="card-header-icon card-toggle">
            <i class="fa fa-angle-down"></i>
          </a>
        </header>
        <div class="card-content is-hidden">
          <div class="content">
            <textarea id="content" name="content" class="textarea" placeholder="My list"></textarea>
          </div>
        </div>
        <footer class="card-footer is-hidden">

          <a href="#" class="card-footer-item">        
            <div class="control">
              <button class="button is-primary">Save</button>
            </div>
          </a>
       </footer>
       </form>
      </div>
    </div><br>
      </section>

      <section>
          ${renderedLists}
      </section>

      <section>
      <div id ="modal" class="modal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title"><i class="fas fa-envelope"></i>
              </p>
              <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
             <p>Email containing the list was sent to ${email}.</p>
            </section>
          </div>
      </div>
      
      </section>
      <script>
      const newListButton = document.querySelector("#newListButton");
      const newListDiv = document.querySelector("#newListDiv");

      newListButton.addEventListener('click', function() {newListDiv.classList.remove('is-hidden')
        newListButton.classList.toggle('is-hidden')
      });

      
      
      </script>
    `
    },
    true,
    'hero-image-list'
  );
};
