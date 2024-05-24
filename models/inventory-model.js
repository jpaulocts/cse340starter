const pool = require("../database/")

/*********** All classification Data */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
/**********************
 * Get all inventory items 
 */
async function getInventoryByClassificationId(classification_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    }   catch(error){
    console.error("getclassificationsbyid error")
}
} 

async function getDetailsById(invId){
    try {
    
    const data = await pool.query(
        `SELECT * FROM public.inventory WHERE inv_id = $1`,
        [invId]     
    )
    console.log(data)
    return data.rows
   
} catch(error) {
    console.error("getdetailsbyud error")}
    throw error
}

async function checkExistingType(classification_name){
    try{
        const sql="SELECT * FROM classification WHERE classification_name =$1"
        const name = await pool.query(sql, [classification_name])
        return name.rowCount
    } catch (error){
        return error.message
    }
}

async function registerClass(classification_name) {
    try{
        const sql = "INSERT INTO classification(classification_name) VALUES ($1) RETURNING*"
        return await pool.query(sql, [classification_name])
    } catch(error) {
        return error.message
    }
}

async function registerInv(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name) {
    try{
        const classification = `SELECT classification_id FROM public.classification WHERE classification_id='${classification_name}'`
        const result = await pool.query(classification)
        const classification_id = result.rows[0].classification_id
        const sql = "INSERT INTO inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING*"
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch(error) {
        return error.message
    }
}



module.exports = {getClassifications, getInventoryByClassificationId, getDetailsById, checkExistingType, registerClass, registerInv}
