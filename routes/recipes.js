const express = require('express');

const { handleErrors, requireAuth } = require('./middlewares');
const recipesRepo = require('../repositories/recipeDAO');
const ingredientsRepo = require('../repositories/ingredientDAO');
const pantryRepo = require('../repositories/pantryDAO');
const recipesNewTemplate = require('../views/recipes/new');
const prepareTemplate = require('../views/recipes/prepare');
const ingredientsNewTemplate = require('../views/ingredients/new');
const recipesIndexTemplate = require('../views/recipes/index');
const recipesEditTemplate = require('../views/recipes/edit');
const ingredientsEditTemplate = require('../views/ingredients/edit');
const {
  requireName,
  requireIngredientName,
  requireInstructions,
  requireQuantity,
  requireUnit
} = require('./validators');
const router = express.Router();
const convert = require('convert-units');
const { pantry } = require('../repositories/pantryDAO');
const e = require('express');
const { redirect } = require('express/lib/response');

router.get('/ingredients/:id/:name/new', requireAuth, (req, res) => {
  const recipesItemID = req.params.id;
  const recipeName = req.params.name;
  res.send(ingredientsNewTemplate({}, recipesItemID, recipeName));
});

router.get('/ingredients/:id/edit', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const ingredientItemID = req.params.id;

  const ingredientItem = ingredientsRepo.ingredients.filter(
    (ingredient) =>
      ingredient.userid === userId &&
      parseInt(ingredientItemID) == ingredient.id
  )[0];

  if (!ingredientItem) {
    return res.send('Ingredient not found');
  }

  res.send(ingredientsEditTemplate({ ingredientItem }));
});

router.post(
  '/ingredients/:id/edit',
  requireAuth,
  [requireIngredientName, requireQuantity, requireUnit],
  handleErrors(ingredientsEditTemplate, (req) => {
    const userId = req.session.userId;
    const ingredientItemID = req.params.id;
    const ingredientItem = ingredientsRepo.ingredients.filter(
      (ingredient) =>
        ingredient.userid === userId &&
        parseInt(ingredientItemID) == ingredient.id
    )[0];
    return { ingredientItem };
  }),
  async (req, res) => {
    const ingredientItem = {
      recipeid: req.body.recipeid,
      name: req.body.name,
      quantity: req.body.quantity,
      unit: req.body.unit
    };

    try {
      ingredientItem['userid'] = req.session.userId;
      ingredientItem['id'] = parseInt(req.params.id);
      await ingredientsRepo
        .update(req.params.id, ingredientItem)
        .then(res.redirect(`/recipes/${ingredientItem.recipeid}/edit`));
    } catch (err) {
      return res.send(`Could not find item. ${err}`);
    }

    //res.redirect(`/recipes/${ingredientItem.recipeid}/edit`);
  }
);

router.get('/recipes', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const recipes = recipesRepo.recipes.filter(
    (recipesItem) => recipesItem.userid === userId
  );
  res.send(recipesIndexTemplate(recipes));
});

router.get('/recipes/new', requireAuth, (req, res) => {
  res.send(recipesNewTemplate({}));
});

router.post(
  '/recipes/new',
  requireAuth,
  [requireName],
  handleErrors(recipesNewTemplate),
  async (req, res) => {
    const userid = req.session.userId;
    const { name, instructions } = req.body;
    await recipesRepo
      .createRecipe({
        userid,
        name,
        instructions
      })
      .then(res.redirect('/recipes'));

    //res.redirect('/recipes');
  }
);

router.post(
  '/ingredients/:id/:name/new',
  requireAuth,
  [requireName, requireQuantity, requireUnit],
  handleErrors(ingredientsNewTemplate),
  async (req, res) => {
    const userid = req.session.userId;
    const recipeid = req.params.id;
    const { name, quantity, unit } = req.body;

    await ingredientsRepo
      .createIngredient({
        userid,
        recipeid,
        name,
        quantity,
        unit
      })
      .then(res.redirect(`/recipes/${recipeid}/edit`));

    //res.redirect(`/recipes/${recipeid}/edit`);
  }
);

router.post(
  '/ingredients/:recipeid/:id/delete',
  requireAuth,
  async (req, res) => {
    await ingredientsRepo
      .delete(req.params.id)
      .then(res.redirect(`/recipes/${req.params.recipeid}/edit`));

    //res.redirect(`/recipes/${req.params.recipeid}/edit`);
  }
);

