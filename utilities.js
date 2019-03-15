window.$ = window.jQuery = require("jquery")
// https://datatables.net/download/
var dt = require( 'datatables.net' )( window, $ );
require( 'jszip' );
require( 'datatables.net-bs4' )();
require( 'datatables.net-buttons-bs4' )();
require( 'datatables.net-buttons/js/buttons.html5.js' )();
require( 'datatables.net-select-bs4' )();
const fs = require("fs");
const {dialog} = require("electron").remote;
var popupS = require('popups');
var table; // Utilizzata per datatables

/* Assegna alla tabella la proprietà di datatables */
$(document).ready(function(){
  table = $('#tableOfPeople').DataTable({
     lengthMenu: [[10,50,100,500,-1], [10,50,100,500,'All']],
     columns: [
             { data: "Pettorale", title: "Pettorale"},
             { data: "Cognome", title: "Cognome" },
             { data: "Nome", title: "Nome" },
             { data: "Sesso", title: "Sesso" },
             { data: "DataNascita", title: "Data di Nascita" },
             { data: "Cat", title: "Cat" },
             { data: "CodFis", title: "Codice Fiscale" },
             { data: "CodFisSoc", title: "Codice Fiscale Società"}
         ]
   }) // Fine DataTable
}) // Fine function

/* Prova */
$( document ).ready(function() {
  $('#button').click( function () {
      alert( table.rows('.selected').data().length +' row(s) selected' );
  } );
});

/* Salva il file con i corridori selezionati */
$(document).ready(function(){
  $('#download-file').click(function(){

    /* Crea un file json con i dati selezionati in tabella */
    var jsonObj = [];
    table.rows('.selected').every(function(rowIdx, tableLoop, rowLoop){
      jsonObj.push(this.data()); // Stringa json che rappresenta la riga
    })

    /* Controlla che il file contenga qualcosa */
    if(jsonObj.length <= 0){
      alert('Attenzione, selezionare almeno una riga prima di proseguire!');
      return;
    }

    /* Mostra il dialog per selezionare dove salvare il file */
    var filename = dialog.showSaveDialog({
      filters: [
        {
          name: 'Excel (.xlsx)',
          extensions: ['xlsx']
        }
      ]
    })
    
    if(filename == null){
      return;
    }

    /* Salva il file */
    if(typeof require !== 'undefined') XLSX = require('xlsx'); // Richiede dipendenze se non ci sono
    var ws = XLSX.utils.json_to_sheet(jsonObj);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.writeFile(wb, filename);
    
  });
});



/* Definisce la selezione di un corridore sulla tabella */
/* Imposta 'selected' alla riga */
$(document).ready(function () {
  $('#tableOfPeople tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );
});

/* Caricare file */
/*
$(document).ready(function(){
  $('#load-file').click(function(){
    // Dialog per selezionare il file da caricare 
    var fileName = dialog.showOpenDialog({
      filters: [
        {
          name: 'Excel (.xlsx; .xls)',
          extensions: ['xlsx', 'xls']
        }
      ]
    })
    
    if(fileName == null){
      return
    }

    popupS.prompt({
      content: 'Inserire il codice fiscale della società',
      onSubmit: function(societyCF) {
        if(societyCF === null) {
          alert('Inserire qualcosa!')
          return
        }
        //var fileName = e.target.files[0].path;
        if(typeof require !== 'undefined') XLSX = require('xlsx');
        var workbook = XLSX.readFile(fileName[0], {cellDates:true, cellNF:false, cellText:false});
        var first_sheet_name = workbook.SheetNames[0];
        //Ottieni worksheet 
        var worksheet = workbook.Sheets[first_sheet_name];

        // Convert all sheet to json object 
        var jsonString = XLSX.utils.sheet_to_json(worksheet, {dateNF:'YYYY-MM-DD'})

        // Riempi tabella 
        $.each(jsonString, function(i, item){
          if(item.DataNascita != null && item.Cognome != null && item.Nome != null && item.DataNascita != null){ // Necessario per via di un errore che blocca tutta la funzione
            table.row.add({
              'Pettorale':        item.Pettorale,
              'Cognome':          item.Cognome,
              'Nome':             item.Nome,
              'Sesso':            item.Sesso,
              'Data di Nascita':  item.DataNascita.getDate() + '/' + (item.DataNascita.getMonth() + 1) + '/' + item.DataNascita.getUTCFullYear(),
              'Cat':              item.Cat,
              'Codice Fiscale':   item.CodFis,
              'Codice Fiscale Società': societyCF
            }).draw( false );
          }
        }); // End foreach
        
        $('#download-file').prop('disabled', false);
        $('#hint').prop('hidden', true)
      }
  });

  })
});
*/
/* Caricare file */
$(document).ready(function(){
  $('#load-file').click(function(){
    /* Dialog per selezionare il file da caricare  */
    var fileName = dialog.showOpenDialog({
      filters: [
        {
          name: 'Excel (.xlsx; .xls)',
          extensions: ['xlsx', 'xls']
        }
      ]
    })
    
    if(fileName == null){
      return
    }

    //var fileName = e.target.files[0].path;
    if(typeof require !== 'undefined') XLSX = require('xlsx');
    var workbook = XLSX.readFile(fileName[0], {cellDates:true, cellNF:false, cellText:false});
    var first_sheet_name = workbook.SheetNames[0];
    /* Ottieni worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];

    /* Convert all sheet to json object */
    var jsonString = XLSX.utils.sheet_to_json(worksheet, {dateNF:'YYYY-MM-DD'})

    /* Riempi tabella */
    $.each(jsonString, function(i, item){
      alert(JSON.stringify(jsonString))
      //if(item.DataNascita != null && item.Cognome != null && item.Nome != null && item.DataNascita != null){ // Necessario per via di un errore che blocca tutta la funzione
        table.row.add({
          'Pettorale':        item.Pettorale,
          'Cognome':          item.Cognome,
          'Nome':             item.Nome,
          'Sesso':            item.Sesso,
          'DataNascita':      item['Data di Nascita'],
          //'DataNascita':      item['Data di Nascita'].getDate() + '/' + (itemitem['Data di Nascita'].getMonth() + 1) + '/' + itemitem['Data di Nascita'].getUTCFullYear(),
          'Cat':              item.Cat,
          'CodFis':           item.CodFis,
          'CodFisSoc':        'ciao'
        }).draw( false );
      //}
    }); // End foreach
    
    $('#download-file').prop('disabled', false);
    $('#hint').prop('hidden', true)

  })
});
