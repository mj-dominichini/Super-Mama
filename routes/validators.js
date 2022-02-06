const { check } = require('express-validator');
const userDAO = require('../repositories/userDAO');
const pantryDAO = require('../repositories/pantryDAO');

module.exports = {
  requireNoDupPantry: check('item')
    .trim()
    .custom((pi) => {
      const existingItem = pantryDAO.pantry.find(
        (i) => i.item.toLowerCase() === pi.toLowerCase()
      );
      if (existingItem) {
        throw new Error('Pantry item already exists.');
      } else {
        return true;
      }
    }),
  requireIngredientName: check('name')
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage('Ingredient name is required'),
  requireInstructions: check('instructions')
    .exists()
    .withMessage('Instructions are required'),
  requireName: check('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name is required'),
  requireUnit: check('unit')
    .exists()
    .withMessage('Unit is required')
    .isString()
    .isIn([
      'mcg',
      'mg',
      'g',
      'kg',
      'oz',
      'lb',
      'ml',
      'l',
      'tsp',
      'Tbs',
      'fl-oz',
      'cup',
      'pnt',
      'qt',
      'gal'
    ])
    .withMessage('Must contain valid value'),
  requireQuantity: check('quantity')
    .trim()
    .toFloat()
    .isFloat({ min: 0.0001 })
    .withMessage('Must be greater or equal to 0.0001'),
  requireItem: check('item')
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage('Must be between 1 and 40 characters long'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 0.0001 })
    .withMessage('Must be a number greater than 0'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom((email) => {
      const existingUser = userDAO.users.find((user) => user.email === email);
      if (existingUser) {
        throw new Error('Email in use');
      } else {
        return true;
      }
    }),
  checkUsername: check('name')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Must be between 1 and 20 characters long'),
  checkPassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters long'),
  checkPasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters long')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      } else {
        return true;
      }
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom((email) => {
      const existingUser = userDAO.users.find((user) => user.email === email);
      if (!existingUser) {
        throw new Error('Email not found');
      } else {
        return true;
      }
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const { email } = req.body;
      const existingUser = userDAO.users.find((user) => user.email === email);
      if (!existingUser) {
        throw new Error('Invalid password');
      }
      console.log(existingUser);
      const validPassword = await userDAO.comparePasswords(
        existingUser.password,
        password
      );
      if (!validPassword) {
        throw new Error('Invalid password');
      } else {
        return true;
      }
    })
};
