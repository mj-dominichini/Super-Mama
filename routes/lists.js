const express = require('express');
const userDAO = require('../repositories/userDAO');
const listDAO = require('../repositories/listDAO');
const mandrill = require('node-mandrill')('HDxcDkAKNOkoJM7vfkssmQ');
const { handleErrors, requireAuth } = require('./middlewares');
const listsTemplate = require('../views/lists/lists');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/lists', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const userObject = userDAO.users.find((user) => user.id === userId);
  const userName = userObject['name'];
  const lists = listDAO.lists.filter((list) => list.userid === userId);
  return res.send(listsTemplate(lists, userObject['email']));
});

router.post('/lists/:id/delete', requireAuth, async (req, res) => {
  await listDAO.delete(req.params.id).then(res.redirect('/lists'));

  //res.redirect('/lists');
});

router.post(
  '/lists/:id/email',
  bodyParser.json(),
  requireAuth,
  async (req, res) => {
    const userId = req.session.userId;
    const userObject = userDAO.users.find((user) => user.id === userId);
    const userName = userObject['name'];
    const userEmail = userObject['email'];

    console.log(req);

    mandrill(
      '/messages/send',
      {
        message: {
          to: [{ email: userEmail, name: userName }],
          from_email: 'supermama@curiousmindtech.com',
          subject: req.body.title,
          text: req.body.content
        }
      },
      function (error, response) {
        if (error) console.log(JSON.stringify(error));
        else console.log(response);
      }
    );

    //res.redirect('/lists');
    res.send('OK');
  }
);

router.post('/lists/shopping/:name/add', requireAuth, async (req, res) => {
  const gsl = 'Groceries';
  const ingredient = req.params.name;
  const userId = req.session.userId;
  const shoppingList = listDAO.lists.find(
    (list) =>
      list.userid === userId &&
      list.title.toLowerCase().trim() === gsl.toLowerCase().trim()
  );

  console.log(shoppingList);
  if (shoppingList) {
    if (
      !shoppingList.content
        .toLowerCase()
        .trim()
        .includes(ingredient.toLowerCase().trim())
    ) {
      shoppingList.content += `\n${ingredient}`;
      await listDAO
        .update(shoppingList.id, shoppingList)
        .then(res.redirect('/lists'));
    }
  } else {
    const list = {
      title: gsl,
      content: ingredient
    };

    console.log(list);
    try {
      list['userid'] = req.session.userId;
      await listDAO.createList(list).then(res.redirect('/lists'));
    } catch (err) {
      return res.send(`Could not create list. ${err}`);
    }
  }
  res.redirect('/lists');
});

router.post('/lists/:id/save', requireAuth, async (req, res) => {
  console.log(req.body);
  const list = {
    title: req.body.title,
    content: req.body.content
  };

  console.log('Lista' + list);
  try {
    list['userid'] = req.session.userId;
    list['id'] = parseInt(req.params.id);
    await listDAO.update(req.params.id, list).then(res.redirect('/lists'));
  } catch (err) {
    return res.send(`Could not find list. ${err}`);
  }

  //res.redirect('/lists');
});

router.post('/lists/:id/new', requireAuth, async (req, res) => {
  console.log(req.body);
  const list = {
    title: req.body.title,
    content: req.body.content
  };

  console.log(list);
  try {
    list['userid'] = req.session.userId;
    console.log(list);
    await listDAO.createList(list).then(res.redirect('/lists'));
  } catch (err) {
    return res.send(`Could not find list. ${err}`);
  }

  //res.redirect('/lists');
});

module.exports = router;
