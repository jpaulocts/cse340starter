const utilities = require(".")
const {body, validationResult} = require("express-validator") //body request the body of request and validationResult is an object that contains all errors detected.
const validate = {}
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")

/******
 * Registration data validation
 */

validate.registrationRules = () => {
    return [
        //first name is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a first name"), //message sent when error

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2})
            .withMessage("Please provide a first name"), //message sent when error

        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() //refer to validator.js docs
            .withMessage("A valid email is required") //message sent when error
            .custom(async(account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),
        
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements')


    ]


} 

/***Check data */

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors, 
            title: "Register",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
        
    }
    
    next()

   
}

/*********
 * Add new Class 
 */

// Add new classification validation

validate.classificationRules = () => {
    return [
        //classification name is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha().withMessage("Invalid Format. The input should be alphabetical")
            .isLength({min: 1})
            .withMessage("Please provide a valid type of car") //message sent when error
            .custom(async(classification_name) => {
                const typeExist = await invModel.checkExistingType(classification_name)
                if (typeExist){
                    throw new Error("This type exists. Please type an different type of car")
                }
            }),

    ]


} 

/***Check data */

validate.checkClassData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors, 
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
        
    }
    
    next()

   
}

/*********
 * Add new vehicle validation
 */

// Add new vehicle validation

validate.inventoryRules = () => {
    return [
        body("classification_name")
            .notEmpty()
            .not().equals('Select an option').withMessage('Please, select an option.'),

        //inv Make is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 3})
            .withMessage("Please provide a Make"), //message sent when error

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 3})
            .withMessage("Please provide a Model"), //message sent when error

        body("inv_description")
            .notEmpty()
            .escape(),

        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()            
            .withMessage("A valid price is required"), //message sent when error
           
        
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .isLength({min:4, max: 4}).withMessage("The year should be 4 digits input")
            .withMessage('The year does not meet the requirements'),

            body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage('The miles value is invalid.'),


    ]


} 


/***Check data */

validate.checkInvData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.getOptions()
        res.render("inventory/add-inventory", {
            errors, 
            title: "Add Classification",
            nav,
            select,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color
            
        })
        return
        
    }
    
    next()

   
}


 module.exports = validate