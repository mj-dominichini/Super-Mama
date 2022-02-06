const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ errors }, recipeid, recipename) => {
  return layout(
    {
      content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="title">Add new ingredient</h1>

          <form method="POST">
            <div class="field">
              <label class="label">Ingredient name</label>
              <input class="input" placeholder="Ingredient" name="name">
              <p class="help is-danger">${getError(errors, 'name')}</p>
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
               <option value="not selected" selected>Unit of measure</option>
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
         <p class="help is-danger">${getError(errors, 'unit')}</p>
          </div>
            <button class="button is-primary">Add</button>
          </form>
        </div>
      </div>
    `
    },
    true
  );
};
