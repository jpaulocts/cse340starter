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
  let options = '<option value="select" disabled hidden>Select an option</option>';
  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}">${row.classification_name}</option>`
  });
  return options
}

Util.accountLinks = function(account_id) {

  let div = `<div class="mnglink"><p>You are logged in</p><a href="../account/update/${account_id}" target="_blank">Edit Account Information</a></div>`
  return div
}

Util.checkJWTToken = async function(req, res, next) {
  if(req.cookies.jwt){
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function(err, accountData){
      if(err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        res.locals.loggedin = 0
        return res.redirect("../account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else{
    res.locals.loggedin = 0
    next()

  }
}

//Check Login

Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("../login")
  }
} 
/**********Middleware For Handling Errors
 * Wrap other function in this for
 * General error handling
 */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

//Check account type


Util.checkAccountType = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
        next(); // Check account type
      } else {
        req.flash('notice', 'Access denied. Please log in with an appropriate account.');
        return res.redirect('/account/login'); // Redirection
      }
    } catch (err) {
      req.flash('notice', 'Invalid token. Please log in.');
      return res.redirect('/account/login'); // Redirection
    }
  } else {
    req.flash('notice', 'No token found. Please log in.');
    return res.redirect('/account/login'); // Redirection
  }
};


Util.buildClassificationItemsToApprovalGrid = async function(data){
  let grid
  if (data.length > 0) {
      grid = '<ul id="inv-display">'
      for (const vehicle of data) { 
        let classData = await invModel.getClassificationName(parseInt(vehicle.classification_id))
        grid += '<li>'
        grid +=  '<img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" />'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += vehicle.inv_make + ' ' + vehicle.inv_model + ' ' + vehicle.inv_year + ' ' +  vehicle.inv_color
        grid += '</h2>'
        grid += `<span> ${classData.classification_name}`
        grid+= '<hr />'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid +='<hr />'
        grid += `<span> ${Number(vehicle.inv_miles).toLocaleString('en')} miles`
        grid+= '<hr />'
        grid += '<form class="admintable" action="/inv/approve" method="post">'
        grid += `<input type="hidden" name=inv_id value=${vehicle.inv_id}></input>`
        grid += '<button type="submit" id="approve">Approve</button>'
        grid +='</form>'
        grid +='<form class="admintable" action="/inv/disapprove" method="post">'
        grid += `<input type="hidden" name=inv_id value=${vehicle.inv_id}</input>`
        grid += '<button type="submit" id="disapprove">Disapprove</button>'
        grid +='</form>'
        grid += '</div>'
        grid += '</li>'
      }
      grid += '</ul>'
    } else { 
      grid = '<p class="notice"> There is no new vehicles to evaluate.</p>'
    }
    return grid
    
}

Util.buildClassificationsToApprovalGrid = async function (data) {
  let table
  if(data.length > 0){
    table = '<table id="suggested">' 
    table += '<thead><tr><th> Class Name</th><th>Actions</th></tr></thead>'
    table += '<tbody>' 
    data.forEach(classification =>{
      table +=`<tr><td>${classification.classification_name}</td>`
      table += `<td><form class="admintable" action="/inv/accept" method="post" style="inline;">`
      table += `<input type="hidden" name="classification_id" value="${classification.classification_id}">`
      table += `<button type="submit">Accept</button></form>`
      table += `<form class=admintable action="/inv/decline" method="post" style="inline;">`
      table += `<input type="hidden" name="classification_id" value="${classification.classification_id}">`
      table += `<button type="submit">Decline</button></form></td></tr>`

    })

    table += '</tbody>'
    table += '</table>'
  } else {
    table = '<p class="notice"> No classes were suggested</p>'
  }
  return table

}

Util.checkAdminAccount = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.account_type === 'Admin') {
        next(); // Check account type
      } else {
        req.flash('notice', 'Access denied. Please log in with an appropriate account.');
        return res.redirect('/account/login'); // Redirection
      }
    } catch (err) {
      req.flash('notice', 'Invalid token. Please log in.');
      return res.redirect('/account/login'); // Redirection
    }
  } else {
    req.flash('notice', 'No token found. Please log in.');
    return res.redirect('/account/login'); // Redirection
  }
};




module.exports = Util
