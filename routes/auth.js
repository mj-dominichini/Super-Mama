const express = require('express');
const { handleErrors } = require('./middlewares');
const { check, validationResult } = require('express-validator');
const userDAO = require('../repositories/userDAO');
const util = require('util');
const jwt = require('jsonwebtoken');
const config = require('config');
const mandrill = require('node-mandrill')('HDxcDkAKNOkoJM7vfkssmQ');
const server = config.get('server.host');
const port = config.get('server.port');

const signupTemplate = require('../views/auth/signup');
const signinTemplate = require('../views/auth/signin');
const resetTemplate = require('../views/auth/reset');
const newpwdTemplate = require('../views/auth/newpwd');
const pwdchangedTemplate = require('../views/auth/pwd');

const {
  requireEmail,
  checkPassword,
  checkPasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
  checkUsername
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [checkUsername, requireEmail, checkPassword, checkPasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { name, email, password } = req.body;

    const id = await userDAO.createUser({ name, email, password });

    req.session.userId = id;

    console.log(`session id: ${req.session.userId}`);

    res.redirect('/dashboard');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const existingUser = userDAO.users.find((user) => user.email === email);
    req.session.userId = existingUser.id;

    res.redirect('/dashboard');
  }
);

router.get('/reset', (req, res) => {
  res.send(resetTemplate({}));
});

router.post(
  '/reset',
  [requireEmailExists],
  handleErrors(resetTemplate),
  async (req, res) => {
    const { email } = req.body;
    const existingUser = userDAO.users.find((user) => user.email === email);

    const payload = {
      email: existingUser.email,
      id: existingUser.id
    };

    const token = jwt.sign(payload, existingUser.password, {
      expiresIn: '15m'
    });
    const link = `http://${server}:${port}/reset/${existingUser.id}/${token}`;

    mandrill(
      '/messages/send',
      {
        message: {
          to: [{ email: existingUser.email, name: existingUser.name }],
          from_email: 'supermama@curiousmindtech.com',
          subject: 'Password reset link',
          text: `Click on the following link to reset your password\n${link} \n\nThe link will expire in 15 minutes.`
        }
      },
      function (error, response) {
        if (error) console.log(JSON.stringify(error));
        else console.log(response);
      }
    );
    res.redirect('/pwd/sent');
  }
);

router.get('/reset/:id/:token', (req, res) => {
  const id = req.params.id;
  const token = req.params.token;

  const user = userDAO.users.find((user) => user.id === id);

  if (user) {
    try {
      const payload = jwt.verify(token, user.password);
      res.send(newpwdTemplate({}));
    } catch (err) {
      return res.send(
        pwdchangedTemplate({
          content: 'Expired or invalid password reset token.'
        })
      );
    }
  }
});

router.get('/pwd/changed', (req, res) => {
  return res.send(
    pwdchangedTemplate({ content: 'Your password was sucessfully changed.' })
  );
});

router.get('/pwd/sent', (req, res) => {
  return res.send(
    pwdchangedTemplate({
      content: 'Password reset link was sent to your email.'
    })
  );
});

router.post(
  '/reset/:id/:token',
  [checkPassword, checkPasswordConfirmation],
  handleErrors(newpwdTemplate),
  async (req, res) => {
    const { id, token } = req.params;
    const newpwd = req.body.password;

    const user = userDAO.users.find((user) => user.id === id);

    if (user) {
      try {
        const payload = jwt.verify(token, user.password);
      } catch (err) {
        console.log(err.message);
        res.send(err.message);
      }
      user.password = newpwd;
      await userDAO.update(user);
    }

    res.redirect('/pwd/changed');
  }
);
module.exports = router;
