const faIcons = require('font-awesome-icons');
window.$ = window.jQuery = require("jquery")
var dt = require( 'datatables.net' )();
var sel = require( 'datatables.net-select' )( );
var bs4 = require( 'datatables.net-bs4' )( );
var select = require( 'datatables.net-select-bs4' )( );
var table; // Utilizzata per datatables
faIcons.getList().then(icons => console.log(icons.length));
faIcons.getList().then(icons => console.log(icons[0]));

/* Assegna alla tabella la proprietà di datatables */
$(document).ready(function(){
  table = $('#tableOfPeople').DataTable({
     columns: [
             { data: "Cognome" },
             { data: "Nome" },
             { data: "Data di Nascita" },
             { data: "Codice Fiscale" }

         ]
   }) // Fine DataTable
}) // Fine function

/*  */
$( document ).ready(function() {
  $('#button').click( function () {
      alert( table.rows('.selected').data().length +' row(s) selected' );
  } );
});

/* Salva il file con i corridori selezionati */
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



/* Definisce la selezione di un corridore sulla tabella */
/* Imposta 'selected' alla riga */
$(document).ready(function () {
  $('#tableOfPeople tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );
});

/* Gestione del file una volta selezionato */
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
        $.each(jsonString, function(i, item){
          if(item.DataNascita != null){ // Necessario per via di un errore che blocca tutta la funzione
            table.row.add({
              'Cognome':          item.Cognome,
              'Nome':             item.Nome,
              'Data di Nascita':  item.DataNascita.getDate() + '/' + (item.DataNascita.getMonth() + 1) + '/' + item.DataNascita.getUTCFullYear(),
              'Codice Fiscale':   item.CodFis
            }).draw( false );
          }
          else{
            alert('Attenzione: Ad una o più righe manca la data di nascita!')
          }
        });
    });
});
