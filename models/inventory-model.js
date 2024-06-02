const pool = require("../database/")

/*********** All classification Data */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification WHERE classification_approved = true ORDER BY classification_name")
    
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
            WHERE inv_approved = true
            AND i.classification_id = $1`,
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
    
    return data.rows
   
} catch(error) {
    console.error("getdetailsbyud error", error)}
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

async function registerClass(classification_name, account_type, account_id) {
    try{

        if (account_type != "Admin") {

            const sql = "INSERT INTO classification(classification_name, classification_approved) VALUES ($1, false) RETURNING*"
            return await pool.query(sql, [classification_name])
        } else {
            const sql = "INSERT INTO classification(classification_name, classification_approved, account_id, classification_approval_date) VALUES ($1, true, $2) RETURNING*"
            return await pool.query(sql, [classification_name], [account_id])
        }
    } catch(error) {
        return error.message
    }
}

async function registerInv(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name, account_type, account_id) {
    try{
        const classification = `SELECT classification_id FROM public.classification WHERE classification_id='${classification_name}'`
        const result = await pool.query(classification)
        const classification_id = result.rows[0].classification_id
       
        if (account_type != "Admin"){
        const sql = "INSERT INTO inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_approved) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false) RETURNING*"
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
        } else{ 
            const sql = "INSERT INTO inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_approved, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, $11) RETURNING*"
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, account_id])
        }
    } catch(error) {
        return error.message
    }
}

async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_name) {
    try{
        const classification = `SELECT classification_id FROM public.classification WHERE classification_id='${classification_name}'`
        const result = await pool.query(classification)
        const classification_id = result.rows[0].classification_id
        const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2,  inv_description= $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING * "
        const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
        return data.rows[0]
    } catch(error) {
        console.error("model error: " + error)
    }
}

async function deleteInventoryItem(inv_id){

    try{
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data 
        
    } catch (error){
        new Error("Delete Inventory Error")
    }

}


async function getItemsToApproval() {
    try{
        const data =  await pool.query(
            "SELECT * FROM public.inventory WHERE inv_approved = false")
            
            console.log(data.rows, "items")
            return data.rows
            

    } catch (error){
        console.log("Database admin error inventory")
    }
}

async function getClassificationsToApproval() {
    try{
        const data =  await pool.query(
            "SELECT * FROM public.classification WHERE classification_approved = false")
            
            console.log(data.rows, "classifications")
            return data.rows
            

    } catch (error){
        console.log("Database admin error classification")
    }
}

async function getClassificationName(classification_id){
    try{
        const data = await pool.query(
            "SELECT classification_name FROM public.classification WHERE classification_id = $1", [classification_id])
            
            return data.rows[0]
    }catch(error){
        console.log("Error in Inventory-Model Module getClassificationName")
    }
}

async function deleteClassSuggestion(classification_id){

    try{
        const sql = "DELETE FROM public.classification WHERE classification_id = $1"
        const data = await pool.query(sql, [classification_id])
        return data 
        
    } catch (error){
        new Error("Delete Inventory Error")
    }

}

async function updateClassSuggestion(classication_id, account_id) {

    try{
        const timestamp = new Date().toISOString()
        const sql = "UPDATE public.classification SET  classification_approved = true, account_id = $1, classification_approval_date =$2  WHERE classification_id = $3 RETURNING * "
        const data = await pool.query(sql, [account_id, timestamp, classication_id])
        return data.rows[0]
        
    } catch (error){
        new Error("Update Class Error")
    }


}

async function updateItemSuggestion(inv_id, account_id){
    try{
        const timestamp = new Date().toISOString()
        const sql = "UPDATE public.inventory SET  inv_approved = true, account_id = $1, inv_approved_date =$2  WHERE inv_id = $3 RETURNING * "
        const data = await pool.query(sql, [account_id, timestamp, inv_id])
        return data.rows[0]
        
    } catch (error){
        new Error("Update Class Error")
    }
}



module.exports = {getClassifications, getInventoryByClassificationId, getDetailsById, checkExistingType, registerClass, registerInv, updateInventory, deleteInventoryItem, getItemsToApproval, getClassificationsToApproval, getClassificationName, deleteClassSuggestion, updateClassSuggestion, updateItemSuggestion}
