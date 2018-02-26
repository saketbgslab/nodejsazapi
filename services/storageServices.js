var fs = require('fs');
var path = require('path');
var util = require('util')

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

/*


*/
function validateAccountName(storageClient,accountName){
storageClient.storageAccounts.checkNameAvailability(accountName, function(err, result, request, response) {
            if (err) {
            console.error('\checkNameAvailability ERROR:' + err);
            }
            else{
                console.log(result);
                fs.writeFileSync('./results/nameAvailability.json', JSON.stringify(result, 0,4), 'utf-8');
            }
        });
}

module.exports.listStorageAccounts = listStorageAccounts;
module.exports.validateAccountName = validateAccountName;
