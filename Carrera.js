document.getElementById("form-player").addEventListener("submit", function(event) {
  event.preventDefault(); 
  // obtener los valores del formulario
  const playerName = document.getElementById("player-name").value;
  const playerBet = document.getElementById("player-bet").value;
  const horseSelected = document.getElementById("horse-select");
  const horseSelectedValue = horseSelected.value;
  
  // crear una nueva fila en la tabla
  const newRow = document.createElement("tr");
  
  // agregar los valores a las celdas de la fila
  const nameCell = document.createElement("td");
  nameCell.innerText = playerName;
  newRow.appendChild(nameCell);
  
  const betCell = document.createElement("td");
  betCell.innerText = playerBet;
  newRow.appendChild(betCell);
  
  const horseCell = document.createElement("td");
  horseCell.innerText = horseSelected.value;
  newRow.appendChild(horseCell);
  
  // agregar la fila a la tabla
  const resultsTable = document.getElementById("results-table").getElementsByTagName("tbody")[0];
  resultsTable.appendChild(newRow);
});
 
document.getElementById("reset-btn").addEventListener("click", function() {
  const table = document.getElementById("results-table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
});


document.getElementById("select-winner-btn").addEventListener("click", function() {
  const horses = ["Oro", "Espada", "Basto", "Copa"];
  let winnerHorseValue;
  // Crear una ventana emergente
  const modal = document.createElement("div");
  modal.classList.add("modal");
  document.body.appendChild(modal);

  // Crear un contenido para la ventana emergente
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modal.appendChild(modalContent);

  // Crear un título para la ventana emergente
  const modalTitle = document.createElement("h2");
  modalTitle.innerText = "Elegir al ganador";
  modalTitle.classList.add("borde")
  modalContent.appendChild(modalTitle);

  // Crear una lista de los caballos
  const horseList = document.createElement("select");
  horses.forEach(horse => {
    const horseOption = document.createElement("option");
    horseOption.value = horse;
    horseOption.innerText = horse;
    horseList.appendChild(horseOption);
  });
  modalContent.appendChild(horseList);

  //boton cerrar
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "X";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", () => {
    modal.remove();
  });
  modalContent.appendChild(closeButton);


// Crear un botón para seleccionar al ganador
const selectButton = document.createElement("button");
  selectButton.innerText = "Seleccionar ganador";
  selectButton.classList.add("boton");
  selectButton.addEventListener("click", () => {
    winnerHorseValue = horseList.options[horseList.selectedIndex].value;
    if (!winnerHorseValue) {
      alert("Por favor selecciona un caballo ganador");
      return;
}
    // Recorrer la tabla de resultados y actualizar el resultado para cada jugador
    const resultsTable = document.getElementById("results-table").getElementsByTagName("tbody")[0];
    const rows = resultsTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const horseCell = rows[i].getElementsByTagName("td")[2];
      const betCell = rows[i].getElementsByTagName("td")[1];
      const resultCell = document.createElement("td");
      if (horseCell.innerText === winnerHorseValue) {
        resultCell.innerText = "Regala " + betCell.innerText*2;
        resultCell.classList.add("resultado");
      } else {
        resultCell.innerText = "Toma " + betCell.innerText;
        resultCell.classList.add("resultado2");
      }
      rows[i].appendChild(resultCell);
    }
    // Eliminar la ventana emergente
    modal.remove();
  });
modalContent.appendChild(selectButton);
});
