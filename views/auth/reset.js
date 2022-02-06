const layout = require('../layout');
const { getError } = require('../helpers');

module.exports = ({ errors }) => {
  return layout(
    {
      content: `
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-one-quarter">
            <form method="POST">
              <h1 class="title">Password Reset</h1>
              <div class="field">
                <label class="label">Email</label>
                <input required class="input" placeholder="Email" name="email" />
                <p class="help is-danger">${getError(errors, 'email')}</p>
              </div>
              <button class="button is-primary">Reset Password</button>
              <br>
              <br>
              <p class="is-size-7">* Reset link will be sent to email </p> 
            </form>
          </div>
        </div>
      </div>
    `
    },
    false
  );
};
