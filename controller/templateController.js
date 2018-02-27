var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })



module.exports.templateController = function (app){
    

    app.get('/templateForm', urlencodedParser, function(req, res){

        //read template file
        try {
            templateName = "../templates/clusterDeploy.json"
            var templateFilePath = path.join(__dirname, templateName);
            var template = JSON.parse(fs.readFileSync(templateFilePath, 'utf8'));
          } catch (ex) {
            //return callback(ex);
            return console.error('\n\t Template file read Error: \t' + ex);
        }
    
        //get parameters
        parameters = template.parameters ;

        //make subscription call
        parameters.subscriptions = [ {
                "id": "/subscriptions/7c326b71-55e3-4ca7-8372-8227e1354e4c",
                "subscriptionId": "7c326b71-55e3-4ca7-8372-8227e1354e4c",
                "displayName": "Pay-As-You-Go",
                "state": "Enabled",
                "subscriptionPolicies": {
                    "locationPlacementId": "PublicAndIndia_2015-09-01",
                    "quotaId": "PayAsYouGo_2014-09-01",
                    "spendingLimit": "Off"
                },
                "authorizationSource": "RoleBased"
            },

            {
                "id": "/subscriptions/7c326b71-55e3-4ca7-8372-8227e135qwerty",
                "subscriptionId": "7c326b71-55e3-4ca7-8372-8227e135qwerty",
                "displayName": "Dont-Pay-As-You-Go",
                "state": "Enabled",
                "subscriptionPolicies": {
                    "locationPlacementId": "PublicAndIndia_2015-09-01",
                    "quotaId": "PayAsYouGo_2014-09-01",
                    "spendingLimit": "Off"
                },
                "authorizationSource": "RoleBased"
            }
        ];


        parameters.resourceGroups = [{}];

        //make vmSizesCall
        parameters.vmSizeList =  [
            {
                "name": "Standard_B1ms",
                "numberOfCores": 1,
                "osDiskSizeInMB": 1047552,
                "resourceDiskSizeInMB": 4096,
                "memoryInMB": 2048,
                "maxDataDiskCount": 2
            },
            {
                "name": "Standard_B1s",
                "numberOfCores": 1,
                "osDiskSizeInMB": 1047552,
                "resourceDiskSizeInMB": 2048,
                "memoryInMB": 1024,
                "maxDataDiskCount": 2
            },
            {
                "name": "Standard_B2ms",
                "numberOfCores": 2,
                "osDiskSizeInMB": 1047552,
                "resourceDiskSizeInMB": 16384,
                "memoryInMB": 8192,
                "maxDataDiskCount": 4
            }];

        //render
        res.render('advanceForm', { topicHead : 'TemplateForm', parameters: parameters });
    });

    app.post('/resource-groups-list', urlencodedParser, function(req, res){
        console.log(req.body.subscriptionId);

        subscriptionId = req.body.subscriptionId;

        //make resourceManagementServices call for resource group list

        //make subscriptionManagementService call for Locations List

        //after getting resourceGroups and locations JSON
        var details = {};
        details.resourceGroups = [ 
            {   id: '/subscriptions/7c326b71-55e3-4ca7-8372-8227e1354e4c/resourceGroups/IBM-GSL-Broker-Project',
                name: 'IBM-GSL-Broker-Project',
                properties: { provisioningState: 'Succeeded' },
                location: 'eastus',
                tags: {} 
            } ];

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

        res.send(details);
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

