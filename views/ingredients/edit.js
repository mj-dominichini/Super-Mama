const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ ingredientItem, errors }) => {
  return layout(
    {
      content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="title">Edit ingredient</h1>

          <form method="POST">
            <input value="${
              ingredientItem.recipeid
            }" type="hidden" name="recipeid">   
            <div class="field">
              <label class="label">Ingredient</label>
              <input value="${
                ingredientItem.name
              }" class="input" placeholder="Ingredient" name="name">
              <p class="help is-danger">${getError(errors, 'name')}</p>
            </div>

            <div class="field">
              <label class="label">Quantity</label>
               <input value="${
                 ingredientItem.quantity
               }" class="input" placeholder="Quantity" name="quantity">
              <p class="help is-danger">${getError(errors, 'quantity')}</p>
            </div>
            <div class="field">
            <p class="control has-icons-left">
             <span class="select">
              <select name="unit">
                <option value="${ingredientItem.unit}" selected>${
        ingredientItem.unit
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
            
            <br />
            <button class="button is-primary">Save</button>
            <a href="/recipes/${
              ingredientItem.recipeid
            }/edit" class="button is-primary">Cancel</a>
          </form>
        </div>
      </div>
    `
    },
    true
  );
};
