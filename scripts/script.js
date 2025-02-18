/* import { velikostiPrurezu } from '../constants/const.js'; */

const velikostiPrurezu = {
  "IPE": ["80", "B", "C"],
  "HEA": ["1", "2", "3"],
  "HEB": ["80", "/", "+"],
  "TR": ["80", "21,3", "22"],
  "OBD": ["20", "21,3", "22"]
};

var tloustkySten = {
  "TR": {
    "80": ["2.6", "2 mm", "3 mm"],
    "21,3": ["5 mm", "6 mm", "9 mm"],
    "22": ["4 mm", "7 mm", "10 mm"]
  },
  "OBD": {
    "20": ["F mm", "1,5 mm", "2 mm"],
    "21,3": ["2 mm", "3 mm", "4 mm"],
    "22": ["2,5 mm", "3,5 mm", "5 mm"]
  }
};

function generovatObrazek() {
    var typ = document.getElementById('typ').value;
    var imagePath = `Pictures/${typ}.png`;
    var imageContainer = document.getElementById('image-container');
    var sectionImage = document.getElementById('section-image');

    sectionImage.src = imagePath;
    imageContainer.style.display = 'block';
  }

function skrytTabulky() {
    document.getElementById('prvek-table').innerHTML = '';
    document.getElementById('dimenze-table').innerHTML = '';
    document.getElementById('dimenzeTR-table').innerHTML = '';
    document.getElementById('plocha-table').innerHTML = '';
    document.getElementById('vlastnosti-table').innerHTML = '';
    document.getElementById('vlastnostiTR-table').innerHTML = '';
    document.getElementById('ohyb-table').innerHTML = '';
    document.getElementById('tlak-table').innerHTML = '';
    document.getElementById('filter-container').style.display = 'none';
    document.getElementById('export_button-container').style.display = 'none';
}

