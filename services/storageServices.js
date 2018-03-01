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
function listStorageAccounts(storageClient, callback){
    console.log('\n\tListimg storage accounts under subscription for you!');
    return storageClient.storageAccounts.list( function(err, result, request, response) {
        if (err) {
            return callback('\checkNameAvailability ERROR:' + err, null);
        }
        else{
            //console.log(result);
            return callback(err, result);
        }
    });
}

/*


*/
function validateAccountName(storageClient,accountName,callback){
    storageClient.storageAccounts.checkNameAvailability(accountName, function(err, result, request, response) {
        if (err) {
            return callback('services checkNameAvailability: ' + err, null);
        }
        else{
            console.log(result);
            //fs.writeFileSync('./results/nameAvailability.json', JSON.stringify(result, 0,4), 'utf-8');
            return callback(null, result);
        }
    });
}

module.exports.listStorageAccounts = listStorageAccounts;
module.exports.validateAccountName = validateAccountName;
