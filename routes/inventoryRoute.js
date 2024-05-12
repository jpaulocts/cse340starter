//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

//Route to build inventory by classification view

router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory details
router.get("/detail/:invId", invController.buildByDetails)

console.log("teste")

module.exports = router;