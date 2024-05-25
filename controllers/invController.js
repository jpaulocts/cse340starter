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
    const classificationSelect = await utilities.getOptions()
    res.render("./inventory/management", {title: "Vehicle Management", nav, div, errors:null, classificationSelect})
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    console.log(invData)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }


  invCont.buildInvEdit =  async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const invData = await invModel.getDetailsById(inv_id)
    
    let select = await utilities.getOptions()
    const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
    res.render("./inventory/edit-inventory", {title: "Edit " + itemName,
     nav, 
     select,
     errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_description: invData[0].inv_description,
    inv_image: invData[0].inv_image,
    inv_thumbnail: invData[0].inv_thumbnail,
    inv_price: invData[0].inv_price,
    inv_miles: invData[0].inv_miles,
    inv_color: invData[0].inv_color,
    classification_id: parseInt(invData[0].classification_id)
 })
}

// Updating on database

invCont.updateInventory = async function(req, res) {
    let nav = await utilities.getNav()
    let select = await utilities.getOptions()
    let div = utilities.managerLinks()
    const {inv_id, inv_make, inv_model,  inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_name} = req.body
    const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model,  inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_name)

    console.log(updateResult)

    if (updateResult) {
        const itemName = updateResult.inv_make + "" + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully update.` )
        res.redirect("/inv")
    } else{
        const select = await utilities.getOptions()
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("./inventory/edit-inventory", {
            title: "Edit" + itemName,
            nav,
            select,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }

}


invCont.deleteView = async function (req,res, next){
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData =  await invModel.getDetailsById(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/delete-confirm", {title: "Delete " + itemName,
        nav, 
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_price: itemData[0].inv_price
    })
}

invCont.deleteItem = async function (req, res, next){
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if(deleteResult){
        req.flash("notice", 'The deletion was sucessful.')
        res.redirect('/inv')
    } else {
        req.flash("notice", 'The deletion failed.')
        res.redirect(`/inv/delete/${inv_id}`)
    }
}


module.exports = invCont

