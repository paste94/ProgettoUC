//import 'node_modules/datatables.net-buttons/js/buttons.html5.js';
const faIcons = require('font-awesome-icons');
window.$ = window.jQuery = require("jquery")
//var dt = require( 'datatables.net' )();
// https://datatables.net/download/
var dt = require( 'datatables.net' )( window, $ );
require( 'jszip' );
require( 'datatables.net-bs4' )();
require( 'datatables.net-buttons-bs4' )();
require( 'datatables.net-buttons/js/buttons.html5.js' )();
require( 'datatables.net-select-bs4' )();


//var sel = require( 'datatables.net-select' )( );
//var bs4 = require( 'datatables.net-bs4' )( );
//var select = require( 'datatables.net-select-bs4' )( );
var popupS = require('popups');
//require( 'datatables.net-buttons-bs4' )( window, $ );
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
             { data: "Codice Fiscale" },
             { data: "Codice Fiscale Società"}
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
    var jsonObj = [];
    table.rows('.selected').every(function(rowIdx, tableLoop, rowLoop){
      jsonObj.push(this.data()); // Stringa json che rappresenta la riga
    })
    if(jsonObj.length > 0){
      if(typeof require !== 'undefined') XLSX = require('xlsx');

      var ws = XLSX.utils.json_to_sheet(jsonObj);

      /* add to workbook */
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "People");
      //TODO: Scegli il path in cui salvare il file
      XLSX.writeFile(wb, "Partecipanti.xlsx");
      //alert(data);

      //saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "sheetjs.xlsx");

    }else {
      alert('Attenzione, selezionare almeno una riga prima di proseguire!')
    }

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
        var societyCF;
        popupS.prompt({
            content:     'Inserire il codice fiscale della società',
            onSubmit: function(val) {
                if(val) {
                    societyCF = val;
                    //alert(societyCF)
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
                      if(item.DataNascita != null
                         && item.Cognome != null
                         && item.Nome != null
                         && item.DataNascita != null){ // Necessario per via di un errore che blocca tutta la funzione
                        table.row.add({
                          'Cognome':          item.Cognome,
                          'Nome':             item.Nome,
                          'Data di Nascita':  item.DataNascita.getDate() + '/' + (item.DataNascita.getMonth() + 1) + '/' + item.DataNascita.getUTCFullYear(),
                          'Codice Fiscale':   item.CodFis,
                          'Codice Fiscale Società': societyCF
                        }).draw( false );
                      }
                      /*
                      else{
                        alert('Attenzione: Ad una o più righe manca la data di nascita!')
                      }
                      */
                    });
                } else {
                    popupS.alert({
                        content: 'Inserire qualcosa! :('
                    });
                }
                $('#download-file').prop('disabled', false);
            }
        });
    });
});
