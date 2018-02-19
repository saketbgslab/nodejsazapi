import { request } from 'https';

//const Azure = require('azure');
const MsRest = require('ms-rest-azure');
const azconfig = require('./azconfig').loginConfig;
var parameters = require('./templates/myHDInsightParameters').parameters;
var fs = require('fs');
var util = require('util');
var path = require('path');
var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
var StorageManagementClient = require('azure-arm-storage');

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

    loadTemplateAndDeploy();
}

function loadTemplateAndDeploy(){
    try {
        var templateFilePath = path.join(__dirname, "templates/myHDInsight.json");
        var template = JSON.parse(fs.readFileSync(templateFilePath, 'utf8'));

    //    var parametersFilePath = path.join(__dirname, "templates/myHDInsightParameters.json");
    //    var parameters = JSON.parse(fs.readFileSync(parametersFilePath, 'utf8'));
      } catch (ex) {
        //return callback(ex);
        return console.error(ex);
    }

    console.log('\nLoaded template from template.json');

    var deploymentParameters = {
      "properties": {
        "parameters": parameters,
        "template": template,
        "mode": "Incremental"
      }
    };

    console.log(util.format('\nDeploying template %s : \n%s', deploymentName , util.inspect(template, { depth: null })));

    resourceClient.deployments.createOrUpdate(resourceGroupName, 
                                                deploymentName, 
                                                deploymentParameters, 
                                                afterDeployment);
}

function afterDeployment(err, result, request, response) {
    if (err) {
      console.error('\nERROR:' + err);
    }
    else{
        console.log(result);
        fs.writeFileSync('./HDDeplouresult.json', JSON.stringify(result, 0,4), 'utf-8');
    }
   // callback(null, result);
  }