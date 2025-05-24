// Funkce pro načtení dat z Excelu pro vybranou třídu betonu
function nacistDataZExcelu(tridaBetonu) {
  return new Promise((resolve, reject) => {
    fetch('./Beton.xlsx', { cache: 'no-store' })
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Najít sloupec s odpovídající třídou betonu
        const range = XLSX.utils.decode_range(sheet['!ref']);
        let properties = null;
        let sloupecIndex = -1;

        // Najít sloupec pro danou třídu betonu (řádek 4)
        for (let col = range.s.c; col <= range.e.c; col++) {
          const bunka = sheet[XLSX.utils.encode_cell({ r: 3, c: col })];
          if (bunka && bunka.v === tridaBetonu) {
            sloupecIndex = col;
            break;
          }
        }

        if (sloupecIndex === -1) {
          reject(new Error('Třída betonu nebyla nalezena'));
          return;
        }

        // Mapování řádků na vlastnosti
        const rowMapping = {
          fck: 5,      // řádek 5 pro fck
          fcm: 8,      // řádek 8 pro fcm
          fctm: 9,     // řádek 9 pro fctm
          fctk005: 10, // řádek 10 pro fctk,0,05
          fctk095: 12, // řádek 12 pro fctk,0,95
          Ecm: 13,     // řádek 13 pro Ecm
          εc3: 19,     // řádek 19 pro Ec3
          εcu3: 20     // řádek 20 pro Ecu3
        };

        properties = {};
        for (const [prop, row] of Object.entries(rowMapping)) {
          const bunka = sheet[XLSX.utils.encode_cell({ r: row - 1, c: sloupecIndex })];
          properties[prop] = bunka ? bunka.v : null;
        }

        // Přidání konstantních hodnot
        properties.v = 0.2;     // Poissonův součinitel je vždy 0,2
        properties.γc = 1.5;    // Součinitel spolehlivosti je vždy 1,5

        if (properties) {
          resolve(properties);
        } else {
          reject(new Error('Nepodařilo se načíst vlastnosti betonu'));
        }
      })
      .catch(error => reject(error));
  });
}

function generovatBetonoveTabulky() {
  const tridaBetonu = document.getElementById('beton-trida').value;
  const filtr = document.getElementById('beton-filtr').value;

  // Zobrazit filtr
  document.getElementById('beton-filter-container').style.display = 'block';

  nacistDataZExcelu(tridaBetonu)
    .then(properties => {
      // Generování dat pro tabulky
      const prvek = [
        { nazev: "Pevnostní třída", znacka: "-", hodnota: tridaBetonu, jednotky: "-" },
        { nazev: "Poissonův součinitel", znacka: "μ", hodnota: properties.v, jednotky: "-" },
        { nazev: "Dílčí součinitel spolehlivosti", znacka: "γ<sub>c</sub>", hodnota: properties.γc, jednotky: "-" }
      ];

      const pevnostTlak = [
        { nazev: "Charakteristická pevnost v tlaku", znacka: "f<sub>ck</sub>", hodnota: properties.fck, jednotky: "MPa" },
        { nazev: "Střední hodnota pevnosti v tlaku", znacka: "f<sub>cm</sub>", hodnota: properties.fcm, jednotky: "MPa" }
      ];

      const pevnostTah = [
        { nazev: "Střední hodnota pevnosti v tahu", znacka: "f<sub>ctm</sub>", hodnota: properties.fctm, jednotky: "MPa" },
        { nazev: "Charakteristická pevnost v tahu (5%)", znacka: "f<sub>ctk,0.05</sub>", hodnota: properties.fctk005, jednotky: "MPa" },
        { nazev: "Charakteristická pevnost v tahu (95%)", znacka: "f<sub>ctk,0.95</sub>", hodnota: properties.fctk095, jednotky: "MPa" }
      ];

      const modulPruznosti = [
        { nazev: "Sečnový modul pružnosti", znacka: "E<sub>cm</sub>", hodnota: properties.Ecm, jednotky: "GPa" }
      ];

      const mezniPretvoreni = [
        { nazev: "Přetvoření při maximálním napětí", znacka: "ε<sub>c3</sub>", hodnota: properties.εc3, jednotky: "‰" },
        { 
          nazev: "Mezní přetvoření", 
          znacka: "ε<sub>cu3</sub>", 
          hodnota: properties.εcu3, 
          jednotky: "‰",
          info: "Mezní přetvoření εcu3 je maximální dovolené poměrné stlačení betonu v tlaku. Tato hodnota je důležitá pro mezní stav únosnosti a používá se při návrhu železobetonových konstrukcí. Představuje bod, kdy dochází k porušení betonu v tlaku."
        }
      ];

      // Zobrazení tabulek podle filtru
      zobrazitBetonoveTabulky(prvek, pevnostTlak, pevnostTah, modulPruznosti, mezniPretvoreni, filtr);
    })
    .catch(error => {
      console.error('Chyba při načítání dat:', error);
      alert('Nepodařilo se načíst data z Excel souboru');
    });
}

