//const Azure = require('azure');
const MsRest = require('ms-rest-azure');
const azconfig = require('./azconfig').loginConfig;
var parameters = require('./myHDInsightParameters');
var fs = require('fs');
var util = require('util');
var path = require('path');
var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
var StorageManagementClient = require('azure-arm-storage');
var ComputeManagementClient = require('azure-arm-compute');
var VirtualMachineSizes = require('azure-arm-compute').VirtualMachineSizes;

var storageservices = require('./services/storageServices');
var computeServives = require('./services/computeServices');
var resourceManagementServices = require('./services/resourceManagementServices');


//_________________CONFIG_______________________________________________
var clientId = azconfig.clientId;
var domain  = azconfig.domain;
var secret   = azconfig.secret;
var subscriptionId  = azconfig.subscriptionId;
var resourceGroupName = azconfig.resourceGroupName;
var res = azconfig.storageAccount ;
var deploymentName= 'saketClusterNodeApi';
//_________________CONFIG_______________________________________________


//________LOGIN SERVICE_________________________________________________
MsRest.loginWithServicePrincipalSecret(clientId, secret, domain, startExec );

function startExec(err, credentials){
    if(err) return console.error(err)

    storageClient = new StorageManagementClient(credentials, subscriptionId);
    resourceClient = new ResourceManagementClient(credentials, subscriptionId);
    computeClient = new ComputeManagementClient(credentials, subscriptionId);

    callservices();
}



//_______SERVICES TESTING___________________
function callservices(){
  computeServives.listVMSizes();
  computeServives.refreshVmSizesList(computeClient, 'eastus');
  
  storageservices.listStorageAccounts(storageClient, storageListCallback);

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