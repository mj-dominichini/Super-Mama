const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ req, errors }) => {
  return layout(
    {
      content: `
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-one-quarter">
            <form method="POST">
              <h1 class="title">Reset Password</h1>
              <div class="field">
                <label class="label">Password</label>
                <input required class="input" placeholder="Password" name="password" type="password" />
                <p class="help is-danger">${getError(errors, 'password')}</p>
              </div>
              <div class="field">
                <label class="label">Password Confirmation</label>
                <input required class="input" placeholder="Password Confirmation" name="passwordConfirmation" type="password" />
                <p class="help is-danger">${getError(
                  errors,
                  'passwordConfirmation'
                )}</p>
              </div>
              <button class="button is-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    `
    },
    false
  );
};
