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

module.exports = {getClassifications, getInventoryByClassificationId}