function zobrazitBetonoveTabulky(prvek, pevnostTlak, pevnostTah, modulPruznosti, mezniPretvoreni, filtr) {
  // Definice všech kontejnerů
  const containers = {
    prvek: { id: 'beton-prvek-container', title: 'PRVEK', data: prvek },
    pevnostTlak: { id: 'beton-pevnost-tlak-container', title: 'PEVNOST V TLAKU', data: pevnostTlak },
    pevnostTah: { id: 'beton-pevnost-tah-container', title: 'PEVNOST V TAHU', data: pevnostTah },
    modulPruznosti: { id: 'beton-modul-pruznosti-container', title: 'MODUL PRUŽNOSTI', data: modulPruznosti },
    mezniPretvoreni: { id: 'beton-mezni-pretvoreni-container', title: 'MEZNÍ PŘETVOŘENÍ', data: mezniPretvoreni }
  };

  // Získat hlavní kontejner pro tabulky
  const mainContainer = document.getElementById('beton-tables-container');
  mainContainer.innerHTML = ''; // Vyčistit kontejner

  // Vytvořit nebo najít kontejnery
  Object.values(containers).forEach(container => {
    let element = document.createElement('div');
    element.id = container.id;
    element.className = 'table-container';
    mainContainer.appendChild(element);
  });

  // Zobrazit tabulky podle filtru
  Object.entries(containers).forEach(([key, container]) => {
    const element = document.getElementById(container.id);
    if (filtr === 'all' || filtr === key) {
      element.appendChild(vytvorTabulku(container.data, container.title));
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  });

  // Zobrazit tlačítka pro export
  document.getElementById('beton-export-container').style.display = 'flex';
}

function vytvorTabulku(data, title) {
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th colspan="4" class="table-header">${title}</th>
      </tr>
      <tr>
        <th>Veličina</th>
        <th>Značka</th>
        <th>Hodnota</th>
        <th>Jednotky</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(row => {
        const escapedInfo = row.info ? row.info.replace(/"/g, '&quot;') : '';
        return `
          <tr>
            <td>${row.nazev}${row.info ? `<span class="info-icon" onclick='zobrazitInfo("${escapedInfo}")'>ⓘ</span>` : ''}</td>
            <td>${row.znacka}</td>
            <td>${row.hodnota}</td>
            <td>${row.jednotky}</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  `;

  // Přidání event listenerů po vytvoření tabulky
  const infoIcons = table.getElementsByClassName('info-icon');
  Array.from(infoIcons).forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      const text = this.getAttribute('onclick').match(/"(.*?)"/)[1];
      zobrazitInfo(text);
    });
  });

  return table;
}

// Aktualizovat filtr v HTML
function updateFiltrOptions() {
  const filtrSelect = document.getElementById('beton-filtr');
  filtrSelect.innerHTML = `
    <option value="all">Vše</option>
    <option value="prvek">PRVEK</option>
    <option value="pevnostTlak">PEVNOST V TLAKU</option>
    <option value="pevnostTah">PEVNOST V TAHU</option>
    <option value="modulPruznosti">MODUL PRUŽNOSTI</option>
    <option value="mezniPretvoreni">MEZNÍ PŘETVOŘENÍ</option>
  `;
}

