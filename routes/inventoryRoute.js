//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

//Route to build inventory by classification view

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByDetails))

//Route to build intentional error

router.get("/trigger", utilities.handleErrors(errorController.triggerError))

//Routes to management views

router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))

router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))

router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))

// Post Form routes

router.post("/add-classification", regValidate.classificationRules(), regValidate.checkClassData, utilities.handleErrors(invController.registerClassForm))

router.post("/add-inventory", regValidate.inventoryRules(), regValidate.checkInvData, utilities.handleErrors(invController.registerInvForm))

// Mangamente selection route

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// edit route

router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildInvEdit))
router.post("/update/", regValidate.editRules(), regValidate.checkEdit, utilities.handleErrors(invController.updateInventory))

// delete route

router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView))
router.post("/delete", utilities.handleErrors(invController.deleteItem))


module.exports = router;