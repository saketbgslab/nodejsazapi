var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//--------------------------------------------------------------------
const MsRest = require('ms-rest-azure');
const config = require('../azconfig');
var async = require('async');
var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
var SubscriptionManagementClient = require('azure-arm-resource').SubscriptionClient;
var StorageManagementClient = require('azure-arm-storage');
var ComputeManagementClient = require('azure-arm-compute');
var HdinsighManagementClient = require('azure-arm-hdinsight');


var storageservices = require('../services/storageServices');
var computeServives = require('../services/computeServices');
var resourceManagementServices = require('../services/resourceManagementServices');
var subscriptionManagementServices = require('../services/subscriptionManagementServices');


//--------------------------------------------------------------------


//_________________CONFIG_______________________________________________
var clientId = config.loginConfig.clientId;
var domain  = config.loginConfig.domain;
var secret   = config.loginConfig.secret;
var subscriptionId  = config.loginConfig.subscriptionId;
var resourceGroupName = config.loginConfig.resourceGroupName;
var res = config.loginConfig.storageAccount ;
var deploymentName= 'saketClusterNodeApi';
var baseURI = config.baseURI;
//_________________CONFIG_______________________________________________

//--------------------CLIENTS--------------------------------------------
var subscriptionClient;
var storageClient;
var resourceClient;
var computeClient;
var hdinsightClient;
var credentials
//--------------------CLIENTS--------------------------------------------


//-------------FUNCTIONS--------------------------------------------
function startExec(err, credentials){
    if(err) return console.error(err)

    console.log(credentials);
    subscriptionClient = new SubscriptionManagementClient(credentials,baseURI ,callback);
    storageClient = new StorageManagementClient(credentials, subscriptionId);
    resourceClient = new ResourceManagementClient(credentials, subscriptionId);
    computeClient = new ComputeManagementClient(credentials, subscriptionId);
    hdinsightClient = HdinsighManagementClient.createHDInsightManagementClient(credentials, baseURI);

   //console.log('\n\n\n\t\tCredentials' + JSON.stringify(credentials.tokenCache._entries,0,4));  
    //clssvar cre = credentials.tokenCache._entries;
    //credentials.subscriptionId = subscriptionId;
    //hdinsightClient.clusters.list(callback);
    //hdinsightClient.clusters.listByResourceGroup(resourceGroupName,callback);
    //hdinsightClient.clusters.get(resourceGroupName, 'saketcluster', callback)
   // callservices();
}

function _getResourceGroupList(subsId,callback){
    //validate subscriptionId 
    if (subsId === null || subsId === undefined || typeof subsId.valueOf() !== 'string') {
        throw new Error('subscriptionID cannot be null or undefined and it must be of type string.');
      }
      
    //check if resourceClient already active  
    if(resourceClient === null || resourceClient === undefined || resourceClient.subscriptionId !== subsId){
        resourceClient = new ResourceManagementClient(credentials, subsId);
        console.log('\n\n\t I AM CREATING NEW RES CLIENT' );
    }

    resourceClient.resourceGroups.list(callback);

}

function _getsubscriptionList(callback){
    subscriptionManagementServices.getsubscriptionList(subscriptionClient, callback);
}

//------------------------CALL BACKS---------------------------------------
function storageListCallback(err, result, request, response) {
    if (err) {
      console.error('\nERROR:' + err);
    }
    else{
        console.log(result);
        fs.writeFileSync('./listStorageAccounts.json', JSON.stringify(result, 0,4), 'utf-8');
      }
  }
  
  function afterDeployment(err, result, request, response) {
      if (err) {
        console.error('\nERROR:' + err);
      }
      else{
          console.log(result);
          fs.writeFileSync('./HDDeployresult2.json', JSON.stringify(result, 0,4), 'utf-8');
      }
    }
  
  function subscriptionCallback(err, result,request, response){
    if (err) {
      console.error('\nSubscription Callback ERROR:' + err);
    }
    else{
        console.log(result);
        fs.writeFileSync('./results/listOfSubscriptions.json', JSON.stringify(result, 0,4), 'utf-8');
      }
  }
  
  function callback(err, result, request, response) {
    if (err) {
      console.error('\nERROR:' + err);
    }
    else{
        console.log(result);
        fs.writeFileSync('./results/clusterNameCheck.json', JSON.stringify(result, 0,4), 'utf-8');
      }
  }
  
