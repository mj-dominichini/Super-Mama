const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ pantryItem, unit, errors }) => {
  return layout(
    {
      content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="title">Create pantry item</h1>

          <form method="POST" action="/pantry/new">
            <div class="field">
              <label class="label">Item name</label>
              <input class="input" value="${pantryItem}" name="item" readonly>
              <p class="help is-danger">${getError(errors, 'item')}</p>
            </div>
            <div class="field">
              <label class="label">Quantity</label>
              <input class="input" placeholder="Quantity" name="quantity">
              <p class="help is-danger">${getError(errors, 'quantity')}</p>
           </div>
           <div class="field">
           <p class="control has-icons-left">
            <span class="select">
             <select name="unit">
               <option value="${unit}" selected>${unit}</option>
             </select>
            </span>
            <span class="icon is-small is-left">
             <i class="fas fa-weight"></i>
            </span>
         </p>
         <p class="help is-danger">${getError(errors, 'unit')}</p>
          </div>
                    
            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            <button class="button is-primary">Create</button>
          </form>
        </div>
      </div>
    `
    },
    true,
    'hero-image-pantry'
  );
};
