var fs = require('fs');
var path = require('path');

/*
  list of VMsizes from local file
    contorller.listVMSizes(fs, path)

*/
function listVMSizes(){
    try{
        var vmSizeFilePath = path.join(__dirname, "../listOfVmSizes.json");
        var listOfVmSizes = JSON.parse(fs.readFileSync(vmSizeFilePath, 'utf8'));
        console.log(listOfVmSizes[0].name)
    } catch (ex) {
       return  console.error('\n\t List of VM sizes file read error: ' + err);
    }
    //console.log("\n\n\t VM LIST:  " + JSON.stringify(listOfVmSizes, 0,4) );
    //return listOfVmSizes;
    
}


/*
    refresh the local listOfVmSizes.json file with by calling computeVMSizes api

    controller.refreshVmSizesList(computeClient, resourceGroup.location)
*/
function refreshVmSizesList(computeClient, location){
    console.log('\n\tUpdating List of VM Sizes for '+ location +' for you!');
    computeClient.virtualMachineSizes.list(location, function (err, result, request, response) {
        if (err) {
          return console.error('\n Error while Updating List of VM Sizes:  ' + err);
        }
        else{
            console.log('\n Fetched List of VM Sizes!');
            fs.writeFileSync('./results/listOfVmSizes.json', JSON.stringify(result, 0,4), 'utf-8');
            console.log('\n listOfVmSizes.json is now updated')
        }
       // callback(null, result);
      });
}
 
module.exports.refreshVmSizesList = refreshVmSizesList;
module.exports.listVMSizes = listVMSizes;