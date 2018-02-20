var fs = require('fs');
var path = require('path');
var util = require('util')

/*
    Function to deploy template
*/
function loadTemplateAndDeploy(resourceClient, deploymentDetails){
    try {
        templateName = "../templates/" + deploymentDetails.templateName;
        var templateFilePath = path.join(__dirname, templateName);
        var template = JSON.parse(fs.readFileSync(templateFilePath, 'utf8'));
      } catch (ex) {
        //return callback(ex);
        return console.error('\n\t Template file read Error: \t' + ex);
    }

    console.log('\nLoaded template from template.json');

    var deploymentParameters = {
      "properties": {
        "parameters": deploymentDetails.parameters,
        "template": template,
        "mode": "Incremental"
      }
    };

    var deploymentName = deploymentDetails.deploymentName;
    var resourceGroupName = deploymentDetails.resourceGroupName;

    console.log(util.format('\nDeploying template %s : \n%s', deploymentName , util.inspect(template, { depth: null })));

    resourceClient.deployments.createOrUpdate(resourceGroupName, 
                                                deploymentName, 
                                                deploymentParameters, 
                                                deploymentDetails.callback);
}

module.exports.loadTemplateAndDeploy = loadTemplateAndDeploy;