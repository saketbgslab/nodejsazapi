
/*
    list of storage accounts in the subscription
    contorller.listStorageAccounts(storageClient, function (err, result, request, response) {
        if (err) {
          return controllercallback(err);
        }
        console.log('\n' + util.inspect(result, { depth: null }));
        controllercallback(null, result);
});)
*/
function listStorageAccounts(storageClient, functionCallback){
    console.log('\n\tList storage accounts under subscription for you!');
    return storageClient.storageAccounts.list(functionCallback);
}

module.exports.listStorageAccounts = listStorageAccounts;