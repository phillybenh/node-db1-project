module.exports = {
    isValidPOST,
    isValidPUT,
    isValidQuery
}

function isValidPOST(account) {
    return Boolean(account.name && account.budget);
}

function isValidPUT(account) {
    return Boolean(account.name || account.budget);
}

function isValidQuery(query) {
    return Boolean(query.limit && query.sortby)
}