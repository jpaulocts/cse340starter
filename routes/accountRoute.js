const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

router.get('/logout', utilities.handleErrors(accountController.logout))

router.get('/update/:account_id', utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate))

router.post("/update", regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.registerUpdate))

router.post("/password", regValidate.passwordRules(), regValidate.checkPassword, utilities.handleErrors(accountController.registerPassword))

module.exports = router