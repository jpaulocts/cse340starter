const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const accountController = {}
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

accountController.buildLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title:"Login",
        nav,
        errors: null,
    })
}

accountController.buildRegister = async function(req, res, next){
    let nav = await utilities.getNav()
    res.render("./account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

accountController.registerAccount = async function(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body
    //Hash
    let hashedPassword
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Register",
            nav, 
            errors: null,
        })

    } 

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
    )

    if (regResult) {
        req.flash("notice", `Congratulations, you are registered ${account_firstname}. Please log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors:null,
        } )
    } else{
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }

}


/*****
 * Process login request
 */

 accountController.accountLogin = async function(req,res){
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if(!accountData) {
        req.flash("notice", "Please check your credentials an try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        console.log("Checking credentials")
        if( await bcrypt.compare(account_password, accountData.account_password)){
            console.log("Deleting password....")
            console.log(account_password, accountData.account_password)
            delete accountData.account_password
            console.log("Password ok!")
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
            console.log("Access Token: ", accessToken)
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600*1000})
            } else{
                res.cookie("jwt", accessToken,{httpOnly: true, secure: true, maxAge: 3600*1000})
            }
            return res.redirect("/account")
        }
    } catch(error){
        return new Error("Access Forbiden")
    }
}

accountController.buildAccount = async function(req, res, next){
    const token = req.cookies.jwt
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const accountType = decoded.account_type
    const firstName = decoded.account_firstname
    const lastName = decoded.account_lastname
    const email = decoded.account_email
    const account_id = parseInt(decoded.account_id)
    let div = utilities.accountLinks(account_id)
    let nav = await utilities.getNav()
    res.render("./account/management", {title: "Account Management", nav, div,firstName, lastName, email, account_id, accountType, errors:null})
}


accountController.buildUpdate = async function(req, res, next) {
        const account_Id = parseInt(req.params.account_id)
        console.log("OK", account_Id)
        const dataAccount = await accountModel.getDataByAccountId(account_Id)
        console.log("UPDATE",dataAccount)
        const accountType = dataAccount.account_type
        const firstName = dataAccount.account_firstname
        const lastName = dataAccount.account_lastname
        const email = dataAccount.account_email
        const account_id = parseInt(dataAccount.account_id)
    let nav = await utilities.getNav()
    res.render("./account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname: firstName,
        account_lastname: lastName,
        account_email: email,
        accountType: accountType,
        account_id: account_id

})
}

accountController.registerUpdate = async function(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_id} = req.body

    const regResult = await accountModel.registerUpdate(
        account_firstname,
        account_lastname,
        account_email,
        account_id,
    )

    if (regResult) {
        req.flash("notice", `Congratulations, you have updated ${account_firstname} account.`)
        res.redirect('/account')
    } else{
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("./account/update", {
            title: "Edit Account",
            nav,
        })
    }

}

accountController.registerPassword = async function(req, res) {
    let nav = await utilities.getNav()
    const {account_password, account_id} = req.body

    let hashedPassword
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing in the password editing.')
        res.redirect('account/update')

    } 

    const regResult = await accountModel.registerPassword(
        hashedPassword,
        account_id,
    )

    if (regResult) {
        req.flash("notice", `Congratulations, you have updated ${account_firstname} password.`)
        res.redirect('/account')
    } else{
        req.flash("notice", "Sorry, the update failed.")
        res.redirect('account/update')
    }

}


//Log out

accountController.logout = (req, res, next) => {
    res.clearCookie('jwt')
    res.redirect('/');
}




module.exports = accountController