//------------------------CALL BACKS  ENDS---------------------------------------
  


//----------------------APP CONTROLLER FUNCTIONS----------------------------------
module.exports.templateController = function (app){
    
    app.get('/templateForm', urlencodedParser, function(req, res){

        async.series([
            function (callback) {
                //Task 1: Login and Clien Setup
                console.log('Entered Task 1');
                MsRest.loginWithServicePrincipalSecret(clientId, secret, domain, function (err, cred) {
                    if (err) {
                        return callback(err);
                    }
                    credentials = cred;
                    subscriptionClient = new SubscriptionManagementClient(credentials,baseURI ,callback);
                    //storageClient = new StorageManagementClient(credentials, subscriptionId);
                    //resourceClient = new ResourceManagementClient(credentials, subscriptionId);
                    //computeClient = new ComputeManagementClient(credentials, subscriptionId);
                    hdinsightClient = HdinsighManagementClient.createHDInsightManagementClient(credentials, baseURI);
                    console.log('Exiting Task 1');
                    callback(null, 'one')
                });
            },  
            function (callback) {
                //Task 2: Read Template and set parameters
                console.log('Entered Task 2');
                try {
                    templateName = "../templates/clusterDeploy.json"
                    var templateFilePath = path.join(__dirname, templateName);
                    var template = JSON.parse(fs.readFileSync(templateFilePath, 'utf8'));
                } catch (ex) {
                    //return callback(ex);
                    return callback(ex,null);
                }
                //get parameters
                parameters = template.parameters ;
                //make subscription list call
                console.log('Exiting Task 2 after callback');
                return _getsubscriptionList(callback);
            }, 
            function (callback){
                //Task 3: read VMSizesList file
                console.log('Entered Task 3');
                try {
                    var vmSizeListFile = "../results/listOfVmSizes.json"
                    var vmSizeListFilePath = path.join(__dirname, vmSizeListFile);
                    parameters.vmSizeList = JSON.parse(fs.readFileSync(vmSizeListFilePath, 'utf8'));

                } catch (ex) {
                    return callback(ex, null);
                }
                parameters.resourceGroups = [{}];
                console.log('Exiting Task 3');
                return callback(null, 'three')
          }
        ], 
        // Once above operations finish, render and exit.
        function (err, results) {
          if (err) {
                console.error('\n\t series final callback error' + err);
                res.send('Alert: "Something went wrong" ');
            }
            console.log('\n###### template series Exit ######\n')
            parameters.subscriptions = results[1][0];
            res.render('advanceForm', { topicHead : 'TemplateForm', parameters: parameters });   
      });
    });

    app.post('/resource-groups-list', urlencodedParser, function(req, res){
        console.log(req.body.subscriptionId);

        subscriptionId = req.body.subscriptionId;

        async.series({
            //Task1: get list of resource groups
            resGroup: function(callback){
                return _getResourceGroupList(subscriptionId,callback);
            },

            //Task2: get list of locations 
            locList: function(callback){
                return _getLocationsList(subscriptionId,callback);
            } 
        },
            function(err, results){
                if(err){
                    console.error('\n\n\t' + err);
                }
            //    console.log('\n\n\t Resource GROUP res: '+ JSON.stringify(results,0,4));
             //   console.log('\n\n\t RESOURCE GROUP : ' + JSON.stringify(results.resGroup[0],0,4) );
                var details= {};
                details.resourceGroups = results.resGroup[0];
                details.locationsList = [];
                res.send(details);

        });
        //make resourceManagementServices call for resource group list

        //make subscriptionManagementService call for Locations List

        //after getting resourceGroups and locations JSON
     /*   var details = {};
        details.locationsList = [
            {
                "id": "/subscriptions/7c326b71-55e3-4ca7-8372-8227e1354e4c/locations/eastus",
                "name": "eastus",
                "displayName": "East US",
                "latitude": "37.3719",
                "longitude": "-79.8164"
            },
            {
                "id": "/subscriptions/7c326b71-55e3-4ca7-8372-8227e1354e4c/locations/southeastasia",
                "name": "southeastasia",
                "displayName": "Southeast Asia",
                "latitude": "1.283",
                "longitude": "103.833"
            },
            {
                "id": "/subscriptions/7c326b71-55e3-4ca7-8372-8227e1354e4c/locations/centralus",
                "name": "centralus",
                "displayName": "Central US",
                "latitude": "41.5908",
                "longitude": "-93.6208"
            },{
                "id": "/subscriptions/7c326b71-55e3-4ca7-8372-8227e1354e4c/locations/eastasia",
                "name": "eastasia",
                "displayName": "East Asia",
                "latitude": "22.267",
                "longitude": "114.188"
            }
             ] ;

      */  
    })



    app.post('/storage-account-list', urlencodedParser, function(req, res){
        console.log(req.body.name);
        locName = req.body.name;

//        subscriptionId = req.body.subscriptionId;

        //make resourceManagementServices call for resource group list

        //make subscriptionManagementService call for Locations List

        //after getting resourceGroups and locations JSON
        var storageAccounts = [
            {
                "id": "/subscriptions/7c326b71-55e3-4ca7-8372-8227e1354e4c/resourceGroups/IBM-GSL-Broker-Project/providers/Microsoft.Storage/storageAccounts/saketsa",
                "name": "saketsa",
                "type": "Microsoft.Storage/storageAccounts",
                "location": "eastus",
                "tags": {},
                "sku": {
                    "name": "Standard_LRS",
                    "tier": "Standard"
                },
                "kind": "StorageV2",
                "provisioningState": "Succeeded",
                "primaryEndpoints": {
                    "blob": "https://saketsa.blob.core.windows.net/",
                    "queue": "https://saketsa.queue.core.windows.net/",
                    "table": "https://saketsa.table.core.windows.net/",
                    "file": "https://saketsa.file.core.windows.net/"
                },
                "primaryLocation": "eastus",
                "statusOfPrimary": "available",
                "creationTime": "2018-02-16T17:17:48.945Z",
                "encryption": {
                    "services": {
                        "blob": {
                            "enabled": true,
                            "lastEnabledTime": "2018-02-16T17:17:49.070Z"
                        },
                        "file": {
                            "enabled": true,
                            "lastEnabledTime": "2018-02-16T17:17:49.070Z"
                        }
                    },
                    "keySource": "Microsoft.Storage"
                },
                "accessTier": "Cool",
                "enableHttpsTrafficOnly": false,
                "networkRuleSet": {
                    "bypass": "AzureServices",
                    "virtualNetworkRules": [],
                    "ipRules": [],
                    "defaultAction": "Allow"
                }
            }
        ];

        resStorageAccounts = [];
        for (var i=0;i<storageAccounts.length;i++){
            if(storageAccounts[i].location == locName){
                resStorageAccounts.push(storageAccounts[i])
            }
        }
        res.send(resStorageAccounts);
    })

    app.post('/deploy-template',urlencodedParser, function(req, res){
        console.log(req.body)
        res.send('I got you bro!!');
    });

    app.post('/validate-acc-name', urlencodedParser, function(req, res){
        console.log(req.body);
        res1 = { 
            nameAvailable: false,
            reason: 'AlreadyExists',
            message: 'The storage account named saketsa is already taken.'
        };
        res2 = { nameAvailable: true};
        if(req.body.name == 'saketsa')
        { 
            res.send(res1); 
        } else{
            res.send(res2);
        }
    });
};

