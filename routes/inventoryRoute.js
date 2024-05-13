//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

//Route to build inventory by classification view

router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory details
router.get("/detail/:invId", invController.buildByDetails)

router.get("/trigger", utilities.handleErrors(errorController.triggerError))

module.exports = router;