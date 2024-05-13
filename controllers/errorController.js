const errorController = {}

errorController.triggerError = async function(req, res, next) {
    
        //Causing an intentional error
        throw new Error('INTENTIONAL ERROR')
   
    }
module.exports = errorController