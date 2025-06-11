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
          fcd: 6,      // řádek 6 pro fcd
          fckcube: 7,  // řádek 7 pro fck,cube
          fcm: 8,      // řádek 8 pro fcm
          fctm: 9,     // řádek 9 pro fctm
          fctk005: 10, // řádek 10 pro fctk,0,05
          fctd: 11,    // řádek 11 pro fctd
          fctk095: 12, // řádek 12 pro fctk,0,95
          Ecm: 13,     // řádek 13 pro Ecm
          εc3: 19,     // řádek 19 pro Ec3
          εcu3: 20,    // řádek 20 pro Ecu3
          εc1: 14,     // řádek 15 pro Ec1
          εcu1: 15,    // řádek 16 pro Ecu1
          εc2: 16,     // řádek 17 pro Ec2
          εcu2: 17,    // řádek 18 pro Ecu2
          n: 18        // řádek 14 pro n
        };

        properties = {};
        for (const [prop, row] of Object.entries(rowMapping)) {
          const bunka = sheet[XLSX.utils.encode_cell({ r: row - 1, c: sloupecIndex })];
          properties[prop] = bunka ? bunka.v : null;
        }

        // Přidání konstantních hodnot
        properties.v = 0.2;     // Poissonův součinitel je vždy 0,2
        properties.γc = 1.5;    // Součinitel spolehlivosti je vždy 1,5
        properties.γs = 1.15;
        properties.α = 0.000016;
        
        if (properties) {
          resolve(properties);
        } else {
          reject(new Error('Nepodařilo se načíst vlastnosti betonu'));
        }
      })
      .catch(error => reject(error));
  });
}