function exportBetonFiltr() {
  const wb = XLSX.utils.book_new();
  let sheet = [];

  // Definice všech možných tabulek
  const containers = [
    { containerId: 'beton-prvek-container', tableId: 'beton-prvek-table' },
    { containerId: 'beton-pevnost-tlak-container', tableId: 'beton-pevnost-tlak-table' },
    { containerId: 'beton-pevnost-tah-container', tableId: 'beton-pevnost-tah-table' },
    { containerId: 'beton-modul-pruznosti-container', tableId: 'beton-modul-pruznosti-table' },
    { containerId: 'beton-mezni-pretvoreni-container', tableId: 'beton-mezni-pretvoreni-table' }
  ];

  // Procházení všech kontejnerů
  containers.forEach(function (container) {
    const containerElement = document.getElementById(container.containerId);
    if (containerElement && containerElement.style.display === 'block') {
      const tableElement = containerElement.querySelector('table');
      if (tableElement) {
        if (sheet.length > 0) {
          sheet.push([]); // Přidáme prázdný řádek mezi tabulkami pro lepší přehlednost
        }
        sheet = sheet.concat(XLSX.utils.sheet_to_json(XLSX.utils.table_to_sheet(tableElement), { header: 1 }));
      }
    }
  });

  // Přidáme obsah na jeden list
  wb.SheetNames.push('Beton');
  wb.Sheets['Beton'] = XLSX.utils.aoa_to_sheet(sheet);

  // Export do Excel
  const tridaBetonu = document.getElementById('beton-trida').value;
  XLSX.writeFile(wb, `Beton_${tridaBetonu.replace(/ /g, '_')}_filtr.xlsx`);
}

function exportBetonKomplet() {
  const wb = XLSX.utils.book_new();
  let ws_data = [];
  const tridaBetonu = document.getElementById('beton-trida').value;

  // Definice všech tabulek
  const containers = [
    { containerId: 'beton-prvek-container', title: 'PRVEK' },
    { containerId: 'beton-pevnost-tlak-container', title: 'PEVNOST V TLAKU' },
    { containerId: 'beton-pevnost-tah-container', title: 'PEVNOST V TAHU' },
    { containerId: 'beton-modul-pruznosti-container', title: 'MODUL PRUŽNOSTI' },
    { containerId: 'beton-mezni-pretvoreni-container', title: 'MEZNÍ PŘETVOŘENÍ' }
  ];

  // Procházení všech kontejnerů
  containers.forEach((container, index) => {
    const containerElement = document.getElementById(container.containerId);
    if (containerElement) {
      const tableElement = containerElement.querySelector('table');
      if (tableElement) {
        const rows = tableElement.rows;
        for (let i = 0; i < rows.length; i++) {
          const row = [];
          for (let j = 0; j < rows[i].cells.length; j++) {
            row.push(rows[i].cells[j].innerText);
          }
          ws_data.push(row);
        }
        if (index < containers.length - 1) {
          ws_data.push([]); // Přidání prázdného řádku mezi tabulkami
        }
      }
    }
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Beton " + tridaBetonu);
  XLSX.writeFile(wb, `Beton_${tridaBetonu.replace(/ /g, '_')}_vse.xlsx`);
}

// Event listener pro změnu třídy betonu
document.addEventListener('DOMContentLoaded', function() {
  const betonSelect = document.getElementById('beton-trida');
  if (betonSelect) {
    betonSelect.addEventListener('change', generovatBetonoveTabulky);
    
    // Vygenerovat tabulky pro počáteční hodnotu
    generovatBetonoveTabulky();
  }
});

// Přidat modální okno do DOM ihned
const modalHTML = `
  <div id="infoModal" class="modal-overlay">
    <div class="modal-content">
      <span class="modal-close" onclick="zavritInfo()">&times;</span>
      <p id="modalText"></p>
    </div>
  </div>
`;

// Zajistit, že modální okno existuje v DOM
if (!document.getElementById('infoModal')) {
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Funkce pro zobrazení informačního okna
function zobrazitInfo(text) {
  console.log('Zobrazuji info:', text); // Pro debugování
  const modal = document.getElementById('infoModal');
  const modalText = document.getElementById('modalText');
  if (!modal || !modalText) {
    console.error('Modal elements not found!');
    return;
  }
  modalText.textContent = text;
  modal.style.display = 'flex';
}

// Funkce pro zavření informačního okna
function zavritInfo() {
  const modal = document.getElementById('infoModal');
  if (!modal) {
    console.error('Modal element not found!');
    return;
  }
  modal.style.display = 'none';
}

// Zavřít modální okno při kliknutí mimo něj
document.addEventListener('click', function(event) {
  const modal = document.getElementById('infoModal');
  if (event.target === modal) {
    zavritInfo();
  }
});

// Zavřít modální okno při pohybu kolečka myši
document.addEventListener('wheel', function(event) {
  const modal = document.getElementById('infoModal');
  if (modal && modal.style.display === 'flex') {
    zavritInfo();
  }
}, { passive: true });
