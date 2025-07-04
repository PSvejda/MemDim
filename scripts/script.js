// Univerzální funkce pro posuvné tlačítko
function toggleFunction(event) {
  // Pokud je event předán, použij target element, jinak použij původní logiku
  const toggleSwitch = event ? event.target.closest('.toggle-switch') : document.getElementById('toggle-switch');
  
  if (!toggleSwitch) return;
  
  const isActive = toggleSwitch.classList.contains('active');
  
  if (isActive) {
    toggleSwitch.classList.remove('active');
  } else {
    toggleSwitch.classList.add('active');
  }

  // Re-generate tables based on which toggle was switched
  if (toggleSwitch.id === 'toggle-switch') {
    // Only regenerate if tables are visible
    if (document.getElementById('filter-container').style.display !== 'none') {
        generovatTabulky();
    }
  } else if (toggleSwitch.id === 'beton-toggle-switch') {
    if (document.getElementById('beton-filter-container').style.display !== 'none') {
        generovatBetonoveTabulky();
    }
  } else if (toggleSwitch.id === 'drevo-toggle-switch') {
    if (document.getElementById('drevo-filter-container').style.display !== 'none') {
        generovatDrevoTabulky();
    }
  }
}

// Funkce pro inicializaci posuvných tlačítek jako zapnutých
function initializeToggles() {
  // Hlavní toggle switch
  const toggleSwitch = document.getElementById('toggle-switch');
  if (toggleSwitch) {
    toggleSwitch.classList.add('active');
  }

  // Beton toggle switch
  const betonToggleSwitch = document.getElementById('beton-toggle-switch');
  if (betonToggleSwitch) {
    betonToggleSwitch.classList.add('active');
  }

  // Drevo toggle switch
  const drevoToggleSwitch = document.getElementById('drevo-toggle-switch');
  if (drevoToggleSwitch) {
    drevoToggleSwitch.classList.add('active');
  }
}



const velikostiPrurezu = {
  "IPE": ["80", "B", "C"],
  "HEA": ["1", "2", "3"],
  "HEB": ["80", "/", "+"],
  "TR": ["80", "21,3", "22"],
  "OBD": ["50 x 30", "60 x 40", "70 x 40"]
};
  


// Definice materiálových vlastností
const materialProperties = {
  mezeKluzu: {
    'S235': 235,
    'S275': 275,
    'S355': 355,
    'S460': 460
  },
  mezePevnosti: {
    'S235': 360,
    'S275': 430,
    'S355': 490,
    'S460': 570
  },
  konstantniHodnoty: {
    hustota: { hodnota: 7850, jednotky: "kg/m³", nazev: "Hustota", znacka: "ρ" },
    modulPruznosti: { hodnota: 210000, jednotky: "MPa", nazev: "Modul pružnosti", znacka: "E" },
    modulPruznostiVeSmyku: { hodnota: 80700, jednotky: "MPa", nazev: "Modul pružnosti ve smyku", znacka: "G" },
    poissonovoCislo: { hodnota: 0.3, jednotky: "-", nazev: "Poissonovo číslo", znacka: "v" },
    soucinitelTeplotniRoztaznosti: { hodnota: 0.000012, jednotky: "K⁻¹", nazev: "Součinitel teplotní roztažnosti", znacka: "α" }
  },
  dilciSoucinitele: {
    gM0: { 
      hodnota: 1.00, 
      jednotky: "-", 
      nazev: "Dílčí součinitel spolehlivosti", 
      znacka: "γ<sub>M0</sub>",
      popis: "Dílčí součinitel spolehlivosti γM0 se používá pro únosnost průřezů kterékoliv třídy. Používá se při posouzení průřezu na jakýkoliv typ namáhání (tah, tlak, ohyb, smyk)."
    },
    gM1: { 
      hodnota: 1.00, 
      jednotky: "-", 
      nazev: "Dílčí součinitel spolehlivosti", 
      znacka: "γ<sub>M1</sub>",
      popis: "Dílčí součinitel spolehlivosti γM1 se používá pro únosnost průřezů při posuzování stability prutů. Používá se při posouzení na vzpěr a klopení."
    },
    gM2: { 
      hodnota: 1.25, 
      jednotky: "-", 
      nazev: "Dílčí součinitel spolehlivosti", 
      znacka: "γ<sub>M2</sub>",
      popis: "Dílčí součinitel spolehlivosti γM2 se používá pro únosnost průřezů při porušení v tahu a pro únosnost šroubových a svarových spojů."
    }
  }
};

