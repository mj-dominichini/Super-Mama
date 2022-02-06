const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ pantryItem, errors }) => {
  return layout(
    {
      content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="title">Edit a Pantry Item</h1>

          <form method="POST">
            <div class="field">
              <label class="label">Item</label>
              <input value="${
                pantryItem.item
              }" class="input" placeholder="Item" name="item">
              <p class="help is-danger">${getError(errors, 'item')}</p>
            </div>

            <div class="field">
              <label class="label">Quantity</label>
               <input value="${
                 pantryItem.quantity
               }" class="input" placeholder="Quantity" name="quantity">
              <p class="help is-danger">${getError(errors, 'quantity')}</p>
            </div>
            <div class="field">
            <p class="control has-icons-left">
             <span class="select">
              <select name="unit">
                <option value="${pantryItem.unit}" selected>${
        pantryItem.unit
      } </option>
                <option value="mcg">mcg</option>
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="oz">oz</option>
                <option value="lb">lb</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="tsp">tsp</option>
                <option value="Tbs">Tbs</option>
                <option value="fl-oz">fl-oz</option>
                <option value="cup">cup</option>
                <option value="pnt">pnt</option>
                <option value="qt">qt</option>
                <option value="gal">gal</option>
                
              </select>
             </span>
             <span class="icon is-small is-left">
              <i class="fas fa-weight"></i>
             </span>
          </p>
          </div>
            <div class="field">
              <label class="label">Price</label>
              <input value="${
                pantryItem.price
              }" class="input" placeholder="Price" name="price">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            
            <br />
            <button class="button is-primary">Save</button>
            <a href="/pantry" class="button is-primary">Cancel</a>
          </form>
        </div>
      </div>
    `
    },
    true,
    'hero-image-pantry'
  );
};
