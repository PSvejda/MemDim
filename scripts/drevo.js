let drevoData = [];
let currentDrevoData = {}; // Store the currently displayed data for export

// Function to load the Excel file
async function loadDrevoExcel() {
  try {
    const response = await fetch('Drevo.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Assuming the data is in the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert sheet to JSON (array of arrays)
    drevoData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  } catch (error) {
    console.error('Error loading Drevo.xlsx:', error);
  }
}

// Function to generate wood property tables
function generovatDrevoTabulky() {
  console.log('Generating wood tables...');
  const selectedClass = document.getElementById('drevo-trida').value;
  const filtr = document.getElementById('drevo-filtr').value; // Get the current filter

  // Show the filter and export buttons
  document.getElementById('drevo-filter-container').style.display = 'block';
  document.getElementById('drevo-export-container').style.display = 'flex';

  // Find the column index for the selected class
  let classColumnIndex = -1;
  if (drevoData.length >= 3) {
    const headers = drevoData[2]; // Assuming headers are in the third row
    classColumnIndex = headers.indexOf(selectedClass);
  }

  if (classColumnIndex === -1) {
    console.error('Selected class not found in data.');
    // Optionally display an error message to the user
    return;
  }

  // Define the properties for each table based on the image/OCR and units
  const pevnostProps = [
    { prop: 'fm,k', nazev: 'Pevnost v ohybu', znacka: 'f<sub>m,k</sub>', jednotky: 'N/mm²' },
    { prop: 'ft,0,k', nazev: 'Pevnost v tahu podél vláken', znacka: 'f<sub>t,0,k</sub>', jednotky: 'N/mm²' },
    { prop: 'ft,90,k', nazev: 'Pevnost v tahu kolmo k vláknům', znacka: 'f<sub>t,90,k</sub>', jednotky: 'N/mm²' },
    { prop: 'fc,0,k', nazev: 'Pevnost v tlaku podél vláken', znacka: 'f<sub>c,0,k</sub>', jednotky: 'N/mm²' },
    { prop: 'fc,90,k', nazev: 'Pevnost v tlaku kolmo k vláknům', znacka: 'f<sub>c,90,k</sub>', jednotky: 'N/mm²' },
    { prop: 'fv,k', nazev: 'Pevnost ve smyku', znacka: 'f<sub>v,k</sub>', jednotky: 'N/mm²' }
  ];
  const modulPruznostiProps = [
    { prop: 'E0,mean', nazev: 'Střední modul pružnosti podél vláken', znacka: 'E<sub>0,mean</sub>', jednotky: 'kN/mm²' },
    { prop: 'E0,05', nazev: 'Modul pružnosti podél vláken (5% kvantil)', znacka: 'E<sub>0,05</sub>', jednotky: 'kN/mm²' },
    { prop: 'E90,mean', nazev: 'Střední modul pružnosti kolmo k vláknům', znacka: 'E<sub>90,mean</sub>', jednotky: 'kN/mm²' },
    { prop: 'Gmean', nazev: 'Střední modul pružnosti ve smyku', znacka: 'G<sub>mean</sub>', jednotky: 'kN/mm²' }
  ];
  const hustotaProps = [
    { prop: 'pk', nazev: 'Charakteristická objemová hmotnost', znacka: 'ρ<sub>k</sub>', jednotky: 'kg/m³' },
    { prop: 'pmean', nazev: 'Střední objemová hmotnost', znacka: 'ρ<sub>mean</sub>', jednotky: 'kg/m³' }
  ];

  // Extract data for each table using the new structure
  const pevnostData = extractAndStructureDrevoData(pevnostProps, classColumnIndex);
  const modulPruznostiData = extractAndStructureDrevoData(modulPruznostiProps, classColumnIndex);
  const hustotaData = extractAndStructureDrevoData(hustotaProps, classColumnIndex);

  // Store data for filtering and export
  currentDrevoData = {
      pevnost: pevnostData,
      modulPruznosti: modulPruznostiData,
      hustota: hustotaData
  };

  // Display tables based on the current filter
  zobrazitDrevoTabulky(currentDrevoData, filtr);
}

// Helper function to extract and structure data for a given set of properties
function extractAndStructureDrevoData(propertiesConfig, columnIndex) {
    const data = [];
    if (drevoData.length < 3) return data; // Not enough data

    // Mapování řádků na vlastnosti
    const rowMapping = {
        'fm,k': 3,      // řádek 3 pro fm,k
        'ft,0,k': 4,    // řádek 4 pro ft,0,k
        'ft,90,k': 5,   // řádek 5 pro ft,90,k
        'fc,0,k': 6,    // řádek 6 pro fc,0,k
        'fc,90,k': 7,   // řádek 7 pro fc,90,k
        'fv,k': 8,      // řádek 8 pro fv,k
        'E0,mean': 9,   // řádek 9 pro E0,mean
        'E0,05': 10,    // řádek 10 pro E0,05
        'E90,mean': 11, // řádek 11 pro E90,mean
        'Gmean': 12,    // řádek 12 pro Gmean
        'pk': 13,       // řádek 13 pro pk
        'pmean': 14     // řádek 14 pro pmean
    };

    propertiesConfig.forEach(propConfig => {
        const rowIndex = rowMapping[propConfig.prop];
        let value = 'N/A';
        if (rowIndex !== undefined && drevoData[rowIndex] && drevoData[rowIndex][columnIndex] !== undefined) {
            value = drevoData[rowIndex][columnIndex];
        }

        // Add data in the structure similar to beton.js
        data.push({
            nazev: propConfig.nazev,
            znacka: propConfig.znacka,
            hodnota: value,
            jednotky: propConfig.jednotky
        });
    });

    return data;
}

// Function to display wood tables based on filter
function zobrazitDrevoTabulky(data, filtr) {
    // Define containers and their corresponding data keys
    const containers = {
        pevnost: { id: 'drevo-pevnost-container', title: 'PEVNOST', data: data.pevnost },
        modulPruznosti: { id: 'drevo-modul-pruznosti-container', title: 'MODUL PRUŽNOSTI', data: data.modulPruznosti },
        hustota: { id: 'drevo-hustota-container', title: 'HUSTOTA', data: data.hustota }
    };

    // Get the main container for wood tables
    const mainContainer = document.getElementById('drevo-tables-container');
    // Do not clear mainContainer here, as table containers are already in index.html

    // Show or hide containers based on filter
    Object.entries(containers).forEach(([key, container]) => {
        const element = document.getElementById(container.id);
        if (element) {
            if (filtr === 'all' || filtr === key) {
                // Clear previous content and create/append the table
                element.innerHTML = '';
                element.appendChild(vytvorDrevoTabulku(container.data, container.title, container.id));
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        }
    });
}

// Helper function to create table HTML (similar to vytvorTabulku in beton.js)
function vytvorDrevoTabulku(data, title, containerId) {
    const table = document.createElement('table');

    // Determine if data includes units (which it should based on our structure)
    const maJednotky = data.length > 0 && data[0].hasOwnProperty('jednotky');
    const pocetSloupcu = maJednotky ? 4 : 3; // Veličina, Značka, Hodnota, (Jednotky)

    // Add table header
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
        return `
          <tr>
            <td>${row.nazev}</td>
            <td>${row.znacka}</td>
            <td>${row.hodnota}</td>
            ${maJednotky ? `<td>${row.jednotky}</td>` : ''}
          </tr>
        `;
      }).join('')}
    </tbody>
  `;

    return table;
}

// Function to filter wood tables
function filterDrevoTables() {
  const filtr = document.getElementById('drevo-filtr').value;
  zobrazitDrevoTabulky(currentDrevoData, filtr);
}

// Placeholder functions for export (to be implemented)
function exportDrevoKomplet() {
  console.log('Exporting all wood data...');
  // Implement export logic for all data
  if (!currentDrevoData || Object.keys(currentDrevoData).length === 0) {
      alert('Nejsou k dispozici žádná data k exportu.');
      return;
  }

  const wb = XLSX.utils.book_new();

  // Add each table data to a separate sheet
  Object.entries(currentDrevoData).forEach(([key, data]) => {
      // Format data for export: array of objects with headers
      const exportData = data.map(item => ({
          'Veličina': item.nazev,
          'Hodnota': item.hodnota,
          'Jednotky': item.jednotky || '-' // Handle cases with no units
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, key.charAt(0).toUpperCase() + key.slice(1)); // Sheet name from key
  });

  // Get the selected wood class to include in the filename
  const selectedClass = document.getElementById('drevo-trida').value || 'Drevo';
  const filename = `Drevo_${selectedClass}_Komplet.xlsx`;

  XLSX.writeFile(wb, filename);
}

function exportDrevoFiltr() {
  console.log('Exporting filtered wood data...');
  // Implement export logic for filtered data
   const filtr = document.getElementById('drevo-filtr').value;
    if (!currentDrevoData || Object.keys(currentDrevoData).length === 0) {
      alert('Nejsou k dispozici žádná data k exportu.');
      return;
  }

   if (filtr === 'all') {
        exportDrevoKomplet(); // If filter is 'all', export all data
        return;
   }

   const wb = XLSX.utils.book_new();
   const filteredData = currentDrevoData[filtr];

   if (filteredData) {
       // Format data for export
        const exportData = filteredData.map(item => ({
            'Veličina': item.nazev,
            'Hodnota': item.hodnota,
            'Jednotky': item.jednotky || '-'
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, filtr.charAt(0).toUpperCase() + filtr.slice(1)); // Sheet name from filter value

         // Get the selected wood class to include in the filename
        const selectedClass = document.getElementById('drevo-trida').value || 'Drevo';
        const filename = `Drevo_${selectedClass}_${filtr.charAt(0).toUpperCase() + filtr.slice(1)}.xlsx`;

        XLSX.writeFile(wb, filename);

   } else {
       alert('Žádná data pro vybraný filtr k exportu.');
   }


}


// Load the Excel file when the page loads (or when the Drevo section is shown)
// For now, let's load it on script load
loadDrevoExcel(); 