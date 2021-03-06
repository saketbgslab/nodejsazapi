//const Azure = require('azure');
const MsRest = require('ms-rest-azure');
const config = require('./azconfig');
var parameters = require('./myHDInsightParameters');
var fs = require('fs');
var util = require('util');
var path = require('path');
var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
var SubscriptionManagementClient = require('azure-arm-resource').SubscriptionClient;
var StorageManagementClient = require('azure-arm-storage');
var ComputeManagementClient = require('azure-arm-compute');
var HdinsighManagementClient = require('azure-arm-hdinsight');

//var VirtualMachineSizes = require('azure-arm-compute').VirtualMachineSizes;

var storageservices = require('./services/storageServices');
var computeServives = require('./services/computeServices');
var resourceManagementServices = require('./services/resourceManagementServices');
var subscriptionManagementServices = require('./services/subscriptionManagementServices');

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


//________LOGIN SERVICE_________________________________________________
MsRest.loginWithServicePrincipalSecret(clientId, secret, domain, startExec );

function startExec(err, credentials){
    if(err) return console.error(err)

    subscriptionClient = new SubscriptionManagementClient(credentials,baseURI ,callback);
    //subscriptionClient.subscriptions.list(callback);

    storageClient = new StorageManagementClient(credentials, subscriptionId);
    resourceClient = new ResourceManagementClient(credentials, subscriptionId);
    //resourceClient.resourceGroups.list(callback);
    computeClient = new ComputeManagementClient(credentials, subscriptionId);
    hdinsightClient = HdinsighManagementClient.createHDInsightManagementClient(credentials, baseURI);

   // console.log('\n\n\n\t\tCredentials' + JSON.stringify(credentials.tokenCache._entries,0,4));  
    //clssvar cre = credentials.tokenCache._entries;
    credentials.subscriptionId = subscriptionId;
    //hdinsightClient.clusters.list(callback);
    //hdinsightClient.clusters.listByResourceGroup(resourceGroupName,callback);
    hdinsightClient.clusters.get(resourceGroupName, 'saketcluster', callback)
   // callservices();
}


//_______SERVICES TESTIN
function callservices(){
 // computeServives.listVMSizes();
//  computeServives.refreshVmSizesList(computeClient, 'eastus');
  
  //storageservices.listStorageAccounts(storageClient, storageListCallback);
 // storageservices.validateAccountName(storageClient, 'saketsa');

//  subscriptionManagementServices.getsubscriptionLocationsList(subscriptionClient,subscriptionId)
//  subscriptionManagementServices.getsubscriptionList(subscriptionClient, subscriptionCallback);

  var deploymentDetails = {};
  deploymentDetails.resourceGroupName = resourceGroupName;
  deploymentDetails.deploymentName = deploymentName;
  deploymentDetails.callback = afterDeployment;
  deploymentDetails.templateName = "myHDInsight.json";
  deploymentDetails.parameters = parameters;

  resourceManagementServices.loadTemplateAndDeploy(resourceClient, deploymentDetails);
}

//_______SERVICES TESTING___________________





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

