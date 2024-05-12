const invModel = require("../models/inventory-model")
const Util = {}

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
    <h3 id="price"> <span>Price</span>: $${data[0].inv_price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</h3>
    <p><span>Description</span>: ${data[0].inv_description}</p>
    <p><span>Color</span>: ${data[0].inv_color}</p>
    <p><span>Miles</span>: ${data[0].inv_miles}</p></section>
    </div>`
  } else{

    div = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return div

} 

/**********Middleware For Handling Errors
 * Wrap other function in this for
 * General error handling
 */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
