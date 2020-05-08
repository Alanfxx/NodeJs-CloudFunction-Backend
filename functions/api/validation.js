module.exports = app => {
    function existsOrError(value, mssg) {
        if(!value) throw mssg
        if(Array.isArray(value) && value.length === 0) throw mssg
        if(typeof value === 'string' && !value.trim()) throw mssg
    }
    
    function notExistsOrError(value, mssg) {
        try {
            existsOrError(value, mssg)
        } catch(mssg) {
            return
        }
        throw mssg
    }
    
    function equalsOrError(valueA, valueB, mssg) {
        if(valueA !== valueB) throw mssg
    }

    return { existsOrError, notExistsOrError, equalsOrError }
}