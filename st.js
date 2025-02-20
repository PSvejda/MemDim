

function generovatTabulky() {
    var typ = document.getElementById('typ').value;
    var velikost = document.getElementById('velikost').value;
    var filtrSelect = document.getElementById('filtr');
    var selectedFilter = filtrSelect.value;
    filtrSelect.innerHTML = '';

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
            let prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění, dimenze, vlastnosti, ohyb, tlak;

            for (let row = startRow; row <= endRow; row++) {
                let velikostValue = sheet[`B${row}`] ? sheet[`B${row}`].v : undefined;
                let tloustkaValue = sheet[`C${row}`] ? sheet[`C${row}`].v : undefined;

                if (String(velikostValue) === velikost) {
                    if (typ === "TR" && (tloustkaValue === undefined || String(tloustkaValue) !== tloustka)) {
                        continue;
                    }

                    if (typ === "TR") {
                        ({ prvek, dimenzeTR, plocha, vlastnostiTR, zatřídění } = generovatDataproTR(sheet, row, typ, velikostValue, tloustkaValue));
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
            } else {
                zobrazTabulky(prvek, dimenze, plocha, vlastnosti, ohyb, tlak, filtr);
            }

            // Zobrazíme filtrační kontejner a tlačítka pro export pouze pokud jsou data nalezena
            document.getElementById('filter-container').style.display = 'block';
            document.getElementById('export_button-container').style.display = 'flex';
        });
}