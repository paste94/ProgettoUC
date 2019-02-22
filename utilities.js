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

        /* Crea header della tabella*/
        $('#header').append(
          $('<th>').text("Seleziona")
        )
        for(key in jsonString[0]){
          $('#header').append(
            $('<th>').text(key)
          )
        }

        /* Riempie tabella da json*/
        $.each(jsonString, function(i, item) {
            $('#tableOfPeople').append(
              $('<tr>').append(
                $('<td>').append('<input type="checkbox" /> <br>'),
                $('<td scope="col">').text(item.Nome),
                $('<td scope="col">').text(item.Cognome),
                $('<td scope="col">').text(item.cf)
              )
            )
        });

        //alert('The file "' + fileName +  '" has been selected.');
    });
});
