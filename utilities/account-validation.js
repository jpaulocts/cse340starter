const utilities = require(".")
const {body, validationResult} = require("express-validator") //body request the body of request and validationResult is an object that contains all errors detected.
const validate = {}

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
            .isLength({min: 2})
            .withMessage("Please provide a first name")
            .isEmail()
            .normalizeEmail() //refer to validator.js docs
            .withMessage("A valid email is required"), //message sent when error
        
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
 module.exports = validate