import makePairingsFromText from "https://cdn.jsdelivr.net/npm/wjga-state-pairer@1.0.7/bundle.js";

window.addEventListener("load", () => {
    const filePicker = document.getElementById("filePicker");
    const selectedFileDisplay = document.getElementById("selectedFileDisplay");
    const generateButton = document.getElementById("generateButton");

    filePicker.addEventListener("change", ev => {
        const file = ev.target.files[0];

        if (file && file.name.endsWith(".csv")) {
            selectedFileDisplay.textContent = file.name;
            generateButton.disabled = false;
        } else {
            selectedFileDisplay.textContent = "Invalid file type. Please upload a .csv file";
            generateButton.disabled = true;
        }
    });

    const pairingsContainer = document.getElementById("pairingsContainer");

    generateButton.addEventListener("click", async () => {
        const file = filePicker.files[0];
        const text = await file.text();

        try {
            const pairingsList = makePairingsFromText(text);

            pairingsContainer.innerHTML = "";

            for (const pairings of pairingsList) {
                const divisionContainer = document.createElement("details");

                if (pairings.division) {
                    divisionContainer.innerHTML = `<summary>${pairings.division} Pairings</summary>`;
                }

                for (let day = 1; day <= 2; day++) {
                    const dayContainer = document.createElement("div");
                    dayContainer.innerHTML = `<p>Day ${day}</p>`;
        
                    const pairingsTable = document.createElement("table");
                    pairingsTable.innerHTML = "<tr><th>Pairing</th><th>Players</th></tr>";
        
                    pairings.days[day].forEach((pairing, index) => {
                        const tableRow = document.createElement("tr");
                        tableRow.innerHTML = `<td>${index + 1}</td>`;
        
                        const tableData = document.createElement("td");
        
                        pairing
                            .getPlayers()
                            .filter(player => !player.isGhost)
                            .forEach(player => {
                                const playerData = document.createElement("span");
                                playerData.innerHTML = `<em>D${player.district} | ${player.ranking ? "#" + player.ranking : "EXEMPT"}</em> ${player.name}`;
                                tableData.appendChild(playerData);
                            });
        
                        tableRow.appendChild(tableData);
                        pairingsTable.appendChild(tableRow);
                    });
                    dayContainer.appendChild(pairingsTable);
        
                    divisionContainer.appendChild(dayContainer);
                }

                if (pairings.division) {
                    pairingsContainer.appendChild(divisionContainer);
                } else {
                    pairingsContainer.innerHTML = divisionContainer.innerHTML;
                }
            }
        } catch (err) {
            window.alert(err.message);
        }
    });
});
