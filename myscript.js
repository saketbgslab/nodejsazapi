
$(document).ready(function(){
    $("#storageAccounts").hide();


     $("#locationSelect").click(function(){
          //------------AJAX CALL FOR STORAGE ACCOUNTS----------------
        locName = $("#locationSelect").val();
        console.log('selected location from drop down:  ' + locName);
        var locations = {};
        locations.name = locName;

        storageAccounts = $.ajax({
        type: 'POST',
        url: '/storage-account-list',
        dataType: 'json',
        data: locations,
        success: function(result) {
            console.log(result);
            //fill storage account list
            var option = '';
            for (var i=0;i<result.length;i++){
            option += '<option value="'+ result[i].id + '">' + result[i].name + '</option>';
            }
            $("#storageAccountsSelect").empty();
            $("#storageAccountsSelect").append(option);    
        }
      }).responseJSON;
      return false;
    //-----AJAX CALL FOR STORAGE ACCOUNTS------
     
    });

    $("#subscriptionsSelect").click(function(){

        subscriptionId = $("#subscriptionsSelect").val();
        console.log('selected subscription id from drop down:  ' + subscriptionId);
        var subscription = {};
        subscription.subscriptionId = subscriptionId;


        resourceGroups = $.ajax({
        type: 'POST',
        url: '/resource-groups-list',
        dataType: 'json',
        data: subscription,
        success: function(result) {
            console.log(result);
           
            //fill resource groups list
            var option = '';
            for (var i=0;i<result.resourceGroups.length;i++){
            option += '<option value="'+ result.resourceGroups[i].name + '">' + result.resourceGroups[i].name + '</option>';
            }
            $("#resourceGroupsSelect").empty();
            $("#resourceGroupsSelect").append(option);

            //fill Locations list
            option = '';
            for (var i=0;i<result.locationsList.length;i++){
            option += '<option value="'+ result.locationsList[i].name + '">' + result.locationsList[i].displayName + '</option>';
            }
            $("#locationSelect").empty();
            $("#locationSelect").append(option);            
        }
      }).responseJSON;
      return false;
    });


    $("#existSaRadio").on('change', function(e){ 
        $("#storageAccountType").hide();
        $("#storageAccountkind").hide();
        $("#storageAccountName").hide();
        $("#storageAccounts").show();
    });

    $("#newSaRadio").click(function(){
        $("#storageAccountType").show();
        $("#storageAccountkind").show();
        $("#storageAccountName").show();
        $("#storageAccounts").hide();
    });
});
