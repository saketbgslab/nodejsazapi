var fs = require('fs');
var path = require('path');

/*

*/
function getsubscriptionLocationsList(subscriptionClient, subscriptionId, callback){
    console.log('\n\tFectching List of Locattions for subscription Id '+ subscriptionId );

    subscriptionClient.subscriptions.listLocations(subscriptionId, function (err, result, request, response) {
        if (err) {
          console.error('\n Error while Updating List of VM Sizes:  ' + err);
            return callback(err, null);
        }
        else{
            //fs.writeFileSync('./results/'+subscriptionId+'Locations.json', JSON.stringify(result, 0,4), 'utf-8');
            console.log('\n '+ subscriptionId+'Locations.json is now updated');
            return callback(null, result);
        }
      });
}

/*
*/
function getsubscriptionList(subscriptionClient, callback){
    console.log('getting subscriptions list' + subscriptionClient);

    subscriptionClient.subscriptions.list(callback);
}

 
module.exports.getsubscriptionLocationsList = getsubscriptionLocationsList;
module.exports.getsubscriptionList = getsubscriptionList;
