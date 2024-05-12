
exports.triggerError = (req, res, next) => {
    try{
        //Causing an intentional error
        throw new Error('500 ERROR')
    } catch {error}{
        next({status: 500, message: 'SERVER ERROR'})
    }
}