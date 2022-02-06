const express = require('express');

const { handleErrors, requireAuth } = require('./middlewares');
const pantryRepo = require('../repositories/pantryDAO');
const ingredientRepo = require('../repositories/ingredientDAO');
const pantryNewTemplate = require('../views/pantry/new');
const pantryNewFromRecipeTemplate = require('../views/pantry/newFromRecipe');
const pantryIndexTemplate = require('../views/pantry/index');
const pantryEditTemplate = require('../views/pantry/edit');
const {
  requireItem,
  requirePrice,
  requireQuantity,
  requireUnit,
  requireNoDupPantry
} = require('./validators');
const router = express.Router();

router.get('/pantry', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const pantry = pantryRepo.pantry.filter(
    (pantryItem) => pantryItem.userid === userId
  );
  res.send(pantryIndexTemplate(pantry));
});

router.get('/pantry/new', requireAuth, (req, res) => {
  res.send(pantryNewTemplate({}));
});

router.get('/pantry/:item/:unit/new', requireAuth, (req, res) => {
  const pantryItem = req.params.item;
  console.log(pantryItem);
  const unit = req.params.unit;
  res.send(pantryNewFromRecipeTemplate({ pantryItem, unit }));
});

router.post(
  '/pantry/new',
  requireAuth,
  [requireNoDupPantry, requireItem, requirePrice, requireQuantity, requireUnit],
  handleErrors(pantryNewTemplate),
  async (req, res) => {
    const userid = req.session.userId;
    const { item, quantity, unit, price } = req.body;

    await pantryRepo
      .createPantryItem({ userid, item, price, quantity, unit })
      .then(res.redirect('/pantry'));

    //res.redirect('/pantry');
  }
);

router.get('/pantry/:id/edit', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const pantryItemID = req.params.id;
  console.log(pantryRepo.pantry);
  const pantryItem = pantryRepo.pantry.filter(
    (pantry) =>
      pantry.userid === userId && parseInt(pantryItemID) == parseInt(pantry.id)
  )[0];
  console.log(pantryItem);
  if (!pantryItem) {
    return res.send('Product not found');
  }

  res.send(pantryEditTemplate({ pantryItem }));
});

router.post('/pantry/:id/edit/from/recipe', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const ingredientID = req.params.id;
  console.log(pantryRepo.pantry);
  const ingredient = ingredientRepo.ingredients.filter(
    (ing) => ing.userid === userId && ing.id == ingredientID
  )[0];
  console.log(ingredient);
  if (!ingredient) {
    return res.send('Product not found');
  }

  const pantryItem = pantryRepo.pantry.find(
    (i) =>
      i.userid === userId &&
      i.item.toLowerCase() == ingredient.name.toLowerCase()
  );

  res.redirect(`/pantry/${pantryItem.id}/edit`);
});

router.post(
  '/pantry/:id/edit',
  requireAuth,
  [requireItem, requirePrice, requireQuantity],
  handleErrors(pantryEditTemplate, (req) => {
    const userId = req.session.userId;
    const pantryItemID = req.params.id;
    console.log(pantryRepo.pantry);
    const pantryItem = pantryRepo.pantry.filter(
      (pantry) =>
        pantry.userid === userId && parseInt(pantryItemID) == pantry.id
    )[0];
    return { pantryItem };
  }),
  async (req, res) => {
    const pantryItem = {
      item: req.body.item,
      quantity: req.body.quantity,
      unit: req.body.unit,
      price: req.body.price
    };

    try {
      pantryItem['userid'] = req.session.userId;
      pantryItem['id'] = parseInt(req.params.id);
      await pantryRepo
        .update(req.params.id, pantryItem)
        .then(res.redirect('/pantry'));
    } catch (err) {
      return res.send(`Could not find item. ${err}`);
    }

    //res.redirect('/pantry');
  }
);

router.post('/pantry/:id/delete', requireAuth, async (req, res) => {
  await pantryRepo.delete(req.params.id).then(res.redirect('/pantry'));
});

module.exports = router;
