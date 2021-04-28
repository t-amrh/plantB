module.exports.pwCheck = function pwCheck(pw){
    let capitals = typeof pw.match(/[A-Z]/g) != null ? pw.match(/[A-Z]/g) : 0;
    let minors =  typeof pw.match(/[a-z]/g) != null ? pw.match(/[a-z]/g) : 0;
    let numbers = typeof pw.match(/[0-9]/g) != null ? pw.match(/[0-9]/g) : 0;

    if (capitals < 2 || minors < 2 || numbers < 2)
        return false;
    return true;
};