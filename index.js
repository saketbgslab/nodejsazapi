//const Azure = require('azure');
const MsRest = require('ms-rest-azure');
const azconfig = require('./azconfig').loginConfig;
var fs = require('fs');
var util = require('util');
var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
var StorageManagementClient = require('azure-arm-storage');

//_________________CONFIG_______________________________________________
var clientId = azconfig.clientId;
var domain  = azconfig.domain;
var secret   = azconfig.secret;
var subscriptionId  = azconfig.subscriptionId;
var resourceGroupName = azconfig.resourceGroupName;
var res = azconfig.storageAccount ;
//_________________CONFIG_______________________________________________


//________LOGIN SERVICE_________________________________________________
MsRest.loginWithServicePrincipalSecret(clientId, secret, domain, setUpStorageClient );


//_________set up storage client and controller_________________________
function setUpStorageClient(err, credentials){
    if (err) return console.log(err);

    storageClient = new StorageManagementClient(credentials, subscriptionId);
    //getStorageAccountsLists();
    //getStorageKeyList();
    createStorageAccount();
    //getStorageKeyList();
}

//__________GET LIST OF STORAGE ACCOUNTS IN SUBSTRIPTION________________
function getStorageAccountsLists(){
    storageClient.storageAccounts.list(function (err, result, request, response) {
        if (err) {
          console.error('\nERROR:' + err);
        }
        else{
            console.log(result);
            fs.writeFileSync('./result.json', JSON.stringify(result, 0,4), 'utf-8');
        }
       // callback(null, result);
      });    
}

//__________GET LIST OF STORAGE ACCOUNT KEYS IN SUBSTRIPTION_____________
function getStorageKeyList(){
    storageClient.storageAccounts.listKeys(resourceGroupName, 'saketsa', function (err, result, request, response) {
        if (err) {
          console.error('\nERROR:' + err);
        }
        else{
           // fs.writeFileSync('./result.json', util.inspect(result) , 'utf-8');
           console.log('\n\n KEY RRESULT:  ' + JSON.stringify(result, 0,4));
           //fs.writeFileSync('./key.json', JSON.stringify(result, 0,4), 'utf-8' );
        }
       // callback(null, result);
      }); 
}

function createStorageAccount() {
    var createParameters = {
        location: "eastUs",
        sku: {
            name: "Standard_LRS",
        },
        properties: {
            supportsHttpsTrafficOnly: false,
            encryption: {
                services: {
                    blob: {
                        enabled: true
                    },
                    file: {
                        enabled: true
                    }
                },
                keySource: "Microsoft.Storage",
            }
        },
        accessTier:"Cool",
        kind: "StorageV2"
    };
    storageClient.storageAccounts.create(resourceGroupName, 'saket5', createParameters, function (err, result, request, response) {
        if (err) return console.error(err);

        console.log('\nThe created storage account result is: \n' + util.inspect(result, { depth: null }));
    });
}
  