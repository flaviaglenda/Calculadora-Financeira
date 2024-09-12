/**
 * Diz se esta string é elemento de uma lista.
 * @param {string[]} list 
 * @returns {boolean}
 */
String.prototype.isIn = function isIn(list) {
    let isIn = false;
    list.forEach(element => {
        if (this == element) isIn = true;
    })
    return isIn;
}