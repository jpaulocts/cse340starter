const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/************
 * Build inventory by classification view
 */
invCont.buildByClassificationId = async function (req, res, next){
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let  nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", 
    {title: className + " vehicles", 
    nav, 
    grid,})
}

invCont.buildByDetails = async function (req, res, next){
    const invId = req.params.invId
    const data = await invModel.getDetailsById(invId)
    const div = await utilities.details(data)
    let nav = await utilities.getNav()
    const className = data[0].inv_model
    res.render("./inventory/details", {title: className, nav, div})
}

invCont.buildManagement = async function(req, res, next){
    let div = utilities.managerLinks()
    let nav = await utilities.getNav()
    res.render("./inventory/management", {title: "Vehicle Management", nav, div})
}


invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {title: "Add Classification", nav, errors: null})
}

invCont.buildAddInventory =  async function (req, res, next) {
    let nav = await utilities.getNav()
    let select = await utilities.getOptions()
    res.render("./inventory/add-inventory", {title: "Add Inventory", nav, select, errors: null})
}


invCont.registerClassForm = async function(req, res) {
    let nav = await utilities.getNav()
    let div = utilities.managerLinks()
    const {classification_name} = req.body
    
    const regResult = await invModel.registerClass(classification_name)

    if (regResult) {
        req.flash("notice", `Congratulations, you are registered a ${classification_name} type.`)
        res.redirect("/inv")
    } else{
        req.flash("notice", "Sorry, the addition failed.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
        })
    }

}

invCont.registerInvForm = async function(req, res) {
    let nav = await utilities.getNav()
    let select = await utilities.getOptions()
    let div = utilities.managerLinks()
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name} = req.body
    
    const regResult = await invModel.registerInv(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name)
    console.log(regResult)

    if (regResult) {
        req.flash("notice", `Congratulations, you have registered a ${inv_make} ${inv_model} vehicle.`)
        res.redirect("/inv")
    } else{
        req.flash("notice", "Sorry, the addition failed.")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            select,
        })
    }

}

module.exports = invCont