var tloustkySten = {
  "TR": {
    "80": ["2.6", "2 mm", "3 mm"],
    "21,3": ["5 mm", "6 mm", "9 mm"],
    "22": ["4 mm", "7 mm", "10 mm"]
  },
  "OBD": {
    "50 x 30": ["2,9", "4,0", "5,0"],
    "60 x 40": ["2,9", "4,0", "5,0"],
    "70 x 40": ["4,0", "5,0", "6,3"]
  }
};

function showPage(page) {
  // Skryje všechny obsahy
  document.querySelectorAll('.content').forEach(function(content) {
    content.style.display = 'none';
  });

  // Zobrazí vybraný obsah
  document.getElementById(page + '-content').style.display = 'block';
}

function toggleDropdown() {
  const dropdownLinks = document.getElementById('dropdown-links');
  dropdownLinks.style.display = dropdownLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Skryje rozbalovací odkazy při kliknutí mimo něj
window.onclick = function(event) {
  const dropdown = document.querySelector('.dropdown');
  
  // Kontrola, zda bylo kliknuto uvnitř dropdownu
  if (!dropdown.contains(event.target)) {
    document.getElementById('dropdown-links').style.display = 'none';
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
    document.getElementById('material-table').innerHTML = '';
    document.getElementById('dimenze-table').innerHTML = '';
    document.getElementById('dimenzeTR-table').innerHTML = '';
    document.getElementById('plocha-table').innerHTML = '';
    document.getElementById('vlastnosti-table').innerHTML = '';
    document.getElementById('vlastnostiTR-table').innerHTML = '';
    document.getElementById('ohyb-table').innerHTML = '';
    document.getElementById('tlak-table').innerHTML = '';
    document.getElementById('zatrideni-table').innerHTML = '';
    
    document.getElementById('material-container').style.display = 'none';
    document.getElementById('dimenze-container').style.display = 'none';
    document.getElementById('dimenzeTR-container').style.display = 'none';
    document.getElementById('plocha-container').style.display = 'none';
    document.getElementById('vlastnosti-container').style.display = 'none';
    document.getElementById('vlastnostiTR-container').style.display = 'none';
    document.getElementById('ohyb-container').style.display = 'none';
    document.getElementById('tlak-container').style.display = 'none';
    document.getElementById('zatrideni-container').style.display = 'none';
    
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
  
  prvek.push({ nazev: "Typ průřezu", hodnota: typ, jednotky: "-" });
  prvek.push({ nazev: "Velikost", hodnota: velikostValue, jednotky: "mm" });
  prvek.push({ nazev: "Hmotnost", hodnota: sheet[`C${row}`].v, jednotky: "kg/m" });

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

  ohyb.push({ nazev: "S235",  hodnota: sheet[`V${row}`].v, jednotky: "" });
  ohyb.push({ nazev: "S275",  hodnota: sheet[`W${row}`].v, jednotky: "" });
  ohyb.push({ nazev: "S355",  hodnota: sheet[`X${row}`].v, jednotky: "" });
  ohyb.push({ nazev: "S460",  hodnota: sheet[`Y${row}`].v, jednotky: "" });

  tlak.push({ nazev: "S235",  hodnota: sheet[`Z${row}`].v, jednotky: "" });
  tlak.push({ nazev: "S275",  hodnota: sheet[`AA${row}`].v, jednotky: "" });
  tlak.push({ nazev: "S355",  hodnota: sheet[`AB${row}`].v, jednotky: "" });
  tlak.push({ nazev: "S460",  hodnota: sheet[`AC${row}`].v, jednotky: "" });

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
  
  prvek.push({ nazev: "Typ průřezu", hodnota: typ, jednotky: "-" });
  prvek.push({ nazev: "Velikost", hodnota: velikostValue + " x " + tloustkaValue, jednotky: "mm" });
  prvek.push({ nazev: "Hmotnost", hodnota: sheet[`D${row}`].v, jednotky: "kg/m" });

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

  zatřídění.push({ nazev: "S235",  hodnota: sheet[`O${row}`].v, jednotky: "" });
  zatřídění.push({ nazev: "S275",  hodnota: sheet[`P${row}`].v, jednotky: "" });
  zatřídění.push({ nazev: "S355",  hodnota: sheet[`Q${row}`].v, jednotky: "" });
  zatřídění.push({ nazev: "S460",  hodnota: sheet[`R${row}`].v, jednotky: "" });

  return {
    prvek,
    dimenzeTR,
    plocha,
    vlastnostiTR,
    zatřídění
  };
}

function generovatDataproOBD(sheet, row, typ, velikostValue, tloustkaValue) {
  var prvek = [];
  var dimenzeOBD = [];
  var plocha = [];
  var vlastnostiOBD = [];
  var ohybMekka = [];
  var ohybTuha = [];
  var tlak = [];
  
  prvek.push({ nazev: "Typ průřezu", hodnota: typ, jednotky: "-" });
  prvek.push({ nazev: "Velikost", hodnota: velikostValue + " x " + tloustkaValue, jednotky: "mm" });
  prvek.push({ nazev: "Hmotnost", hodnota: sheet[`C${row}`].v, jednotky: "kg/m" });

  // Dimenze
  dimenzeOBD.push({ nazev: "Výška průřezu", znacka: "h", hodnota: sheet[`D${row}`].v, jednotky: "mm" });
  dimenzeOBD.push({ nazev: "Šířka průřezu", znacka: "b", hodnota: sheet[`E${row}`].v, jednotky: "mm" });
  dimenzeOBD.push({ nazev: "Tloušťka stěny", znacka: "t<sub>w</sub>", hodnota: sheet[`F${row}`].v, jednotky: "mm" });

  // Plocha
  plocha.push({ nazev: "Průřezová plocha", znacka: "A", hodnota: sheet[`G${row}`].v, jednotky: "mm<sup>2</sup>" });

  // Vlastnosti
  vlastnostiOBD.push({ nazev: "Moment setrvačnosti k ose y", znacka: "I<sub>y</sub>", hodnota: sheet[`H${row}`].v, jednotky: "mm<sup>4</sup>" });
  vlastnostiOBD.push({ nazev: "Pružný průřezový modul k ose y", znacka: "W<sub>y</sub>", hodnota: sheet[`I${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnostiOBD.push({ nazev: "Plastický průřezový modul k ose y", znacka: "W<sub>pl,y</sub>", hodnota: sheet[`J${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnostiOBD.push({ nazev: "Poloměr setrvačnosti k ose y", znacka: "i<sub>y</sub>", hodnota: sheet[`K${row}`].v, jednotky: "mm" });
  vlastnostiOBD.push({ nazev: "Moment setrvačnosti k ose z", znacka: "I<sub>z</sub>", hodnota: sheet[`L${row}`].v, jednotky: "mm<sup>4</sup>" });
  vlastnostiOBD.push({ nazev: "Pružný průřezový modul k ose z", znacka: "W<sub>z</sub>", hodnota: sheet[`M${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnostiOBD.push({ nazev: "Plastický průřezový modul k ose z", znacka: "W<sub>pl,z</sub>", hodnota: sheet[`N${row}`].v, jednotky: "mm<sup>3</sup>" });
  vlastnostiOBD.push({ nazev: "Poloměr setrvačnosti k ose z", znacka: "i<sub>z</sub>", hodnota: sheet[`O${row}`].v, jednotky: "mm" });
  vlastnostiOBD.push({ nazev: "Moment setrvačnosti ve volném kroucení", znacka: "I<sub>t</sub>", hodnota: sheet[`P${row}`].v, jednotky: "mm<sup>4</sup>" });

  // Ohyb okolo měkké osy
  ohybMekka.push({ nazev: "S235", hodnota: sheet[`Q${row}`].v, jednotky: "" });
  ohybMekka.push({ nazev: "S275", hodnota: sheet[`R${row}`].v, jednotky: "" });
  ohybMekka.push({ nazev: "S355", hodnota: sheet[`S${row}`].v, jednotky: "" });
  ohybMekka.push({ nazev: "S460", hodnota: sheet[`T${row}`].v, jednotky: "" });

  // Ohyb okolo tuhé osy
  ohybTuha.push({ nazev: "S235", hodnota: sheet[`U${row}`].v, jednotky: "" });
  ohybTuha.push({ nazev: "S275", hodnota: sheet[`V${row}`].v, jednotky: "" });
  ohybTuha.push({ nazev: "S355", hodnota: sheet[`W${row}`].v, jednotky: "" });
  ohybTuha.push({ nazev: "S460", hodnota: sheet[`X${row}`].v, jednotky: "" });

  // Tlak
  tlak.push({ nazev: "S235", hodnota: sheet[`Y${row}`].v, jednotky: "" });
  tlak.push({ nazev: "S275", hodnota: sheet[`Z${row}`].v, jednotky: "" });
  tlak.push({ nazev: "S355", hodnota: sheet[`AA${row}`].v, jednotky: "" });
  tlak.push({ nazev: "S460", hodnota: sheet[`AB${row}`].v, jednotky: "" });

  return {
    prvek,
    dimenzeOBD,
    plocha,
    vlastnostiOBD,
    ohybMekka,
    ohybTuha,
    tlak
  };
}

function generovatTabulky() {
  var typ = document.getElementById('typ').value;
  var velikost = document.getElementById('velikost').value;
  var filtrSelect = document.getElementById('filtr');
  var selectedFilter = filtrSelect.value;
  filtrSelect.innerHTML = '';

  if (typ === "TR") {
      filtrSelect.innerHTML = `
          <option value="all">Vše</option>
          <option value="material">MATERIÁLOVÉ VLASTNOSTI</option>
          <option value="ohyb">OHYB</option>
          <option value="tlak">TLAK</option>
      `;
  } else if (typ === "OBD") {
      filtrSelect.innerHTML = `
          <option value="all">Vše</option>
          <option value="material">MATERIÁLOVÉ VLASTNOSTI</option>
          <option value="dimenze">DIMENZE</option>
          <option value="plocha">PLOCHA</option>
          <option value="vlastnosti">VLASTNOSTI</option>
          <option value="ohyb">OHYB</option>
          <option value="tlak">TLAK</option>
      `;
  } else {
      filtrSelect.innerHTML = `
          <option value="all">Vše</option>
          <option value="material">MATERIÁLOVÉ VLASTNOSTI</option>
          <option value="dimenze">DIMENZE</option>
          <option value="plocha">PLOCHA</option>
          <option value="vlastnosti">VLASTNOSTI</option>
          <option value="ohyb">OHYB</option>
          <option value="tlak">TLAK</option>
      `;
  }

  if (filtrSelect.querySelector(`option[value="${selectedFilter}"]`)) {
      filtrSelect.value = selectedFilter;
  } else {
      filtrSelect.value = "all";
  }

  var filtr = filtrSelect.value;
  var soubor = './stl2.xlsx';

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
          let dataNalezena = false;
          let tloustka = document.getElementById('stena').value;
          let prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění, dimenze, vlastnosti, ohyb, tlak, dimenzeOBD, vlastnostiOBD, ohybMekka, ohybTuha;

          for (let row = startRow; row <= endRow; row++) {
              let velikostValue = sheet[`B${row}`] ? sheet[`B${row}`].v : undefined;
              let tloustkaValue = sheet[`C${row}`] ? sheet[`C${row}`].v : undefined;

              if (String(velikostValue) === velikost) {
                  if ((typ === "TR" || typ === "OBD") && (tloustkaValue === undefined || String(tloustkaValue) !== tloustka)) {
                      continue;
                  }

                  if (typ === "TR") {
                      ({ prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění } = generovatDataproTR(sheet, row, typ, velikostValue, tloustkaValue));
                  } else if (typ === "OBD") {
                      ({ prvek, dimenzeOBD, plocha, vlastnostiOBD, ohybMekka, ohybTuha, tlak } = generovatDataproOBD(sheet, row, typ, velikostValue, tloustkaValue));
                  } else {
                      ({ prvek, dimenze, plocha, vlastnosti, ohyb, tlak } = generovatData(sheet, row, typ, velikostValue));
                  }
                  dataNalezena = true;
                  break;
              }
          }

          if (!dataNalezena) {
              skrytTabulky();
              return;
          }

          if (typ === "TR") {
              zobrazTabulkyproTR(prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění, filtr);
          } else if (typ === "OBD") {
              zobrazTabulkyproOBD(prvek, dimenzeOBD, plocha, vlastnostiOBD, ohybMekka, ohybTuha, tlak, filtr);
          } else {
              zobrazTabulky(prvek, dimenze, plocha, vlastnosti, ohyb, tlak, filtr);
          }

          // Zobrazíme filtrační kontejner a tlačítka pro export pouze pokud jsou data nalezena
          document.getElementById('filter-container').style.display = 'block';
          document.getElementById('export_button-container').style.display = 'flex';
      });
}


function zobrazTabulkyproTR(prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění, filtr) {
    const isToggleActive = document.getElementById('toggle-switch').classList.contains('active');
    
    // Dynamically add/remove class to tables for styling
    ['prvek-table', 'material-table', 'dimenzeTR-table', 'plocha-table', 'vlastnostiTR-table', 'zatrideni-table'].forEach(id => {
        document.getElementById(id).classList.toggle('velicina-hidden', !isToggleActive);
    });

    // Nejdřív skryjeme všechny kontejnery
    document.getElementById('material-container').style.display = 'none';
    document.getElementById('dimenze-container').style.display = 'none';
    document.getElementById('dimenzeTR-container').style.display = 'none';
    document.getElementById('plocha-container').style.display = 'none';
    document.getElementById('vlastnosti-container').style.display = 'none';
    document.getElementById('vlastnostiTR-container').style.display = 'none';
    document.getElementById('ohyb-container').style.display = 'none';
    document.getElementById('tlak-container').style.display = 'none';
    document.getElementById('zatrideni-container').style.display = 'none';

    // Zobrazení tabulky PRVEK
    var prvekTable = `<tr><th colspan=${isToggleActive ? 3 : 2}>PRVEK</th></tr>`;
    prvek.forEach(function(item) {
        prvekTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
    });
    document.getElementById('prvek-table').innerHTML = prvekTable;

    // Zobrazení tabulky MATERIÁLOVÉ VLASTNOSTI
    if (filtr === 'all' || filtr === 'material') {
        document.getElementById('material-container').style.display = 'block';
        var ocelTrida = document.getElementById('ocel').value;
        
        var materialTable = `<tr><th colspan=${isToggleActive ? 4 : 3}>MATERIÁLOVÉ VLASTNOSTI</th></tr>
        <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>`;

        // Přidání konstantních hodnot
        Object.values(materialProperties.konstantniHodnoty).forEach(prop => {
            materialTable += `<tr>${isToggleActive ? `<td>${prop.nazev}</td>` : ''}<td>${prop.znacka}</td><td>${prop.hodnota}</td><td>${prop.jednotky}</td></tr>`;
        });

        // Přidání mezí kluzu a pevnosti
        materialTable += `<tr>${isToggleActive ? `<td>Mez kluzu<span class="info-icon" onclick='zobrazitInfo("Mez kluzu je hodnota napětí, při které materiál začíná plasticky deformovat. Je to důležitá charakteristika pro posouzení únosnosti ocelových konstrukcí.", true)'>ⓘ</span></td>` : ''}<td>f<sub>y</sub></td><td>${materialProperties.mezeKluzu[ocelTrida]}</td><td>MPa</td></tr>`;
        materialTable += `<tr>${isToggleActive ? '<td>Mez pevnosti</td>' : ''}<td>f<sub>u</sub></td><td>${materialProperties.mezePevnosti[ocelTrida]}</td><td>MPa</td></tr>`;

        // Přidání dílčích součinitelů
        Object.values(materialProperties.dilciSoucinitele).forEach(soucinitel => {
            materialTable += `<tr>${isToggleActive ? `<td>${soucinitel.nazev}<span class="info-icon" onclick='zobrazitInfo("${soucinitel.popis}", false)'>ⓘ</span></td>` : ''}<td>${soucinitel.znacka}</td><td>${soucinitel.hodnota}</td><td>${soucinitel.jednotky}</td></tr>`;
        });

        document.getElementById('material-table').innerHTML = materialTable;
    }

    // Načítání tabulek podle filtrů
    if (filtr === 'all' || filtr === 'dimenze') {
        document.getElementById('dimenzeTR-container').style.display = 'block';
        var dimenzeTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>DIMENZE</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        dimenzeTR.forEach(function(item) {
            dimenzeTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
        });
        document.getElementById('dimenzeTR-table').innerHTML = dimenzeTable;
    } else {
        document.getElementById('dimenzeTR-container').style.display = 'none';
    }

    if (filtr === 'all' || filtr === 'plocha') {
        document.getElementById('plocha-container').style.display = 'block';
        var plochaTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>PLOCHA</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        plocha.forEach(function(item) {
            plochaTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
        });
        document.getElementById('plocha-table').innerHTML = plochaTable;
    } else {
        document.getElementById('plocha-container').style.display = 'none';
    }

    if (filtr === 'all' || filtr === 'vlastnosti') {
        document.getElementById('vlastnostiTR-container').style.display = 'block';
        var vlastnostiTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>VLASTNOSTI</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        vlastnostiTR.forEach(function(item) {
            vlastnostiTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
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
    const isToggleActive = document.getElementById('toggle-switch').classList.contains('active');
    
    // Dynamically add/remove class to tables for styling
    ['prvek-table', 'material-table', 'dimenze-table', 'plocha-table', 'vlastnosti-table', 'ohyb-table', 'tlak-table'].forEach(id => {
        document.getElementById(id).classList.toggle('velicina-hidden', !isToggleActive);
    });

    // Nejdřív skryjeme všechny kontejnery
    document.getElementById('material-container').style.display = 'none';
    document.getElementById('dimenze-container').style.display = 'none';
    document.getElementById('dimenzeTR-container').style.display = 'none';
    document.getElementById('plocha-container').style.display = 'none';
    document.getElementById('vlastnosti-container').style.display = 'none';
    document.getElementById('vlastnostiTR-container').style.display = 'none';
    document.getElementById('ohyb-container').style.display = 'none';
    document.getElementById('tlak-container').style.display = 'none';
    document.getElementById('zatrideni-container').style.display = 'none';

    // Zobrazení tabulky PRVEK
    var prvekTable = `<tr><th colspan=${isToggleActive ? 3 : 2}>PRVEK</th></tr>`;
    prvek.forEach(function(item) {
        prvekTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
    });
    document.getElementById('prvek-table').innerHTML = prvekTable;

    // Zobrazení tabulky MATERIÁLOVÉ VLASTNOSTI
    if (filtr === 'all' || filtr === 'material') {
        document.getElementById('material-container').style.display = 'block';
        var ocelTrida = document.getElementById('ocel').value;
        
        var materialTable = `<tr><th colspan=${isToggleActive ? 4 : 3}>MATERIÁLOVÉ VLASTNOSTI</th></tr>
        <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>`;

        // Přidání konstantních hodnot
        Object.values(materialProperties.konstantniHodnoty).forEach(prop => {
            materialTable += `<tr>${isToggleActive ? `<td>${prop.nazev}</td>` : ''}<td>${prop.znacka}</td><td>${prop.hodnota}</td><td>${prop.jednotky}</td></tr>`;
        });

        // Přidání mezí kluzu a pevnosti
        materialTable += `<tr>${isToggleActive ? `<td>Mez kluzu<span class="info-icon" onclick='zobrazitInfo("Mez kluzu je hodnota napětí, při které materiál začíná plasticky deformovat. Je to důležitá charakteristika pro posouzení únosnosti ocelových konstrukcí.", true)'>ⓘ</span></td>` : ''}<td>f<sub>y</sub></td><td>${materialProperties.mezeKluzu[ocelTrida]}</td><td>MPa</td></tr>`;
        materialTable += `<tr>${isToggleActive ? `<td>Mez pevnosti</td>` : ''}<td>f<sub>u</sub></td><td>${materialProperties.mezePevnosti[ocelTrida]}</td><td>MPa</td></tr>`;

        // Přidání dílčích součinitelů
        Object.values(materialProperties.dilciSoucinitele).forEach(soucinitel => {
            materialTable += `<tr>${isToggleActive ? `<td>${soucinitel.nazev}<span class="info-icon" onclick='zobrazitInfo("${soucinitel.popis}", false)'>ⓘ</span></td>` : ''}<td>${soucinitel.znacka}</td><td>${soucinitel.hodnota}</td><td>${soucinitel.jednotky}</td></tr>`;
        });

        document.getElementById('material-table').innerHTML = materialTable;
    }

    if (filtr === 'all' || filtr === 'dimenze') {
        document.getElementById('dimenze-container').style.display = 'block';
        var dimenzeTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>DIMENZE</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        dimenze.forEach(function(item) {
            dimenzeTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
        });
        document.getElementById('dimenze-table').innerHTML = dimenzeTable;
    }

    if (filtr === 'all' || filtr === 'plocha') {
        document.getElementById('plocha-container').style.display = 'block';
        var plochaTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>PLOCHA</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        plocha.forEach(function(item) {
            plochaTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
        });
        document.getElementById('plocha-table').innerHTML = plochaTable;
    } else {
        document.getElementById('plocha-container').style.display = 'none';
    }

    if (filtr === 'all' || filtr === 'vlastnosti') {
        document.getElementById('vlastnosti-container').style.display = 'block';
        var vlastnostiTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>VLASTNOSTI</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        vlastnosti.forEach(function(item) {
            vlastnostiTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
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

function zobrazTabulkyproOBD(prvek, dimenzeOBD, plocha, vlastnostiOBD, ohybMekka, ohybTuha, tlak, filtr) {
    const isToggleActive = document.getElementById('toggle-switch').classList.contains('active');
    
    // Dynamically add/remove class to tables for styling
    ['prvek-table', 'material-table', 'dimenze-table', 'plocha-table', 'vlastnosti-table', 'ohyb-table', 'tlak-table'].forEach(id => {
        const table = document.getElementById(id);
        if (table) {
            table.classList.toggle('velicina-hidden', !isToggleActive);
        }
    });

    // Nejdřív skryjeme všechny kontejnery
    document.getElementById('material-container').style.display = 'none';
    document.getElementById('dimenze-container').style.display = 'none';
    document.getElementById('dimenzeTR-container').style.display = 'none';
    document.getElementById('plocha-container').style.display = 'none';
    document.getElementById('vlastnosti-container').style.display = 'none';
    document.getElementById('vlastnostiTR-container').style.display = 'none';
    document.getElementById('ohyb-container').style.display = 'none';
    document.getElementById('tlak-container').style.display = 'none';
    document.getElementById('zatrideni-container').style.display = 'none';

    // Zobrazení tabulky PRVEK
    var prvekTable = `<tr><th colspan=${isToggleActive ? 3 : 2}>PRVEK</th></tr>`;
    prvek.forEach(function(item) {
        prvekTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
    });
    document.getElementById('prvek-table').innerHTML = prvekTable;

    // Zobrazení tabulky MATERIÁLOVÉ VLASTNOSTI
    if (filtr === 'all' || filtr === 'material') {
        document.getElementById('material-container').style.display = 'block';
        var ocelTrida = document.getElementById('ocel').value;
        
        var materialTable = `<tr><th colspan=${isToggleActive ? 4 : 3}>MATERIÁLOVÉ VLASTNOSTI</th></tr>
        <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>`;

        // Přidání konstantních hodnot
        Object.values(materialProperties.konstantniHodnoty).forEach(prop => {
            materialTable += `<tr>${isToggleActive ? `<td>${prop.nazev}</td>` : ''}<td>${prop.znacka}</td><td>${prop.hodnota}</td><td>${prop.jednotky}</td></tr>`;
        });

        // Přidání mezí kluzu a pevnosti
        materialTable += `<tr>${isToggleActive ? `<td>Mez kluzu<span class="info-icon" onclick='zobrazitInfo("Mez kluzu je hodnota napětí, při které materiál začíná plasticky deformovat. Je to důležitá charakteristika pro posouzení únosnosti ocelových konstrukcí.", true)'>ⓘ</span></td>` : ''}<td>f<sub>y</sub></td><td>${materialProperties.mezeKluzu[ocelTrida]}</td><td>MPa</td></tr>`;
        materialTable += `<tr>${isToggleActive ? `<td>Mez pevnosti</td>` : ''}<td>f<sub>u</sub></td><td>${materialProperties.mezePevnosti[ocelTrida]}</td><td>MPa</td></tr>`;

        // Přidání dílčích součinitelů
        Object.values(materialProperties.dilciSoucinitele).forEach(soucinitel => {
            materialTable += `<tr>${isToggleActive ? `<td>${soucinitel.nazev}<span class="info-icon" onclick='zobrazitInfo("${soucinitel.popis}", false)'>ⓘ</span></td>` : ''}<td>${soucinitel.znacka}</td><td>${soucinitel.hodnota}</td><td>${soucinitel.jednotky}</td></tr>`;
        });

        document.getElementById('material-table').innerHTML = materialTable;
    }

    // Načítání tabulek podle filtrů
    if (filtr === 'all' || filtr === 'dimenze') {
        document.getElementById('dimenze-container').style.display = 'block';
        var dimenzeTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>DIMENZE</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        dimenzeOBD.forEach(function(item) {
            dimenzeTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
        });
        document.getElementById('dimenze-table').innerHTML = dimenzeTable;
    }

    if (filtr === 'all' || filtr === 'plocha') {
        document.getElementById('plocha-container').style.display = 'block';
        var plochaTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>PLOCHA</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        plocha.forEach(function(item) {
            plochaTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
        });
        document.getElementById('plocha-table').innerHTML = plochaTable;
    }

    if (filtr === 'all' || filtr === 'vlastnosti') {
        document.getElementById('vlastnosti-container').style.display = 'block';
        var vlastnostiTable = `
            <tr><th colspan=${isToggleActive ? 4 : 3}>VLASTNOSTI</th></tr>
            <tr>${isToggleActive ? '<th>Název</th>' : ''}<th>Značka</th><th>Hodnota</th><th>Jednotky</th></tr>
        `;
        vlastnostiOBD.forEach(function(item) {
            vlastnostiTable += `<tr>${isToggleActive ? `<td>${item.nazev}</td>` : ''}<td>${item.znacka}</td><td>${item.hodnota}</td><td>${item.jednotky}</td></tr>`;
        });
        document.getElementById('vlastnosti-table').innerHTML = vlastnostiTable;
    }

    if (filtr === 'all' || filtr === 'ohyb') {
        document.getElementById('ohyb-container').style.display = 'block';
        var ohybTable = `
            <table>
                <tr>
                    <th colspan="4">OHYB</th>
                </tr>
                <tr>
                    <th colspan="4">MEKKA OSA</th>
                </tr>
                <tr>
                    <th>S235</th><th>S275</th><th>S355</th><th>S460</th>
                </tr>
                <tr>
                    <td>${ohybMekka.find(item => item.nazev === "S235")?.hodnota || "-"}</td>
                    <td>${ohybMekka.find(item => item.nazev === "S275")?.hodnota || "-"}</td>
                    <td>${ohybMekka.find(item => item.nazev === "S355")?.hodnota || "-"}</td>
                    <td>${ohybMekka.find(item => item.nazev === "S460")?.hodnota || "-"}</td>
                </tr>
                <tr>
                    <th colspan="4">TUHA OSA</th>
                </tr>
                <tr>
                    <th>S235</th><th>S275</th><th>S355</th><th>S460</th>
                </tr>
                <tr>
                    <td>${ohybTuha.find(item => item.nazev === "S235")?.hodnota || "-"}</td>
                    <td>${ohybTuha.find(item => item.nazev === "S275")?.hodnota || "-"}</td>
                    <td>${ohybTuha.find(item => item.nazev === "S355")?.hodnota || "-"}</td>
                    <td>${ohybTuha.find(item => item.nazev === "S460")?.hodnota || "-"}</td>
                </tr>
            </table>
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

  // Přidáme MATERIÁLOVÉ VLASTNOSTI tabulku, pokud je viditelná
  var materialContainer = document.getElementById('material-container');
  var materialTable = document.getElementById('material-table');
  if (materialContainer && materialContainer.style.display === 'block' && materialTable) {
    sheet.push([]); // Prázdný řádek pro oddělení
    sheet = sheet.concat(XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(materialTable), { header: 1 }));
  }

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

  // Přidáme MATERIÁLOVÉ VLASTNOSTI tabulku
  var materialTable = document.getElementById('material-table');
  if (materialTable) {
    var rows = materialTable.rows;
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

// BETON PAGE //
