const layout = require('../layout');

module.exports = (
  recipeId,
  recipeName,
  availableItems,
  missingItems,
  insufQtyItems,
  incompatibleUnitItems
) => {
  const renderedIncompUnitItems = incompatibleUnitItems
    .map((item) => {
      return `
    <tr>
      <td>${item.name}</td>
      <td>
        ${item.unit}
      </td>
      <td>
        ${item.pantryUnit}
      </td>       
    </tr>
  `;
    })
    .join('');

  const renderedMissingItems = missingItems
    .map((item) => {
      return `
      <tr>
        <td>${item.name}</td>
        <td>
          <form method="POST" action="/lists/shopping/${item.name}/add">
            <button class="button is-warning">Add to Groceries</button>
          </form>
        </td>
        <td>
          <form method="GET" action="/pantry/${item.name}/${item.unit}/new">
            <button class="button is-link">Add to Pantry</button>
         </form>
      </td>       
      </tr>
    `;
    })
    .join('');

  const renderedInsufQtyItems = insufQtyItems
    .map((item) => {
      return `
      <tr>
        <td>${item.name}</td>

        <td>
          <form method="POST" action="/lists/shopping/${item.name}/add">
            <button class="button is-warning">Add to Groceries</button>
          </form>
        </td> 
        <td>
          <form method="POST" action="/pantry/${item.id}/edit/from/recipe">
            <button class="button is-link">Update Pantry</button>
          </form>
        </td>
      
      </tr>
    `;
    })
    .join('');

  let content = '';
  let msg = 'Prepare';
  let isHidden = '';
  if (
    renderedMissingItems !== '' ||
    renderedInsufQtyItems !== '' ||
    renderedIncompUnitItems !== ''
  ) {
    msg = 'Cannot prepare';
    isHidden = 'is-hidden';
  }
  content = `
    <div class="control">
      <h1 class="title">${msg} "${recipeName}" recipe</h1>  
      <a href="/recipes/${recipeId}/commit" class="button is-primary ${isHidden}">Cook</a>
    </div>`;

  if (renderedMissingItems !== '') {
    content += `
     <table class="table">
      <thead>
        <tr>
          <th align="left">Ingredients missing in Pantry</th>
          <th align="left"></th>
          <th align="left"></th>
        </tr>
      </thead>
      <tbody>
          ${renderedMissingItems}
      </tbody>
    </table>
    `;
  }
  if (renderedInsufQtyItems !== '') {
    content += `
    <table class="table">
      <thead>
        <tr>
          <th align="left">Insufficient quantity in Pantry</th>
          <th align="left"></th>
          <th align="left"></th>
        </tr>
      </thead>
      <tbody>
        ${renderedInsufQtyItems}
      </tbody>
    </table>
`;
  }

  if (renderedIncompUnitItems !== '') {
    content += `
     <table class="table">
      <thead>
        <tr>
          <th align="left">Incompatible units</th>
          <th align="left">Recipe</th>
          <th align="left">Pantry</th>
        </tr>
      </thead>
      <tbody>
          ${renderedIncompUnitItems}
      </tbody>
    </table>
    `;
  }

  return layout(
    {
      content: content
    },
    true,
    'hero-image-recipe'
  );
};
