document.getElementById("generateBtn").addEventListener("click", function() {
    const type = document.getElementById("type").value;
    const size = document.getElementById("size").value;

    // Generate data based on selected type and size
    let tableData = [
        {
            element: type,
            weight: "80",
            g: "G",
            h: "h",
            b: "b",
            tw: "tw",
            tf: "tf",
            r: "r",
            d: "d",
            A: "A",
            Avz: "Avz",
            Iy: "Iy",
            Wy: "Wy",
            Wpl_y: "Wpl,y",
            iy: "iy",
            Iz: "Iz",
            Wz: "Wz",
            Wpl_z: "Wpl,z",
            iz: "iz",
            It: "It",
            Iw: "Iw",
            S235: "S235",
            S275: "S275",
            S355: "S355",
            S460: "S460"
        }
    ];

    let tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = ""; // Clear previous data

    tableData.forEach(row => {
        let tr = document.createElement("tr");
        for (let key in row) {
            let td = document.createElement("td");
            td.textContent = row[key];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
});