router.get('/recipes/:id/edit', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const recipesItemID = req.params.id;
  console.log(recipesRepo.recipes);
  const recipesItem = recipesRepo.recipes.filter(
    (recipes) =>
      recipes.userid === userId && parseInt(recipesItemID) == recipes.id
  )[0];

  const ingredients = ingredientsRepo.ingredients.filter(
    (ingredient) =>
      ingredient.userid === userId &&
      parseInt(recipesItemID) == ingredient.recipeid
  );

  if (!recipesItem) {
    return res.send('Recipe not found');
  }

  res.send(recipesEditTemplate({ recipesItem, ingredients }));
});

router.post(
  '/recipes/:id/edit',
  requireAuth,
  [requireName, requireInstructions],
  handleErrors(recipesEditTemplate, (req) => {
    const userId = req.session.userId;
    const recipesItemID = req.params.id;
    const recipesItem = recipesRepo.recipes.filter(
      (recipes) =>
        recipes.userid === userId && parseInt(recipesItemID) == recipes.id
    )[0];
    return { recipesItem };
  }),
  async (req, res) => {
    const recipesItem = {
      name: req.body.name,
      instructions: req.body.instructions
    };

    try {
      recipesItem['userid'] = req.session.userId;
      recipesItem['id'] = parseInt(req.params.id);
      await recipesRepo
        .update(req.params.id, recipesItem)
        .then(res.redirect('/recipes'));
    } catch (err) {
      return res.send(`Could not find item. ${err}`);
    }

    //res.redirect('/recipes');
  }
);

router.post('/recipes/:id/delete', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const recipeid = req.params.id;

  const ingredients = ingredientsRepo.ingredients.filter(
    (ingredient) =>
      ingredient.userid === userId && parseInt(recipeid) == ingredient.recipeid
  );

  ingredients.forEach((i) => ingredientsRepo.delete(i.id));

  await recipesRepo.delete(req.params.id).then(res.redirect('/recipes'));

  //res.redirect('/recipes');
});

router.post('/recipes/:id/prepare', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const recipeid = req.params.id;

  const recipeName = recipesRepo.recipes.filter(
    (recipe) => recipe.userid === userId && parseInt(recipeid) == recipe.id
  )[0].name;

  const ingredients = ingredientsRepo.ingredients.filter(
    (ingredient) =>
      ingredient.userid === userId && parseInt(recipeid) == ingredient.recipeid
  );

  let availableItems = [];
  let missingItems = [];
  let insufQtyItems = [];
  let incompatibleUnitItems = [];

  ingredients.forEach((i) => {
    let pantryItem = pantryRepo.pantry.find(
      (el) =>
        el.userid === userId && el.item.toLowerCase() === i.name.toLowerCase()
    );

    if (pantryItem !== undefined) {
      try {
        let requiredQty = convert(i.quantity).from(i.unit).to(pantryItem.unit);
        if (requiredQty <= pantryItem.quantity) {
          availableItems.push(i);
        } else {
          insufQtyItems.push(i);
        }
      } catch (error) {
        i['pantryUnit'] = pantryItem.unit;
        incompatibleUnitItems.push(i);
      }
    } else {
      missingItems.push(i);
    }
  });

  res.send(
    prepareTemplate(
      recipeid,
      recipeName,
      availableItems,
      missingItems,
      insufQtyItems,
      incompatibleUnitItems
    )
  );
});

router.get('/recipes/:id/commit', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const recipesItemID = req.params.id;

  const ingredients = ingredientsRepo.ingredients.filter(
    (ingredient) =>
      ingredient.userid === userId &&
      parseInt(recipesItemID) == ingredient.recipeid
  );

  ingredients.forEach((i) => {
    let pantryItem = pantryRepo.pantry.find(
      (el) =>
        el.userid === userId && el.item.toLowerCase() === i.name.toLowerCase()
    );
    if (pantryItem) {
      let usedQty = convert(i.quantity).from(i.unit).to(pantryItem.unit);

      pantryItem['quantity'] = Number.parseFloat(
        pantryItem['quantity'] - usedQty
      ).toPrecision(5);
      pantryRepo.update(pantryItem.id, pantryItem);
    }
  });

  res.redirect('/recipes');
});

module.exports = router;
