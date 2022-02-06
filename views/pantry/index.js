const layout = require('../layout');

module.exports = (pantryItems) => {
  const renderedPantryItems = pantryItems
    .map((pantryItem) => {
      return `
      <tr>
        <td>${pantryItem.item}</td>
        <td>${pantryItem.quantity}</td>
        <td>${pantryItem.unit}</td>
        <td>${pantryItem.price}</td>
        <td>
          <a href="/pantry/${pantryItem.id}/edit">
            <button class="button is-link">
              Edit
            </button>
          </a>
        </td>
        <td>
          <form method="POST" action="/pantry/${pantryItem.id}/delete">
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
        <h1 class="title">Pantry</h1>  
        <a href="/pantry/new" class="button is-primary">New Pantry Item</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${renderedPantryItems}
        </tbody>
      </table>
    `
    },
    true,
    'hero-image-pantry'
  );
};
