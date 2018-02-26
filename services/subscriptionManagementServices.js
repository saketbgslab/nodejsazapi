var fs = require('fs');
var path = require('path');

/*

*/
function getsubscriptionLocationsList(subscriptionClient, subscriptionId){
    console.log('\n\tFectching List of Locattions for subscription Id '+ subscriptionId );

    subscriptionClient.subscriptions.listLocations(subscriptionId, function (err, result, request, response) {
        if (err) {
          return console.error('\n Error while Updating List of VM Sizes:  ' + err);
        }
        else{
            console.log('\n Fetched List of VM Sizes!');
            console.log('\n\n\t LGSDGDSGEDSHDSHEHEWEWHEWHHH: ' + result.length)
            //fs.writeFileSync('./results/'+subscriptionId+'Locations.json', JSON.stringify(result, 0,4), 'utf-8');
            console.log('\n '+ subscriptionId+'Locations.json is now updated')
        }
       // callback(null, result);
      });
}

/*
*/
function getsubscriptionList(subscriptionClient, callback){
    console.log('getting subscriptions list');

    subscriptionClient.subscriptions.list(callback);
}

 
module.exports.getsubscriptionLocationsList = getsubscriptionLocationsList;
module.exports.getsubscriptionList = getsubscriptionList;
