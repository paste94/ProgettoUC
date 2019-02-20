$( document ).ready(function() {

});

// Gestione del file una volta selezionato
$(document).ready(function(){
    $('input[type="file"]').change(function(e){
        var fileName = e.target.files[0].path;
        if(typeof require !== 'undefined') XLSX = require('xlsx');
        var workbook = XLSX.readFile(fileName);
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        /* Find desired cell */
        var jsonString = XLSX.utils.sheet_to_json(worksheet)
        alert(JSON.stringify(jsonString))

        //alert('The file "' + fileName +  '" has been selected.');
    });
});
