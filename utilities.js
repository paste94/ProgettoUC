const faIcons = require('font-awesome-icons');

faIcons.getList().then(icons => console.log(icons.length));
//=> 675

faIcons.getList().then(icons => console.log(icons[0]));
/*=>
{ name: 'Glass',
  id: 'glass',
  unicode: 'f000',
  created: 1,
  filter: [ 'martini', 'drink', 'bar', 'alcohol', 'liquor' ],
  categories: [ 'Web Application Icons' ]
}
*/

$( document ).ready(function() {

});

// Gestione del file una volta selezionato
$(document).ready(function(){
    $('input[type="file"]').change(function(e){
        var fileName = e.target.files[0].path;
        if(typeof require !== 'undefined') XLSX = require('xlsx');
        var workbook = XLSX.readFile(fileName, {cellDates:true, cellNF:false, cellText:false});
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        /* Convert all sheet to json object */
        var jsonString = XLSX.utils.sheet_to_json(worksheet, {dateNF:'YYYY-MM-DD'})

        alert(JSON.stringify(jsonString[0]))

        /* Crea header della tabella*/
        $('#header').append(
          $('<th>').text("Seleziona"),
          $('<th>').text("Cognome"),
          $('<th>').text("Nome"),
          $('<th>').text("Data di nascita"),
          $('<th>').text("Codice Fiscale")
        )
        /*
        for(key in jsonString[0]){
          if(key!='ID' && key != 'Codice' && key != 'IDSodalizio'){
            $('#header').append(
              $('<th>').text(key)
            )
          }
        }
        */


        /* Riempie tabella da json*/
        $.each(jsonString, function(i, item) {
            $('#tableOfPeople').append(
              $('<tr>').append(
                $('<td>').append('<input type="checkbox" /> <br>'),
                //$('<td scope="col">').text(item.Numero),
                $('<td scope="col">').text(item.Cognome),
                $('<td scope="col">').text(item.Nome),
                //$('<td scope="col">').text(item.Indirizzo),
                //$('<td scope="col">').text(item.CAP),
                //$('<td scope="col">').text(item.Data),
                //$('<td scope="col">').text(item.LuogoNascita),
                $('<td scope="col">').text(item.DataNascita.getUTCDate() + '/' + item.DataNascita.getUTCMonth() + '/' + item.DataNascita.getUTCFullYear()),
                $('<td scope="col">').text(item.CodFis),
                //$('<td scope="col">').text(item.Comune),
                //$('<td scope="col">').text(item.Sesso),
                //$('<td scope="col">').text(item.IDTipoTessera),
                //$('<td scope="col">').text(item.Telefono),
                //$('<td scope="col">').text(item.Cellulare),
                //$('<td scope="col">').text(item.email),
                //$('<td scope="col">').text(item.SiglaProvincia),
                //$('<td scope="col">').text(item.SettoreSportivo),
                //$('<td scope="col">').text(item.Qualifica),
                //$('<td scope="col">').text(item.Photo),
                //$('<td scope="col">').text(item.IDSport),
                //$('<td scope="col">').text(item.SottoQualifica),
                //$('<td scope="col">').text(item.LettereProtocollo),
                //$('<td scope="col">').text(item.NumeroProtocollo),
                //$('<td scope="col">').text(item.DataProtocollo),
                //$('<td scope="col">').text(item.DataRilascio),
                //$('<td scope="col">').text(item.CoperturaSanitaria),
                //$('<td scope="col">').text(item.Datascadenza)

              )
            )
        });

        //alert('The file "' + fileName +  '" has been selected.');
    });
});
