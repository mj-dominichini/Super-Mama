const layout = require('../layout');

module.exports = (recipeItems) => {
  const renderedrecipeItems = recipeItems
    .map((recipeItem) => {
      return `
      <tr>
        <td>${recipeItem.name}</td>

        <td>
          <form method="POST" action="/recipes/${recipeItem.id}/prepare">
            <button class="button is-warning">Prepare</button>
          </form>
        </td> 
        <td>
        <a href="/recipes/${recipeItem.id}/edit">
          <button class="button is-link">
            View / Modify Ingredients
          </button>
        </a>
      </td>       
        <td>
          <form method="POST" action="/recipes/${recipeItem.id}/delete">
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
      <div class="control">
        <h1 class="title">Recipes</h1>  
        <a href="/recipes/new" class="button is-primary">New Recipe</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th align="left">Recipe Name</th>
            <th align="center"></th>
            <th align="center"></th>
            <th align="center"></th>
          </tr>
        </thead>
        <tbody>
          ${renderedrecipeItems}
        </tbody>
      </table>
    `
    },
    true,
    'hero-image-recipe'
  );
};
