
function generovatObrazek() {
    var typ = document.getElementById('typ').value;
    var imagePath = `Pictures/${typ}.png`;
    var imageContainer = document.getElementById('image-container');
    var sectionImage = document.getElementById('section-image');

    sectionImage.src = imagePath;
    imageContainer.style.display = 'block';
  }

  function generovatTabulky() {
    var typ = document.getElementById('typ').value;
    var velikost = document.getElementById('velikost').value;
    var filtr = document.getElementById('filtr').value;

    // Pevně definovaný soubor
    var soubor = './stl2.xlsx';  // Cesta k souboru

    fetch(soubor, { cache: 'no-store' })
      .then(response => response.arrayBuffer())
      .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Získání požadovaného listu na základě typu průřezu
          if (workbook.Sheets[typ]) {
              var sheet = workbook.Sheets[typ];

              // Zde načítáme hodnoty z excelového souboru
              var velikostPrurezu = velikost;
              var prvek = [];
              var dimenze = [];
              var plocha = [];
              var vlastnosti = [];
              var ohyb = [];
              var tlak = [];

              // Získání rozsahu dat
              const range = sheet['!ref']; // např. "A1:E10"
              const startRow = XLSX.utils.decode_range(range).s.r + 1; // počáteční řádek
              const endRow = XLSX.utils.decode_range(range).e.r + 1; // konečný řádek

              for (let row = startRow; row <= endRow; row++) {
                  let velikostValue = sheet[`B${row}`] ? sheet[`B${row}`].v : undefined;  // Zabezpečení pro undefined hodnoty
                  if (String(velikostValue) === velikostPrurezu) {
                      prvek.push({ nazev: "Typ průřezu", hodnota: typ });
                      prvek.push({ nazev: "Velikost", hodnota: velikostValue });
                      prvek.push({ nazev: "Hmotnost", hodnota: sheet[`C${row}`].v});

                      // Další načítání hodnot pro dimenze, plochu, vlastnosti atd. podle struktury excelového souboru
                      dimenze.push({ nazev: "Výška průřezu", znacka: "h", hodnota: sheet[`D${row}`].v, jednotky: "mm" });
                      dimenze.push({ nazev: "Šířka průřezu", znacka: "b", hodnota: sheet[`E${row}`].v, jednotky: "mm" });
                      dimenze.push({ nazev: "Tloušťka stojiny", znacka: "tw", hodnota: sheet[`F${row}`].v, jednotky: "mm" });
                      dimenze.push({ nazev: "Tloušťka pásnice", znacka: "tf", hodnota: sheet[`G${row}`].v, jednotky: "mm" });
                      dimenze.push({ nazev: "Poloměr zakřivení", znacka: "r", hodnota: sheet[`H${row}`].v, jednotky: "mm" });
                      dimenze.push({ nazev: "Výška stěny mezi zaoblením", znacka: "d", hodnota: sheet[`I${row}`].v, jednotky: "mm" });

                      plocha.push({ nazev: "Průřezová plocha", znacka: "A", hodnota: sheet[`J${row}`].v, jednotky: "mm2" });
                      plocha.push({ nazev: "Smyková plocha", znacka: "Avz", hodnota: sheet[`K${row}`].v, jednotky: "mm2" });

                      vlastnosti.push({ nazev: "Moment setrvačnosti kolem osy y", znacka: "Iy", hodnota: sheet[`L${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Pružný průřezový modul kolem osy y", znacka: "Wy", hodnota: sheet[`M${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Plastický průřezový modul kolem osy y", znacka: "Wpl,y", hodnota: sheet[`N${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Poloměr setrvačnosti kolem osy y", znacka: "iy", hodnota: sheet[`O${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Moment setrvačnosti kolem osy z", znacka: "Iz", hodnota: sheet[`P${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Pružný průřezový modul kolem osy z", znacka: "Wz", hodnota: sheet[`Q${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Plastický průřezový modul kolem osy z", znacka: "Wpl,z", hodnota: sheet[`R${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Poloměr setrvačnosti kolem osy z", znacka: "iz", hodnota: sheet[`S${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Moment setrvačnosti ve volném kroucení", znacka: "It", hodnota: sheet[`T${row}`].v, jednotky: "mm" });
                      vlastnosti.push({ nazev: "Výsečový moment setrvačnosti", znacka: "Iw", hodnota: sheet[`U${row}`].v, jednotky: "mm" });

                      ohyb.push({ nazev: "S235",  hodnota: sheet[`V${row}`].v });
                      ohyb.push({ nazev: "S275",  hodnota: sheet[`W${row}`].v });
                      ohyb.push({ nazev: "S355",  hodnota: sheet[`X${row}`].v });
                      ohyb.push({ nazev: "S460",  hodnota: sheet[`Y${row}`].v });

                      tlak.push({ nazev: "S235",  hodnota: sheet[`Z${row}`].v });
                      tlak.push({ nazev: "S275",  hodnota: sheet[`AA${row}`].v });
                      tlak.push({ nazev: "S355",  hodnota: sheet[`AB${row}`].v });
                      tlak.push({ nazev: "S460",  hodnota: sheet[`AC${row}`].v });
                  }
              }
                // Zobrazení tabulky PRVEK
                var prvekTable = `<tr><th colspan=2>PRVEK</th></tr>`;
                prvek.forEach(function(item) {
                    prvekTable += `<tr><td>${item.nazev}</td><td>${item.hodnota}</td></tr>`;
                });
                document.getElementById('prvek-table').innerHTML = prvekTable;
  
                // Načítání tabulek podle filtrů
                if (filtr === 'all' || filtr === 'dimenze') {
                  document.getElementById('dimenze-container').style.display = 'block';
                  var dimenzeTable = `
                    <tr><th colspan=4>DIMENZE</th></tr>
                    <tr><th>Název</th><th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
                  `;
                  dimenze.forEach(function(item) {
                    dimenzeTable += `<tr><td>${item.nazev}</td><td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
                  });
                  document.getElementById('dimenze-table').innerHTML = dimenzeTable;
                } else {
                    document.getElementById('dimenze-container').style.display = 'none';
                }
  
                if (filtr === 'all' || filtr === 'plocha') {
                  document.getElementById('plocha-container').style.display = 'block';
                  var plochaTable = `
                    <tr><th colspan=4>PLOCHA</th></tr>
                    <tr><th>Název</th><th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
                  `;
                  plocha.forEach(function(item) {
                    plochaTable += `<tr><td>${item.nazev}</td><td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
                  });
                  document.getElementById('plocha-table').innerHTML = plochaTable;
                } else {
                  document.getElementById('plocha-container').style.display = 'none';
                }
  
                if (filtr === 'all' || filtr === 'vlastnosti') {
                  document.getElementById('vlastnosti-container').style.display = 'block';
                  var vlastnostiTable = `
                    <tr><th colspan=4>VLASTNOSTI</th></tr>
                    <tr><th>Název</th><th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
                  `;
                  vlastnosti.forEach(function(item) {
                    vlastnostiTable += `<tr><td>${item.nazev}</td><td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
                  });
                  document.getElementById('vlastnosti-table').innerHTML = vlastnostiTable;
                } else {
                  document.getElementById('vlastnosti-container').style.display = 'none';
                }
  
                if (filtr === 'all' || filtr === 'ohyb') {
                    document.getElementById('ohyb-container').style.display = 'block';
                    var ohybTable = `
                        <tr><th colspan="4">OHYB</th></tr>
                        <tr><th>S235</th><th>S275</th><th>S355</th><th>S460</th></tr>
                        <tr>
                          <td>${ohyb.find(item => item.nazev === "S235")?.hodnota || "-"}</td>
                          <td>${ohyb.find(item => item.nazev === "S275")?.hodnota || "-"}</td>
                          <td>${ohyb.find(item => item.nazev === "S355")?.hodnota || "-"}</td>
                          <td>${ohyb.find(item => item.nazev === "S460")?.hodnota || "-"}</td>
                        </tr>
                    `;
                    document.getElementById('ohyb-table').innerHTML = ohybTable;
                } else {
                    document.getElementById('ohyb-container').style.display = 'none';
                }
  
                if (filtr === 'all' || filtr === 'tlak') {
                    document.getElementById('tlak-container').style.display = 'block';
                    var tlakTable = `
                        <tr><th colspan="4">TLAK</th></tr>
                        <tr><th>S235</th><th>S275</th><th>S355</th><th>S460</th></tr>
                        <tr>
                          <td>${tlak.find(item => item.nazev === "S235")?.hodnota || "-"}</td>
                          <td>${tlak.find(item => item.nazev === "S275")?.hodnota || "-"}</td>
                          <td>${tlak.find(item => item.nazev === "S355")?.hodnota || "-"}</td>
                          <td>${tlak.find(item => item.nazev === "S460")?.hodnota || "-"}</td>
                        </tr>
                    `;
                    document.getElementById('tlak-table').innerHTML = tlakTable;
                } else {
                    document.getElementById('tlak-container').style.display = 'none';
                }
            }
        });
      
      // Zobrazit filtr a tlačítka pro export
      document.getElementById('filter-container').style.display = 'block';
      document.getElementById('export_button-container').style.display = 'flex';
  }
  

  

function exportovatHodnotyPodleFiltru() {
  var wb = XLSX.utils.book_new();
  
  // Získáme tabulku PRVEK
  var prvekTable = document.getElementById('prvek-table');
  
  // Vytvoříme list, který bude obsahovat všechny tabulky
  var sheet = [];

  // Přidáme PRVEK tabulku
  sheet = sheet.concat(XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(prvekTable), {header: 1}));

  // Seznam všech kontejnerů a jejich tabulek
  var containers = [
      {containerId: 'dimenze-container', tableId: 'dimenze-table'},
      {containerId: 'plocha-container', tableId: 'plocha-table'},
      {containerId: 'vlastnosti-container', tableId: 'vlastnosti-table'},
      {containerId: 'ohyb-container', tableId: 'ohyb-table'},
      {containerId: 'tlak-container', tableId: 'tlak-table'}
  ];

  // Procházení všech kontejnerů
  containers.forEach(function(container) {
      var containerElement = document.getElementById(container.containerId);
      var tableElement = document.getElementById(container.tableId);
      
      // Pokud je kontejner viditelný, přidáme odpovídající tabulku
      if (containerElement.style.display === 'block' && tableElement) {
          sheet.push([]);  // Přidáme prázdný řádek mezi tabulkami pro lepší přehlednost
          sheet = sheet.concat(XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(tableElement), {header: 1}));
      }
  });

  // Přidáme obsah na jeden list
  wb.SheetNames.push('Tabulky');
  wb.Sheets['Tabulky'] = XLSX.utils.aoa_to_sheet(sheet);

  // Export do Excel
  XLSX.writeFile(wb, 'Prurez_export_filtr.xlsx');
}



function exportovatVsechnyHodnoty() {
  var wb = XLSX.utils.book_new();
  var ws_data = [];
  var tables = ["prvek-table", "dimenze-table", "plocha-table", "vlastnosti-table", "ohyb-table", "tlak-table"];

  tables.forEach((tableId, index) => {
      var table = document.getElementById(tableId);
      if (table && table.style.display !== "none") {
          var rows = table.rows;
          for (var i = 0; i < rows.length; i++) {
              var row = [];
              for (var j = 0; j < rows[i].cells.length; j++) {
                  row.push(rows[i].cells[j].innerText);
              }
              ws_data.push(row);
          }
          if (index < tables.length - 1) {
              ws_data.push([]); // Přidání prázdného řádku mezi tabulkami
          }
      }
  });

  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, "Vystup.xlsx");
}