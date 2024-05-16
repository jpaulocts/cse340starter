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

module.exports = invCont

