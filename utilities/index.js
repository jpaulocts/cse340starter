const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/**************
 * Constructs the nav HTML unorderd list
 */
Util.getNav = async function (req, res, next){
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row)=>{
        list += "<li>"
        list += 
            '<a href="/inv/type/' 
            + row.classification_id + 
            '" title="See our inventory of ' +
            row.classification_name + 
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/*****
 * Build classification view HTML
 */

Util.buildClassificationGrid = async function(data){
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
          grid += '<li>'
          grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
          + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
          + 'details"><img src="' + vehicle.inv_thumbnail 
          +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
          +' on CSE Motors" /></a>'
          grid += '<div class="namePrice">'
          grid += '<hr />'
          grid += '<h2>'
          grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
          grid += '</h2>'
          grid += '<span>$' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
          grid += '</div>'
          grid += '</li>'
        })
        grid += '</ul>'
      } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
      }
      return grid
      
}


Util.details = async function(data){
  let div
  console.log(data)
  if (data.length >0) {
    div = `<div id="details">
    <section>
    <h1>${data[0].inv_year} ${data[0].inv_model} ${data[0].inv_make}</h1>
    <img id="detailimg" src="${data[0].inv_image}" alt="${data[0].inv_model}"></section>
    <section><h2>${data[0].inv_model} ${data[0].inv_make} Details</h2>
    <h3 id="price"> <span>Price</span>: ${Number(data[0].inv_price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</h3>
    <p><span>Description</span>: ${data[0].inv_description}</p>
    <p><span>Color</span>: ${data[0].inv_color}</p>
    <p><span>Miles</span>: ${Number(data[0].inv_miles).toLocaleString('en')}</p></section>
    </div>`
  } else{

    div = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return div

} 

// utility for management page

Util.managerLinks = function() {
  let div = '<div class="mnglink"><a href="../inv/add-classification" target="_blank">Add New Classification</a><a href="../inv/add-inventory" target="_blank">Add New Vehicle</a></div>'
  return div
}


Util.getOptions = async function (req, res, next){
  let data = await invModel.getClassifications()
  let select = '<select name="classification_name" id="classification_name">'
  select += '<option value="select">Select an option</option>'
  data.rows.forEach((row)=>{
      select += `<option value=${row.classification_id}>` + row.classification_name + '</option>'
    
  })
  select += "</select>"
  return select
}

Util.accountLinks = function() {
  let div = '<div class="mnglink"><p>You are logged in</p><a href="#" target="_blank">Edit Account Information</a></div>'
  return div
}

Util.checkJWTToken = async function(req, res, next) {
  if(req.cookies.jwt){
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function(err, accountData){
      if(err) {
        req.flash("Please log in")
        res.cleaCookie("jwt")
        return res.redirect("../account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else{
    next()
  }
}

//Check Login

Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("../account/login")
  }
} 
/**********Middleware For Handling Errors
 * Wrap other function in this for
 * General error handling
 */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
