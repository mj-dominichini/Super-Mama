const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ content }) => {
  return layout(
    {
      content: `
      <div class="container">
        <div class="columns is-centered">
              <h1>${content}</h1>
        </div>
      </div>
    `
    },
    false
  );
};
