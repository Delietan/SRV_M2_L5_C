var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var DishesService = require('../services/DishesService');
var db = require('../models');
var dishesService = new DishesService(db);

/* GET All dishes */
router.get('/', async function (req, res, next) {
	try {
		const Dishes = await dishesService.getAllDishes();
		res.status(200).send({ statuscode: 200, dishes: Dishes });
	} catch (error) {
		console.log(error);
	}
});

/* GET Specific dish from the dish name */
router.get('/:dishname', async function (req, res, next) {
	try {
		const Dishes = await dishesService.getDish(req.params.dishname);
		res.status(200).send({ statuscode: 200, dishes: Dishes });
	} catch (error) {
		res.status(500).send({ statuscode: 500, error: error.message });
	}
});

/* POST create a new dish for the country and add country if the country is not in the database*/
router.post('/', jsonParser, async function (req, res, next) {
	try {
		let { Name, Country } = req.body;
		let result = await dishesService.createDish(Name, Country);
		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({ statuscode: 500, error: error.message });
	}
});

// Delete a pizza
router.delete('/', jsonParser, async function (req, res, next) {
	try {
		// Validate input
		const { Name } = req.body;
		if (!Name) {
			return res.status(400).send({ statuscode: 400, message: 'Dish name is required' });
		}

		// Call the service to delete the dish
		let result = await dishesService.deleteDish(Name);

		// Return success message
		res.status(200).send({ statuscode: 200, message: 'Dish deleted successfully', result });
	} catch (error) {
		// Handle unexpected errors
		console.error(error);  // Log the error for debugging
		res.status(500).send({ statuscode: 500, message: error.message });
	}
});

module.exports = router;
