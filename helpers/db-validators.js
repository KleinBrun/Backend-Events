
const isValidDate = async (date = '') => {
    const parsedDate = new Date(date); 
    if (isNaN(parsedDate.getTime())) { 
        throw new Error(`El valor ingresado (${date}) no es una fecha válida.`);
    }
}

module.exports = {
    isValidDate
}