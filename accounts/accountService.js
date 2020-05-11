module.exports = {
    isValidPOST,
    isValidPUT
}

function isValidPOST(account) {
    return Boolean(account.name && account.budget);
}

function isValidPUT(account) {
    return Boolean(account.name || account.budget);
}