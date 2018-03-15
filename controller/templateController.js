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
var credentials;
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


function _validateAccountName(accountName, subsId ,callback){
    
    //validate subscriptionId 
    if (subsId === null || subsId === undefined || typeof subsId.valueOf() !== 'string') {
        throw new Error('subscriptionID cannot be null or undefined and it must be of type string.');
        }
    //check if storageClient already active or undefined
    if(storageClient === null || storageClient === undefined || storageClient.subscriptionId !== subsId){
        storageClient = new StorageManagementClient(credentials, subsId);
        console.log('\n\n\t I AM CREATING NEW STORAGE CLIENT' );
    }

    return storageservices.validateAccountName(storageClient,accountName,callback);
}

function _listStorageAccounts(subsId,callback){

    //validate subscriptionId 
    if (subsId === null || subsId === undefined || typeof subsId.valueOf() !== 'string') {
        throw new Error('subscriptionID cannot be null or undefined and it must be of type string.');
        }
    //check if storageClient already active or undefined
    if(storageClient === null || storageClient === undefined || storageClient.subscriptionId !== subsId){
        storageClient = new StorageManagementClient(credentials, subsId);
        console.log('\n\n\t I AM CREATING NEW STORAGE CLIENT' );
    }

    return storageservices.listStorageAccounts(storageClient, callback);
    
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


function _getLocationsList(subsId,callback){

    //validate subscriptionId 
    if (subsId === null || subsId === undefined || typeof subsId.valueOf() !== 'string') {
    throw new Error('subscriptionID cannot be null or undefined and it must be of type string.');
    }
 
    //check if resourceClient already active  
    if(subscriptionClient === null || subscriptionClient === undefined ){
        return callback('needs subscription id', null);
    }
    return subscriptionManagementServices.getsubscriptionLocationsList(subscriptionClient,subscriptionId, callback);
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
                //Task 1: Login and Client Setup
                console.log('Entered Task 1');
                MsRest.loginWithServicePrincipalSecret(clientId, secret, domain, function (err, cred) {
                    if (err) {
                        return callback(err);
                    }
                    process.env['CREDENTIALS'] = cred;
                    credentials = cred;
                    subscriptionClient = new SubscriptionManagementClient(credentials,baseURI ,callback);
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
            //This is a callback function of the series
            function(err, results){
                if(err){
                    console.error('\n\n\t' + err);
                }
                var details= {};
                details.resourceGroups = results.resGroup[0];
                details.locationsList = results.locList;
                res.send(details);
        });
    })

    app.post('/storage-account-list', urlencodedParser, function(req, res){
        console.log(req.body.name);
        locName = req.body.name;
        subscriptionId = req.body.subscriptionId;

        async.series({
                accounts: function(callback){
                    return _listStorageAccounts(subscriptionId, callback);
                }
            },
            //series callback function
            function(err, results){
                if(err){
                    console.error('\n\n\t' + err);
                }
                ///console.log('\n\n\t STORAGE ACCOUNT RESULT: ' + JSON.stringify(results.accounts,0,4));
                var storageAccounts = results.accounts;
                resStorageAccounts = [];
                for (var i=0;i<storageAccounts.length;i++){
                    if(storageAccounts[i].location == locName){
                        resStorageAccounts.push(storageAccounts[i])
                    }
                }
                res.send(resStorageAccounts);
            }
        );
    })

    app.post('/validate-acc-name', urlencodedParser, function(req, res){
        //console.log(req.body);
        var accName = req.body.name;
        var subscriptionId = req.body.subscriptionId;

        async.series({
                validity:function(callback){
                    return _validateAccountName(accName, subscriptionId,callback);
                }
            },
            function(err, results){
                if(err){
                    res.send('SOMETHING WENT WRONG!!!');
                }
                res.send(results.validity);
            }
        );
    });
    
    app.post('/deploy-template',urlencodedParser, function(req, res){
        console.log('\n\n\tList of Recieved form parameters' + JSON.stringify(req.body,0,4))
        formDetails = req.body;
        myparam = {};
        Object.keys(formDetails).forEach(function(key) {
            myparam[key] = {};
        });
        
        Object.keys(formDetails).forEach(function(key) {
            if(key === 'storageAccountName'){
                (formDetails['storageAccNewOrExisting'] == "existing") ?(myparam[key]['value'] = formDetails[key][0])  : (myparam[key]['value'] = formDetails[key]) 
            }
            else{
                myparam[key]['value'] = formDetails[key];
            }
        });

        myparam['workerNodeInstanceCount']['value'] = Number(myparam['workerNodeInstanceCount']['value']);

        var deploymentDetails = {};
        deploymentDetails.resourceGroupName = myparam.resourceGroupName.value;
        deploymentDetails.deploymentName = 'saketclusterdeploy' + Date.now();
        deploymentDetails.templateName = "clusterDeploy.json";
        delete myparam.resourceGroupName;
        delete myparam.subscriptionid;
        deploymentDetails.parameters = myparam;
        deploymentDetails.callback = function(err, result, request, response) {
            if (err) {
              console.error('\nERROR:' + err);
              res.send(err);
            }
            else{
                console.log('\n\n\t Deployment Result' + JSON.stringify(result,0,4));
                //fs.writeFileSync('results/HDDeployresult2.json', JSON.stringify(result, 0,4), 'utf-8');
                res.send(result);
            }
            
          };

          console.log('\n\n\nList Deployment Parameters' + JSON.stringify(deploymentDetails.parameters,0,4));

          resourceManagementServices.loadTemplateAndDeploy(resourceClient, deploymentDetails);

    });
};

