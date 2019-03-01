const faIcons = require('font-awesome-icons');
window.$ = window.jQuery = require("jquery")
var dt = require( 'datatables.net' )();
var bs4 = require( 'datatables.net-bs4' )( );

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

$(document).ready(function(){
  $('#download-file').click(function(){
    if(typeof require !== 'undefined') XLSX = require('xlsx');
    //TODO: Genera il file json dalla tabella

    /*
    var data = [
      {"name":"John", "city": "Seattle"},
      {"name":"Mike", "city": "Los Angeles"},
      {"name":"Zach", "city": "New York"}
    ];
    */
    /* make the worksheet */
    var ws = XLSX.utils.json_to_sheet(data);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    //TODO: Scegli il path in cui salvare il file
    XLSX.writeFile(wb, "sheetjs.xlsx");
    //alert(data);

    //saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "sheetjs.xlsx");

  });
});

// Order table
$(document).ready(function () {
  //TODO: Cambia l'ordine dei record della tabella
  //  $('#tableOfPeople').DataTable();
  //  $('.dataTables_length').addClass('bs-select');
});

// Gestione del file una volta selezionato
$(document).ready(function(){
    $('input[type="file"]').change(function(e){
        $('#hint').remove();
        var fileName = e.target.files[0].path;
        if(typeof require !== 'undefined') XLSX = require('xlsx');
        var workbook = XLSX.readFile(fileName, {cellDates:true, cellNF:false, cellText:false});
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        /* Convert all sheet to json object */
        var jsonString = XLSX.utils.sheet_to_json(worksheet, {dateNF:'YYYY-MM-DD'})

        /* Riempi tabella */
        var table = $('#tableOfPeople').DataTable();
        var counter = 1;
        $.each(jsonString, function(i, item){
          if(item.DataNascita != null){
            table.row.add([
              'ciao',
              item.Cognome,
              item.Nome,
              item.DataNascita.getDate() + '/' + (item.DataNascita.getMonth() + 1) + '/' + item.DataNascita.getUTCFullYear(),
              item.CodFis

            ]).draw( false );
          }
          else{
            alert('Attenzione: Ad una o più righe manca la data di nascita!')
          }
        });


        /* Riempie tabella da json*/
        /*
        $.each(jsonString, function(i, item) {
            $('#tableOfPeople').append(
              $('<tbody>').append(
                $('<td>').append('<input type="checkbox" /> <br>'),
                //$('<td scope="col">').text(item.Numero),
                $('<td scope="col">').text(item.Cognome),
                $('<td scope="col">').text(item.Nome),
                //$('<td scope="col">').text(item.Indirizzo),
                //$('<td scope="col">').text(item.CAP),
                //$('<td scope="col">').text(item.Data),
                //$('<td scope="col">').text(item.LuogoNascita),
                $('<td scope="col">').text(item.DataNascita.getDate() + '/' + (item.DataNascita.getMonth() + 1) + '/' + item.DataNascita.getUTCFullYear()),
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
        */
    });
});