function generovatData(sheet, row, typ, velikostValue) {
  var prvek = [];
  var dimenze = [];
  var plocha = [];
  var vlastnosti = [];
  var ohyb = [];
  var tlak = [];
  
  prvek.push({ nazev: "Typ průřezu", hodnota: typ });
  prvek.push({ nazev: "Velikost", hodnota: velikostValue });
  prvek.push({ nazev: "Hmotnost", hodnota: sheet[`C${row}`].v + " kg/m" });


  // Další načítání hodnot pro dimenze, plochu, vlastnosti atd. podle struktury excelového souboru
  dimenze.push({ nazev: "Výška průřezu", znacka: "h", hodnota: sheet[`D${row}`].v, jednotky: "mm" });
  dimenze.push({ nazev: "Šířka průřezu", znacka: "b", hodnota: sheet[`E${row}`].v, jednotky: "mm" });
  dimenze.push({ nazev: "Tloušťka stojiny", znacka: "t<sub>w</sub>", hodnota: sheet[`F${row}`].v, jednotky: "mm" });
  dimenze.push({ nazev: "Tloušťka pásnice", znacka: "t<sub>f</sub>", hodnota: sheet[`G${row}`].v, jednotky: "mm" });
  dimenze.push({ nazev: "Poloměr zakřivení", znacka: "r", hodnota: sheet[`H${row}`].v, jednotky: "mm" });
  dimenze.push({ nazev: "Výška stěny mezi zaoblením", znacka: "d", hodnota: sheet[`I${row}`].v, jednotky: "mm" });

  plocha.push({ nazev: "Průřezová plocha", znacka: "A", hodnota: sheet[`J${row}`].v, jednotky: "mm<sup>2</sup>" });
  plocha.push({ nazev: "Smyková plocha", znacka: "A<sub>vz</sub>", hodnota: sheet[`K${row}`].v, jednotky: "mm<sup>2</sup>" });

  vlastnosti.push({ nazev: "Moment setrvačnosti kolem osy y", znacka: "I<sub>y</sub>", hodnota: sheet[`L${row}`].v, jednotky: "mm<sup>4</sup>" });
  vlastnosti.push({ nazev: "Pružný průřezový modul kolem osy y", znacka: "W<sub>y</sub>", hodnota: sheet[`M${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnosti.push({ nazev: "Plastický průřezový modul kolem osy y", znacka: "W<sub>pl,y</sub>", hodnota: sheet[`N${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnosti.push({ nazev: "Poloměr setrvačnosti kolem osy y", znacka: "i<sub>y</sub>", hodnota: sheet[`O${row}`].v, jednotky: "mm" });
  vlastnosti.push({ nazev: "Moment setrvačnosti kolem osy z", znacka: "I<sub>z</sub>", hodnota: sheet[`P${row}`].v, jednotky: "mm<sup>4</sup>" });
  vlastnosti.push({ nazev: "Pružný průřezový modul kolem osy z", znacka: "W<sub>z</sub>", hodnota: sheet[`Q${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnosti.push({ nazev: "Plastický průřezový modul kolem osy z", znacka: "W<sub>pl,z</sub>", hodnota: sheet[`R${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnosti.push({ nazev: "Poloměr setrvačnosti kolem osy z", znacka: "i<sub>z</sub>", hodnota: sheet[`S${row}`].v, jednotky: "mm" });
  vlastnosti.push({ nazev: "Moment setrvačnosti ve volném kroucení", znacka: "I<sub>t</sub>", hodnota: sheet[`T${row}`].v, jednotky: "mm<sup>4</sup>" });
  vlastnosti.push({ nazev: "Výsečový moment setrvačnosti", znacka: "I<sub>w</sub>", hodnota: sheet[`U${row}`].v, jednotky: "mm<sup>6</sup>" });

  ohyb.push({ nazev: "S235",  hodnota: sheet[`V${row}`].v });
  ohyb.push({ nazev: "S275",  hodnota: sheet[`W${row}`].v });
  ohyb.push({ nazev: "S355",  hodnota: sheet[`X${row}`].v });
  ohyb.push({ nazev: "S460",  hodnota: sheet[`Y${row}`].v });

  tlak.push({ nazev: "S235",  hodnota: sheet[`Z${row}`].v });
  tlak.push({ nazev: "S275",  hodnota: sheet[`AA${row}`].v });
  tlak.push({ nazev: "S355",  hodnota: sheet[`AB${row}`].v });
  tlak.push({ nazev: "S460",  hodnota: sheet[`AC${row}`].v });

  return {
    prvek,
    dimenze,
    plocha,
    vlastnosti,
    ohyb,
    tlak
  };
}

function generovatDataproTR(sheet, row, typ, velikostValue, tloustkaValue) {
  var prvek = [];
  var dimenzeTR = [];
  var plocha = [];
  var vlastnostiTR = [];
  var zatřídění = [];
  
  prvek.push({ nazev: "Typ průřezu", hodnota: typ });
  prvek.push({ nazev: "Velikost", hodnota: velikostValue + " x " + tloustkaValue});
  prvek.push({ nazev: "Hmotnost", hodnota: sheet[`D${row}`].v + " kg/m" });

  // Další načítání hodnot pro dimenze, plochu, vlastnosti atd. podle struktury excelového souboru
  dimenzeTR.push({ nazev: "Průměr", znacka: "d", hodnota: sheet[`E${row}`].v, jednotky: "mm" });
  dimenzeTR.push({ nazev: "Tloušťka stěny", znacka: "t", hodnota: sheet[`F${row}`].v, jednotky: "mm" });

  plocha.push({ nazev: "Průřezová plocha", znacka: "A", hodnota: sheet[`G${row}`].v, jednotky: "mm<sup>2</sup>" });
  plocha.push({ nazev: "Smyková plocha", znacka: "A<sub>vz</sub>", hodnota: sheet[`H${row}`].v, jednotky: "mm<sup>2</sup>" });

  vlastnostiTR.push({ nazev: "Moment setrvačnosti", znacka: "I", hodnota: sheet[`I${row}`].v, jednotky: "mm<sup>4</sup>" });
  vlastnostiTR.push({ nazev: "Pružný průřezový modul", znacka: "W", hodnota: sheet[`J${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnostiTR.push({ nazev: "Plastický průřezový modul", znacka: "W<sub>pl</sub>", hodnota: sheet[`K${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnostiTR.push({ nazev: "Poloměr setrvačnosti", znacka: "i", hodnota: sheet[`L${row}`].v, jednotky: "mm" });
  vlastnostiTR.push({ nazev: "Dvojnásobek plochy uzavřené střednicí průřezu", znacka: "Ω", hodnota: sheet[`M${row}`].v, jednotky: "mm<sup>2</sup>" });
  vlastnostiTR.push({ nazev: "Moment setrvačnosti v kroucení uzavřeného průřezu", znacka: "I<sub>d</sub>", hodnota: sheet[`N${row}`].v, jednotky: "mm<sup>4</sup>" });

  zatřídění.push({ nazev: "S235",  hodnota: sheet[`O${row}`].v });
  zatřídění.push({ nazev: "S275",  hodnota: sheet[`P${row}`].v });
  zatřídění.push({ nazev: "S355",  hodnota: sheet[`Q${row}`].v });
  zatřídění.push({ nazev: "S460",  hodnota: sheet[`R${row}`].v });

  return {
    prvek,
    dimenzeTR,
    plocha,
    vlastnostiTR,
    zatřídění
  };
}



function generovatTabulky() {
  var typ = document.getElementById('typ').value;
  var velikost = document.getElementById('velikost').value;
  var filtrSelect = document.getElementById('filtr');

  // Uložení aktuálně vybrané hodnoty filtru
  var selectedFilter = filtrSelect.value;

  // Vyčištění existujících možností
  filtrSelect.innerHTML = '';

  // Přidání možností pro filtr
  if (typ === "TR") {
      filtrSelect.innerHTML = `
          <option value="all">Vše</option>
          <option value="ohyb">OHYB</option>
          <option value="tlak">TLAK</option>
      `;
  } else {
      filtrSelect.innerHTML = `
          <option value="all">Vše</option>
          <option value="dimenze">DIMENZE</option>
          <option value="plocha">PLOCHA</option>
          <option value="vlastnosti">VLASTNOSTI</option>
          <option value="ohyb">OHYB</option>
          <option value="tlak">TLAK</option>
          <option value="zatřídění">ZATŘÍDĚNÍ</option>
      `;
  }

  // Obnovení vybrané hodnoty filtru, pokud je stále platná
  if (filtrSelect.querySelector(`option[value="${selectedFilter}"]`)) {
      filtrSelect.value = selectedFilter;
  } else {
      // Pokud vybraná hodnota není platná, nastavíme výchozí hodnotu
      filtrSelect.value = "all";
  }

  // Získání aktuální hodnoty filtru
  var filtr = filtrSelect.value;

  // Pevně definovaný soubor
  var soubor = './stl2.xlsx';  // Cesta k souboru

  fetch(soubor, { cache: 'no-store' })
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.Sheets[typ]) {
          skrytTabulky();
          return;
      }
          var sheet = workbook.Sheets[typ];
          const range = sheet['!ref'];
          const startRow = XLSX.utils.decode_range(range).s.r + 1;
          const endRow = XLSX.utils.decode_range(range).e.r + 1;
          let velikostExistuje = false;

        for (let row = startRow; row <= endRow; row++) {
          let velikostValue = sheet[`B${row}`] ? sheet[`B${row}`].v : undefined;
          if (String(velikostValue) === velikost) {
              velikostExistuje = true;
              break;
            }
        }

        if (!velikostExistuje) {
          skrytTabulky();
          return;
      }

        for (let row = startRow; row <= endRow; row++) {
            let velikostValue = sheet[`B${row}`] ? sheet[`B${row}`].v : undefined;  

            if (String(velikostValue) === velikost) {
              if (typ === "TR") {
                let tloustkaValue = sheet[`C${row}`] ? sheet[`C${row}`].v : undefined;
                let tloustka = document.getElementById('stena').value;
                if (String(tloustkaValue) === tloustka) {
                  var { prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění } = generovatDataproTR(sheet, row, typ, velikostValue, tloustkaValue);
                } 
              } else {
                var { prvek, dimenze, plocha, vlastnosti, ohyb, tlak } = generovatData(sheet, row, typ, velikostValue);
              }
          }
      }
      if (typ === "TR") {
        zobrazTabulkyproTR(prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění, filtr);
      } else {
        zobrazTabulky(prvek, dimenze, plocha, vlastnosti, ohyb, tlak, filtr);
      }
    });

  // Zobrazit filtr a tlačítka pro export
  document.getElementById('filter-container').style.display = 'block';
  document.getElementById('export_button-container').style.display = 'flex';
}

function zobrazTabulkyproTR(prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění, filtr) {
  
  // Zobrazení tabulky PRVEK
  var prvekTable = `<tr><th colspan=2>PRVEK</th></tr>`;
  prvek.forEach(function(item) {
      prvekTable += `<tr><td>${item.nazev}</td><td>${item.hodnota}</td></tr>`;
  });
  document.getElementById('prvek-table').innerHTML = prvekTable;

  // Načítání tabulek podle filtrů
  document.getElementById('vlastnosti-container').style.display = 'none';
  document.getElementById('dimenze-container').style.display = 'none';
  document.getElementById('ohyb-container').style.display = 'none';
  document.getElementById('tlak-container').style.display = 'none';

  if (filtr === 'all' || filtr === 'dimenze') {
      document.getElementById('dimenzeTR-container').style.display = 'block';
      var dimenzeTable = `
          <tr><th colspan=4>DIMENZE</th></tr>
          <tr><th>Název</th><th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
      `;
      dimenzeTR.forEach(function(item) {
          dimenzeTable += `<tr><td>${item.nazev}</td><td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
      });
      document.getElementById('dimenzeTR-table').innerHTML = dimenzeTable;
  } else {
      document.getElementById('dimenzeTR-container').style.display = 'none';
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
      document.getElementById('vlastnostiTR-container').style.display = 'block';
      var vlastnostiTable = `
          <tr><th colspan=4>VLASTNOSTI</th></tr>
          <tr><th>Název</th><th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
      `;
      vlastnostiTR.forEach(function(item) {
          vlastnostiTable += `<tr><td>${item.nazev}</td><td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
      });
      document.getElementById('vlastnostiTR-table').innerHTML = vlastnostiTable;
  } else {
      document.getElementById('vlastnostiTR-container').style.display = 'none';
  }

  if (filtr === 'all' || filtr === 'ohyb') {
      document.getElementById('zatrideni-container').style.display = 'block';
      var zatrideniTable = `
          <tr><th colspan="4">ZATŘÍDĚNÍ</th></tr>
          <tr><th>S235</th><th>S275</th><th>S355</th><th>S460</th></tr>
          <tr>
              <td>${zatřídění.find(item => item.nazev === "S235")?.hodnota || "-"}</td>
              <td>${zatřídění.find(item => item.nazev === "S275")?.hodnota || "-"}</td>
              <td>${zatřídění.find(item => item.nazev === "S355")?.hodnota || "-"}</td>
              <td>${zatřídění.find(item => item.nazev === "S460")?.hodnota || "-"}</td>
          </tr>
      `;
      document.getElementById('zatrideni-table').innerHTML = zatrideniTable;
  } else {
      document.getElementById('zatrideni-container').style.display = 'none';
  }

}

function zobrazTabulky(prvek, dimenze, plocha, vlastnosti, ohyb, tlak, filtr) {
  // Zobrazení tabulky PRVEK
  var prvekTable = `<tr><th colspan=2>PRVEK</th></tr>`;
  prvek.forEach(function(item) {
      prvekTable += `<tr><td>${item.nazev}</td><td>${item.hodnota}</td></tr>`;
  });
  document.getElementById('prvek-table').innerHTML = prvekTable;

  // Načítání tabulek podle filtrů
  document.getElementById('vlastnostiTR-container').style.display = 'none';
  document.getElementById('dimenzeTR-container').style.display = 'none';
  document.getElementById('zatrideni-container').style.display = 'none';

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



function aktualizovatVelikosti() {
  var typ = document.getElementById("typ").value;
  var velikostSelect = document.getElementById("velikost");
  var stenaGroup = document.getElementById("stena-group");
  var stenaSelect = document.getElementById("stena");

  // Vyčištění existujících možností
  velikostSelect.innerHTML = "";
  stenaSelect.innerHTML = "";

  // Přidání možností pro velikost průřezu
  velikostiPrurezu[typ].forEach(function(velikost) {
    var option = document.createElement("option");
    option.value = velikost;
    option.textContent = velikost;
    velikostSelect.appendChild(option);
  });

  // Aktualizace dostupných tlouštěk stěn na základě velikosti a typu průřezu
function aktualizovatTloustkuSteny() {
    stenaSelect.innerHTML = "";
    var vybranaVelikost = velikostSelect.value;

    if (tloustkySten[typ] && tloustkySten[typ][vybranaVelikost]) {
      tloustkySten[typ][vybranaVelikost].forEach(function(tloustka) {
        var option = document.createElement("option");
        option.value = tloustka;
        option.textContent = tloustka;
        stenaSelect.appendChild(option);
      });
    }
  }

  // Zobrazíme výběr stěny pouze pokud existují odpovídající tloušťky stěn
  if (tloustkySten[typ]) {
    stenaGroup.style.display = "block";
    velikostSelect.addEventListener("change", aktualizovatTloustkuSteny);
    aktualizovatTloustkuSteny(); // Inicializace pro první hodnotu
  } else {
    stenaGroup.style.display = "none";
  }
}




function exportovatHodnotyPodleFiltru() {
  var typ = document.getElementById('typ').value;
  var wb = XLSX.utils.book_new();
  var sheet = [];

  // Přidáme PRVEK tabulku
  var prvekTable = document.getElementById('prvek-table');
  sheet = sheet.concat(XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(prvekTable), { header: 1 }));

  // Definice tabulek podle typu průřezu
  var containers;
  if (typ === "TR") {
    containers = [
      { containerId: 'dimenzeTR-container', tableId: 'dimenzeTR-table' },
      { containerId: 'plocha-container', tableId: 'plocha-table' },
      { containerId: 'vlastnostiTR-container', tableId: 'vlastnostiTR-table' },
      { containerId: 'zatrideni-container', tableId: 'zatrideni-table' }
    ];
  } else {
    containers = [
      { containerId: 'dimenze-container', tableId: 'dimenze-table' },
      { containerId: 'plocha-container', tableId: 'plocha-table' },
      { containerId: 'vlastnosti-container', tableId: 'vlastnosti-table' },
      { containerId: 'ohyb-container', tableId: 'ohyb-table' },
      { containerId: 'tlak-container', tableId: 'tlak-table' }
    ];
  }

  // Procházení všech kontejnerů
  containers.forEach(function (container) {
    var containerElement = document.getElementById(container.containerId);
    var tableElement = document.getElementById(container.tableId);

    // Pokud je kontejner viditelný, přidáme odpovídající tabulku
    if (containerElement && containerElement.style.display === 'block' && tableElement) {
      sheet.push([]);  // Přidáme prázdný řádek mezi tabulkami pro lepší přehlednost
      sheet = sheet.concat(XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(tableElement), { header: 1 }));
    }
  });

  // Přidáme obsah na jeden list
  wb.SheetNames.push('Tabulky');
  wb.Sheets['Tabulky'] = XLSX.utils.aoa_to_sheet(sheet);

  // Export do Excel
  XLSX.writeFile(wb, 'Prurez_export_filtr.xlsx');
}


function exportovatVsechnyHodnoty() {
  var typ = document.getElementById('typ').value;
  var wb = XLSX.utils.book_new();
  var ws_data = [];

  // Přidáme PRVEK tabulku
  var prvekTable = document.getElementById('prvek-table');
  if (prvekTable) {
    var rows = prvekTable.rows;
    for (var i = 0; i < rows.length; i++) {
      var row = [];
      for (var j = 0; j < rows[i].cells.length; j++) {
        row.push(rows[i].cells[j].innerText);
      }
      ws_data.push(row);
    }
    ws_data.push([]); // Přidání prázdného řádku mezi tabulkami
  }

  // Definice tabulek podle typu průřezu
  var tables;
  if (typ === "TR") {
    tables = ["dimenzeTR-table", "plocha-table", "vlastnostiTR-table", "zatrideni-table"];
  } else {
    tables = ["dimenze-table", "plocha-table", "vlastnosti-table", "ohyb-table", "tlak-table"];
  }

  // Procházení všech tabulek
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