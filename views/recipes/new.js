const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ errors }) => {
  return layout(
    {
      content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="title">Create recipe</h1>

          <form method="POST">
            <div class="field">
              <label class="label">Recipe name</label>
              <input class="input" placeholder="Recipe name" name="name">
              <p class="help is-danger">${getError(errors, 'name')}</p>
            </div>
            
            <div class="field">
              <label class="label">Instructions</label>
              <textarea rows="10" class="textarea" placeholder="Instructions" name="instructions"></textarea>
              <p class="help is-danger">${getError(errors, 'instructions')}</p>
           </div>

            <button class="button is-primary">Create</button>
          </form>
          <br>
          <p class="is-size-7">* You can add recipe ingredients on 'View / Modify Ingredients' screen</p> 
        </div>
      </div>
    `
    },
    true,
    'hero-image-recipe'
  );
};
