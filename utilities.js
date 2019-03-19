window.$ = window.jQuery = require("jquery")
// https://datatables.net/download/
var dt = require( 'datatables.net' )( window, $ );
require( 'jszip' );
require( 'datatables.net-bs4' )();
require( 'datatables.net-buttons-bs4' )();
require( 'datatables.net-buttons/js/buttons.html5.js' )();
require( 'datatables.net-select-bs4' )();
require( 'datatables.net-dt' )( window, $ );
require('bootstrap')
const day = 0; 
const month=1; 
const year=2;
const fs = require("fs");
const {dialog} = require("electron").remote;
var popupS = require('popups');
var table; // Utilizzata per datatables


$(document).ready(function(){
  // Assegna alla tabella la proprietà di datatables
  table = $('#tableOfPeople').DataTable({
     lengthMenu: [[10,50,100,500,-1], [10,50,100,500,'All']],
     columns: [
             { data: "Cognome", title: "Cognome" },
             { data: "Nome", title: "Nome" },
             { data: "Sesso", title: "Sesso" },
             { data: "DataNascita", title: "Data di Nascita" },
             { data: "Codice Fiscale", title: "Codice Fiscale" },
             { data: "Codice", title: "Cod.Soc."},
             { data: "IDSodalizio", title: "Nome Società"},
             { data: "chip", title: "Chip"}
         ],
      columnDefs:[
        { targets:[7], render : function(data){return createSelect(data);} }   
      ]         
  }) // Fine DataTable


/*
  var table = $('#example').DataTable( {
    columnDefs:[{targets:[0,1,3,4,5], type:"dom-text", render:function(data, type, row, meta){
        return "<input type='text' value='" +  data + "'>";
    }},
    {targets:[2], render : 
     function(data){}}           
               ]
  });
*/



  // Scarica il file dei corridori
  $('#download-file').click(function(){
    // Crea un file json con i dati selezionati in tabella 
    var jsonObj = [];
    table.rows('.selected').every(function(rowIdx, tableLoop, rowLoop){
      jsonObj.push(this.data()); // Stringa json che rappresenta la riga
    })

    // Controlla che il file contenga qualcosa 
    if(jsonObj.length <= 0){
      alert('Attenzione, selezionare almeno una riga prima di proseguire!');
      return;
    }

    // Mostra la finestra per selezionare dove salvare il file 
    var filename = dialog.showSaveDialog({
      filters: [
        {
          name: 'Excel (.xlsx)',
          extensions: ['xlsx']
        }
      ]
    })
    
    // Controllo stupido
    if(filename == null){
      return;
    }

    // Salva il file 
    if(typeof require !== 'undefined') XLSX = require('xlsx'); // Richiede dipendenze se non ci sono
    var ws = XLSX.utils.json_to_sheet(jsonObj); // Converte l'oggetto json in un file xls
    var wb = XLSX.utils.book_new(); // Crea un nuovo file xls
    XLSX.utils.book_append_sheet(wb, ws, "People"); // Scrive la tabella nel file 
    XLSX.writeFile(wb, filename); // Salva il file nel percorso selezionato
    
  }); // Fine scarica file dei corridori

  // Definisce la selezione di un corridore sulla tabella 
  // Imposta 'selected' alla riga 
  $('#tableOfPeople tbody').on( 'click', 'tr', function () {
    $(this).toggleClass('selected');
  } ); // FINE select

  // Caricare file XLS
  $('#load-file').click(function(){
    if(table.rows().count() > 0){
      if (!confirm('ATTENZIONE: Se viene caricato un nuovo file le nuove righe verranno aggiunte inseme alle vecchie! \n Si desidera procedere ugualmente?')) {
        return
      }
    }

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
      //alert(JSON.stringify(jsonString))
      if(item.Numero != 0){ 
        table.row.add({
          //'Pettorale':        item.Pettorale,
          'Cognome':          item.Cognome,
          'Nome':             item.Nome,
          'Sesso':            item.Sesso,
          //'DataNascita':      item['DataNascita'],
          'DataNascita':      item.DataNascita.getDate() + '/' + (item.DataNascita.getMonth() + 1) + '/' + item.DataNascita.getUTCFullYear(),
          //'Cat':              item.Cat,
          'Codice Fiscale':   item.CodFis,
          'Codice':           item.Codice,
          'IDSodalizio':      item.IDSodalizio,
          'chip':             'S'
        }).draw( false );
      }
    }); // End foreach
    
    $('#download-file').prop('disabled', false);
    $('#hint').prop('hidden', true)
    $('#save-table').prop('disabled', false);
    $('#download-classifica').prop('disabled', false);

  })// Fine carica file XLS

  //Carica file JSON
  $('#load-file-bici').click(function(){
    if(table.rows().count() > 0){
      if (!confirm('ATTENZIONE: Se viene caricato un nuovo file le nuove righe verranno aggiunte inseme alle vecchie! \n Si desidera procedere ugualmente?')) {
        return
      }
      table.rows('.selected').remove().draw(false);
    }

    /* Dialog per selezionare il file da caricare  */
    var fileName = dialog.showOpenDialog({
      filters: [
        {
          name: 'Bici (.bici)',
          extensions: ['bici']
        }
      ]
    })
    
    if(fileName == null){
      return
    }

    var jsonObj;
    fs.readFile(fileName[0], 'utf8', function(err, data){
      if(err){
        alert('Qualcosa è andato storto :/');
        return;
      }
      jsonObj = JSON.parse(data);
      //alert(data)
      /* Riempi tabella */
      $.each(jsonObj, function(i, item){
      //alert(item['Cod.Soc.'])
      //alert(JSON.stringify(jsonString))
      //if(item.DataNascita != null && item.Cognome != null && item.Nome != null && item.DataNascita != null){ // Necessario per via di un errore che blocca tutta la funzione
        table.row.add({
          'Cognome':          item.Cognome,
          'Nome':             item.Nome,
          'Sesso':            item.Sesso,
          'DataNascita':      item['DataNascita'],
          'Codice Fiscale':   item['Codice Fiscale'],
          'Codice':           item.Codice,
          'IDSodalizio':      item.IDSodalizio,
          'chip':             item.selezChip
        }).draw( false );
      //}
      }); // End foreach
      
    });
    $('#download-file').prop('disabled', false);
    $('#hint').prop('hidden', true)
    $('#save-table').prop('disabled', false);
    $('#download-classifica').prop('disabled', false);
  }) // FINE Carica file JSON

  // Salva la tabella in formato JSON
  $('#save-table').click(function(){
    /* Crea un file json con i dati selezionati in tabella */
    var jsonObj = [];
    table.rows().every(function(rowIdx, tableLoop, rowLoop){
      //alert($('select', this.node()).val()); // Prende il valore della select
      //alert(JSON.stringify(jsonObj))
      var o = this.data();
      o.selezChip = $('select', this.node()).val() // Prende il valore della select
      o.selezionato = 'no' // TODO: Implementa il salvataggio delle righe selezionate
      jsonObj.push(this.data()); // Stringa json che rappresenta la riga
    })

    //alert(JSON.stringify(jsonObj))

    /* Mostra il dialog per selezionare dove salvare il file */
    var fileName = dialog.showSaveDialog({
      filters: [
        {
          name: 'Bici (.bici)',
          extensions: ['bici']
        }
      ]
    })

    var jsonString = JSON.stringify(jsonObj);
    fs.writeFile(fileName, jsonString, 'utf8', function(){});

  })// FINE salva file JSON

  // Aggiungi un corridore manualmente 
  $('#add-row').click(function(){
    //alert($('#cognome').val())
    if($('#cognome').val() == ''){
      alert('Inserisci il COGNOME dell\'utente!')
      return
    }
    if($('#nome').val() == ''){
      alert('Inserisci il NOME dell\'utente!')
      return
    }
    if($('#sesso').val() == 'Seleziona...'){
      alert('SESSO non selezionato!')
      return
    }
    if($('#data').val() == ''){
      alert('Inserisci una DATA DI NASCITA!')
      return
    }
    var str = $('#data').val();
    var date = str.split('/');
    if(date.length != 3){
      alert('Errore nell\'inserimento della DATA DI NASCITA!')
      return
    }
    if(isNaN(date[year]) || date[year] < 1900 || date[year] > new Date().getFullYear()-1){
      alert('L\'ANNO di nascita sembra non essere corretto...')
      return
    }
    if(isNaN(date[month]) || date[month]<1 || date[month] > 12){
      alert('Il MESE di nascita sembra non essere corretto...')
      return
    }
    if(isNaN(date[day]) || date[day]<1 || date[day] > 31){
      alert('Il GIORNO di nascita sembra non essere corretto...')
      return
    }
    if($('#cf').val() == ''){
      alert('Inserire un CODICE FISCALE valido!')
      return
    }
    if($('#codice-soc').val() == ''){
      alert('Inserisci un CODICE SOCIETA\'!')
      return
    }
    if($('#codice-soc').val() == ''){
      alert('Inserisci un NOME SOCIETA\'!')
      return
    }
    table.row.add({
      //'Pettorale':        item.Pettorale,
      'Cognome':          $('#cognome').val(),
      'Nome':             $('#nome').val(),
      'Sesso':            $('#sesso').val(),
      //'DataNascita':      item['DataNascita'],
      'DataNascita':      $('#data').val(),
      //'Cat':              item.Cat,
      'Codice Fiscale':   $('#cf').val(),
      'Codice':           $('#codice-soc').val(),
      'IDSodalizio':      $('#nome-soc').val(),
      //'Tessera':          item.Tessera
    }).draw(false);
    $('#cognome').val('')
    $('#nome').val('')
    $('#sesso').val('Seleziona...')
    $('#data').val('')
    $('#cf').val('')
    $('#codice-soc').val('')
    $('#nome-soc').val('')

    $('#add-modal').modal('toggle')

    $('#download-file').prop('disabled', false);
    $('#hint').prop('hidden', true)
    $('#save-table').prop('disabled', false);
    $('#download-classifica').prop('disabled', false);

  }); // FINE Aggiungi un corridore manualmente

}) // Fine ready


// the function creates a select box
function createSelect(){
  var sel = "<select>" ;
  sel += "<option value = 'No' >No</option>"
  sel += "<option value = 'Si' >Si</option>"
  sel += "</select>";
  return sel;
}

// the function creates a select box
function createSelect(v){
  var sel = "<select>" ;  
  if(v=='Si'){
    sel += "<option value = 'No' >No</option>"
    sel += "<option selected value = 'Si' >Si</option>"
  }else{
    sel += "<option selected value = 'No' >No</option>"
    sel += "<option value = 'Si' >Si</option>"
  }
  sel += "</select>";
  return sel;
}