// Funkce pro zaokrouhlení čísla na určitý počet desetinných míst
function formatNumber(value, type) {
  if (typeof value !== 'number') return value;
  
  switch(type) {
    case 'pevnost':
      return value.toFixed(1); // 1 desetinné místo pro pevnosti
    case 'modul':
      return Math.round(value); // celé číslo pro modul pružnosti
    case 'pretvoreni':
      return value.toFixed(2); // 2 desetinná místa pro přetvoření
    default:
      return value;
  }
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
        { nazev: "Pevnostní třída betonu", znacka: "-", hodnota: tridaBetonu },
        { nazev: "Koeficient teplotní roztažnosti betonu", znacka: "α", hodnota: properties.α },
        { nazev: "Poissonův součinitel", znacka: "μ", hodnota: properties.v },
        { nazev: "Dílčí součinitel spolehlivosti betonu", znacka: "γ<sub>c</sub>", hodnota: properties.γc },
        { nazev: "Dílčí součinitel spolehlivosti betonářské výztuže", znacka: "γ<sub>s</sub>", hodnota: properties.γs }
      ];

      const pevnostTlak = [
        { nazev: "Charakteristická pevnost v tlaku", znacka: "f<sub>ck</sub>", hodnota: formatNumber(properties.fck, 'pevnost'), jednotky: "MPa",
          info: "Charakteristická pevnost v tlaku je základní hodnota pro návrh betonových konstrukcí.<br><br><i>f<sub>ck</sub> = f<sub>ck,cube</sub> - 8 MPa</i>" },
        { nazev: "Návrhová pevnost v tlaku", znacka: "f<sub>cd</sub>", hodnota: formatNumber(properties.fcd, 'pevnost'), jednotky: "MPa",
          info: "Návrhová pevnost v tlaku se vypočítá jako:<br><br><i>f<sub>cd</sub> = f<sub>ck</sub> / γ<sub>c</sub></i><br><br>kde γ<sub>c</sub> je dílčí součinitel spolehlivosti betonu (1,5)" },
        { nazev: "Charakteristická krychelná pevnost v tlaku", znacka: "f<sub>ck,cube</sub>", hodnota: formatNumber(properties.fckcube, 'pevnost'), jednotky: "MPa",
          info: "Charakteristická krychelná pevnost v tlaku je základní hodnota měřená na krychlích.<br><br><i>f<sub>ck,cube</sub> = f<sub>ck</sub> + 8 MPa</i>" },
        { nazev: "Střední hodnota pevnosti v tlaku", znacka: "f<sub>cm</sub>", hodnota: formatNumber(properties.fcm, 'pevnost'), jednotky: "MPa",
          info: "Střední hodnota pevnosti v tlaku se vypočítá jako:<br><br><i>f<sub>cm</sub> = f<sub>ck</sub> + 8 MPa</i>" }
      ];

      const pevnostTah = [
        { nazev: "Střední hodnota pevnosti v tahu", znacka: "f<sub>ctm</sub>", hodnota: formatNumber(properties.fctm, 'pevnost'), jednotky: "MPa",
          info: "Střední hodnota pevnosti v tahu se vypočítá jako:<br><br><i>f<sub>ctm</sub> = 0,30 × f<sub>ck</sub><sup>2/3</sup></i><br><br>pro betony do třídy C50/60" },
        { nazev: "Charakteristická pevnost v tahu (5%)", znacka: "f<sub>ctk,0.05</sub>", hodnota: formatNumber(properties.fctk005, 'pevnost'), jednotky: "MPa",
          info: "Charakteristická pevnost v tahu (5%) se vypočítá jako:<br><br><i>f<sub>ctk,0.05</sub> = 0,7 × f<sub>ctm</sub></i>" },
        { nazev: "Návrhová pevnost v tahu", znacka: "f<sub>ctd</sub>", hodnota: formatNumber(properties.fctd, 'pevnost'), jednotky: "MPa",
          info: "Návrhová pevnost v tahu se vypočítá jako:<br><br><i>f<sub>ctd</sub> = f<sub>ctk,0.05</sub> / γ<sub>c</sub></i><br><br>kde γ<sub>c</sub> je dílčí součinitel spolehlivosti betonu (1,5)" },
        { nazev: "Charakteristická pevnost v tahu (95%)", znacka: "f<sub>ctk,0.95</sub>", hodnota: formatNumber(properties.fctk095, 'pevnost'), jednotky: "MPa",
          info: "Charakteristická pevnost v tahu (95%) se vypočítá jako:<br><br><i>f<sub>ctk,0.95</sub> = 1,3 × f<sub>ctm</sub></i>" }
      ];

      const modulPruznosti = [
        { nazev: "Sečnový modul pružnosti", znacka: "E<sub>cm</sub>", hodnota: formatNumber(properties.Ecm, 'modul'), jednotky: "GPa" }
      ];

      const mezniPretvoreni = [
        { nazev: "Přetvoření při dosažení maximálního napětí pro parabolický diagram", znacka: "ε<sub>c1</sub>", hodnota: formatNumber(properties.εc1, 'pretvoreni'), jednotky: "‰", 
          info: "Přetvoření εc1 je hodnota, při které beton dosahuje maximálního napětí v tlaku pro reálný diagram napětí-přetvoření.",
          showImage: true },
        { nazev: "Mezní přetvoření pro parabolický diagram", znacka: "ε<sub>cu1</sub>", hodnota: formatNumber(properties.εcu1, 'pretvoreni'), jednotky: "‰" },
        { nazev: "Přetvoření při dosažení maximálního napětí pro bilineární diagram", znacka: "ε<sub>c2</sub>", hodnota: formatNumber(properties.εc2, 'pretvoreni'), jednotky: "‰",
          info: "Přetvoření εc2 je hodnota, při které beton dosahuje maximálního napětí v tlaku pro parabolicko-rektangulární diagram napětí-přetvoření.",
          showImage: true },
        { nazev: "Mezní přetvoření pro bilineární diagram", znacka: "ε<sub>cu2</sub>", hodnota: formatNumber(properties.εcu2, 'pretvoreni'), jednotky: "‰" },
        { nazev: "Exponent", znacka: "n", hodnota: formatNumber(properties.n, 'pretvoreni'), jednotky: "-" },
        { nazev: "Přetvoření při maximálním napětí", znacka: "ε<sub>c3</sub>", hodnota: formatNumber(properties.εc3, 'pretvoreni'), jednotky: "‰",
          info: "Přetvoření εc3 je hodnota, při které beton dosahuje maximálního napětí v tlaku pro bilineární diagram napětí-přetvoření.",
          showImage: true },
        { nazev: "Mezní přetvoření", znacka: "ε<sub>cu3</sub>", hodnota: formatNumber(properties.εcu3, 'pretvoreni'), jednotky: "‰"}
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

  // Nejprve vždy zobrazit tabulku PRVEK
  const prvekElement = document.getElementById(containers.prvek.id);
  prvekElement.appendChild(vytvorTabulku(containers.prvek.data, containers.prvek.title));
  prvekElement.style.display = 'block';

  // Zobrazit ostatní tabulky podle filtru
  Object.entries(containers).forEach(([key, container]) => {
    if (key !== 'prvek') { // Přeskočit PRVEK, protože už je zobrazen
      const element = document.getElementById(container.id);
      if (filtr === 'all' || filtr === key) {
        element.appendChild(vytvorTabulku(container.data, container.title));
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  });

  // Zobrazit tlačítka pro export
  document.getElementById('beton-export-container').style.display = 'flex';
}

function vytvorTabulku(data, title) {
  const table = document.createElement('table');
  
  // Zjistit, zda data obsahují jednotky
  const maJednotky = data[0].hasOwnProperty('jednotky');
  const pocetSloupcu = maJednotky ? 4 : 3;
  
  // Přidat hlavičku tabulky
  table.innerHTML = `
    <thead>
      <tr>
        <th colspan="${pocetSloupcu}" class="table-header">${title}</th>
      </tr>
      <tr>
        <th>Veličina</th>
        <th>Značka</th>
        <th>Hodnota</th>
        ${maJednotky ? '<th>Jednotky</th>' : ''}
      </tr>
    </thead>
    <tbody>
      ${data.map(row => {
        const escapedInfo = row.info ? row.info.replace(/"/g, '&quot;') : '';
        return `
          <tr>
            <td>${row.nazev}${row.info ? `<span class="info-icon" onclick='zobrazitInfo("${escapedInfo}", ${row.showImage || false})'>ⓘ</span>` : ''}</td>
            <td>${row.znacka}</td>
            <td>${row.hodnota}</td>
            ${maJednotky ? `<td>${row.jednotky}</td>` : ''}
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
      const showImage = this.getAttribute('onclick').includes('true');
      zobrazitInfo(text, showImage);
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
  try {
    const wb = XLSX.utils.book_new();
    let ws_data = [];
    const tridaBetonu = document.getElementById('beton-trida').value;

    // Definice všech tabulek a jejich dat
    const containers = [
      { id: 'beton-prvek-container', title: 'PRVEK' },
      { id: 'beton-pevnost-tlak-container', title: 'PEVNOST V TLAKU' },
      { id: 'beton-pevnost-tah-container', title: 'PEVNOST V TAHU' },
      { id: 'beton-modul-pruznosti-container', title: 'MODUL PRUŽNOSTI' },
      { id: 'beton-mezni-pretvoreni-container', title: 'MEZNÍ PŘETVOŘENÍ' }
    ];

    // Procházení všech kontejnerů
    containers.forEach((container, index) => {
      const containerElement = document.getElementById(container.id);
      if (containerElement) {
        // Najít první tabulku v kontejneru
        const table = containerElement.querySelector('table');
        if (table) {
          // Přidat prázdný řádek mezi tabulkami (kromě první)
          if (index > 0) {
            ws_data.push([]);
          }

          // Přidat data z tabulky
          const rows = table.rows;
          for (let i = 0; i < rows.length; i++) {
            const rowData = [];
            const cells = rows[i].cells;
            
            for (let j = 0; j < cells.length; j++) {
              // Získat čistý text bez HTML tagů
              let cellText = cells[j].textContent.trim();
              
              // Pokud je to číslo, převést na číslo a zaokrouhlit
              if (!isNaN(cellText) && cellText !== '') {
                cellText = Number(parseFloat(cellText).toFixed(3));
              }
              
              rowData.push(cellText);
            }
            ws_data.push(rowData);
          }
        }
      }
    });

    // Kontrola, zda máme nějaká data k exportu
    if (ws_data.length === 0) {
      throw new Error('Žádná data k exportu');
    }

    // Vytvořit list a přidat data
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // Přidat list do sešitu s upraveným názvem (nahradit lomítko pomlčkou)
    const bezpecnyNazevListu = "Beton " + tridaBetonu.replace(/\//g, "-");
    XLSX.utils.book_append_sheet(wb, ws, bezpecnyNazevListu);
    
    // Exportovat soubor
    XLSX.writeFile(wb, "Vystup.xlsx");
  } catch (error) {
    console.error('Chyba při exportu:', error);
    alert('Nepodařilo se exportovat data: ' + error.message);
  }
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
      <p id="modalText" style="text-align: center;"></p>
      <div id="modalImage" style="text-align: center; margin-top: 20px;"></div>
    </div>
  </div>
  <style>
    .formula {
      font-weight: normal;
      font-style: normal;
    }
    .modal-content {
      text-align: center;
    }
  </style>
`;

// Zajistit, že modální okno existuje v DOM
if (!document.getElementById('infoModal')) {
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Funkce pro zobrazení informačního okna
function zobrazitInfo(text, showImage = false) {
  console.log('Zobrazuji info:', text); // Pro debugování
  const modal = document.getElementById('infoModal');
  const modalText = document.getElementById('modalText');
  const modalImage = document.getElementById('modalImage');
  
  if (!modal || !modalText || !modalImage) {
    console.error('Modal elements not found!');
    return;
  }
  
  // Nahradit <i> tagy za <span> s třídou 'formula'
  const formattedText = text.replace(/<i>(.*?)<\/i>/g, '<span class="formula">$1</span>');
  modalText.innerHTML = formattedText;
  
  // Zobrazit nebo skrýt obrázek podle parametru
  if (showImage) {
    // Určit, který obrázek zobrazit na základě názvu hodnoty
    let imagePath = 'Pictures/Pracovni_Diagram_Realny.png'; // výchozí obrázek
    
    // Získat název hodnoty z textu
    const nazevMatch = text.match(/Přetvoření (εc\d+)/);
    if (nazevMatch) {
      const nazev = nazevMatch[1];
      switch(nazev) {
        case 'εc1':
          imagePath = 'Pictures/Pracovni_Diagram_Realny.png';
          break;
        case 'εc2':
          imagePath = 'Pictures/Pracovni_Diagram_Parabolicko_Rektangulární.png';
          break;
        case 'εc3':
          imagePath = 'Pictures/Pracovni_Diagram_Bilineární.png';
          break;
      }
    } else if (text.includes('Mez kluzu')) {
      imagePath = 'Pictures/Pracovní_Diagram_Ocel.png';
    }
    
    modalImage.innerHTML = `<img src="${imagePath}" alt="Pracovní diagram" style="max-width: 100%; height: auto;">`;
    modalImage.style.display = 'block';
  } else {
    modalImage.innerHTML = '';
    modalImage.style.display = 'none';
  }
  
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
