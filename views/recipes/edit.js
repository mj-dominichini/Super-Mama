const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ recipesItem, ingredients, errors }) => {
  const renderedIngredients = ingredients
    .map((ingredient) => {
      return `
    <tr>
      <td>${ingredient.name}</td>
      <td>${ingredient.quantity}</td>
      <td>${ingredient.unit}</td>
      
      <td>
        <a href="/ingredients/${ingredient.id}/edit">
          <button class="button is-link">
            Edit
          </button>
        </a>
      </td>
      <td>
        <form method="POST" action="/ingredients/${ingredient.recipeid}/${ingredient.id}/delete">
          <button class="button is-danger">Delete</button>
        </form>
      </td>
    </tr>
  `;
    })
    .join('');
  return layout(
    {
      content: `
      <div class="columns is-centered">
        <div class="column is-full">
          <h1 class="title">Edit recipe</h1>

          <form method="POST">
            <div class="field">
              <label class="label">Name</label>
              <input value="${
                recipesItem.name
              }" class="input" placeholder="Recipe Name" name="name">
            <p class="help is-danger">${getError(errors, 'name')}</p>
          </div>
            <div class="field">
              <label class="label">Instructions</label>
              <textarea rows="10" class="textarea" placeholder="Instructions" name="instructions">${
                recipesItem.instructions
              }</textarea>
              <p class="help is-danger">${getError(errors, 'instructions')}</p>
            </div>
  
            <br />
            <button class="button is-primary">Save</button>
            <a href="/recipes" class="button is-primary">Cancel</a>
          </form>
        </div>
      </div>
      <div class="columns is-centered">
      <table class="table">
      <thead>
        <tr>
          <th>Ingredients</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        ${renderedIngredients}
      </tbody>
    </table>
    </div>
    <div class="control">


    <a href="/ingredients/${recipesItem.id}/${
        recipesItem.name
      }/new" class="button is-primary">Add New Ingredient</a>
    </div>
    `
    },
    true,
    'hero-image-recipe'
  );
};
