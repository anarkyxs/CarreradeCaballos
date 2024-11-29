// Manejo del tema (claro/oscuro)
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    // Aplicar tema guardado
    if (this.currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Configurar evento de cambio
    this.themeToggle.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);

      // Agregar animación al cambiar
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    });
  }
}

// Clase para manejar el juego de carreras
class HorseRacing {
  constructor() {
    this.form = document.getElementById('form-player');
    this.resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    this.selectWinnerBtn = document.getElementById('select-winner-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.editingRow = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handlePlayerSubmit(e));
    this.selectWinnerBtn.addEventListener('click', () => this.showWinnerModal());
    this.resetBtn.addEventListener('click', () => this.resetGame());
  }

  handlePlayerSubmit(event) {
    event.preventDefault();
    
    const playerName = document.getElementById('player-name').value;
    const playerBet = document.getElementById('player-bet').value;
    const selectedHorse = document.getElementById('horse-select').value;
    
    if (this.editingRow) {
      // Modo edición
      this.updateRow(this.editingRow, playerName, playerBet, selectedHorse);
      this.editingRow = null;
      this.form.querySelector('button[type="submit"]').textContent = 'Registrar Apuesta';
    } else {
      // Modo nuevo registro
      this.addNewRow(playerName, playerBet, selectedHorse);
    }
    
    this.form.reset();
    document.getElementById('player-name').focus();
  }

  addNewRow(playerName, playerBet, selectedHorse) {
    const newRow = document.createElement('tr');
    newRow.classList.add('animate__animated', 'animate__fadeInDown');
    
    const cells = [
      { text: playerName, icon: '👤' },
      { text: playerBet, icon: '💰' },
      { text: selectedHorse, icon: this.getHorseIcon(selectedHorse) }
    ];
    
    cells.forEach(cell => {
      const td = document.createElement('td');
      td.innerHTML = `${cell.icon} ${cell.text}`;
      newRow.appendChild(td);
    });

    // Agregar celda para resultado (inicialmente vacía)
    const resultCell = document.createElement('td');
    newRow.appendChild(resultCell);
    
    // Agregar celda de acciones
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('actions-cell');
    
    const editButton = document.createElement('button');
    editButton.innerHTML = '✏️';
    editButton.classList.add('action-button');
    editButton.title = 'Editar';
    editButton.addEventListener('click', () => this.editRow(newRow));
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '🗑️';
    deleteButton.classList.add('action-button');
    deleteButton.title = 'Eliminar';
    deleteButton.addEventListener('click', () => this.deleteRow(newRow));
    
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    newRow.appendChild(actionsCell);
    
    this.resultsTable.appendChild(newRow);
  }

  updateRow(row, playerName, playerBet, selectedHorse) {
    const cells = row.getElementsByTagName('td');
    cells[0].innerHTML = `👤 ${playerName}`;
    cells[1].innerHTML = `💰 ${playerBet}`;
    cells[2].innerHTML = `${this.getHorseIcon(selectedHorse)} ${selectedHorse}`;
    
    // Si hay un resultado previo, recalcular con el nuevo monto
    if (cells[3].textContent) {
      const isWinner = cells[3].classList.contains('resultado');
      if (isWinner) {
        cells[3].innerHTML = `🎉 Gana ${playerBet * 2}`;
      } else {
        cells[3].innerHTML = `😢 Pierde ${playerBet}`;
      }
    }
  }

  editRow(row) {
    const cells = row.getElementsByTagName('td');
    const playerName = cells[0].textContent.trim().split(' ')[1];
    const playerBet = cells[1].textContent.trim().split(' ')[1];
    const horseName = cells[2].textContent.trim().split(' ')[1];
    
    document.getElementById('player-name').value = playerName;
    document.getElementById('player-bet').value = playerBet;
    document.getElementById('horse-select').value = horseName;
    
    this.editingRow = row;
    this.form.querySelector('button[type="submit"]').textContent = 'Actualizar Apuesta';
    document.getElementById('player-name').focus();
  }

  deleteRow(row) {
    row.classList.add('animate__animated', 'animate__fadeOutRight');
    setTimeout(() => row.remove(), 500);
  }

  getHorseIcon(horseName) {
    const icons = {
      'Oro': '🏆',
      'Espada': '⚔️',
      'Basto': '🌟',
      'Copa': '🏆'
    };
    return icons[horseName] || '🐎';
  }

  showWinnerModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'animate__animated', 'animate__fadeIn');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'animate__animated', 'animate__zoomIn');
    
    const title = document.createElement('h2');
    title.innerText = '🏆 Elegir Ganador';
    title.classList.add('modal-title');
    
    const select = document.createElement('select');
    select.classList.add('winner-select');
    ['Oro', 'Espada', 'Basto', 'Copa'].forEach(horse => {
      const option = document.createElement('option');
      option.value = horse;
      option.innerHTML = `${this.getHorseIcon(horse)} ${horse}`;
      select.appendChild(option);
    });
    
    const selectButton = document.createElement('button');
    selectButton.innerText = 'Confirmar Ganador';
    selectButton.classList.add('boton');
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.classList.add('close-button');
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(select);
    modalContent.appendChild(selectButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    closeButton.addEventListener('click', () => {
      modal.classList.add('animate__fadeOut');
      setTimeout(() => modal.remove(), 500);
    });
    
    selectButton.addEventListener('click', () => {
      const winnerHorse = select.value;
      this.updateResults(winnerHorse);
      modal.classList.add('animate__fadeOut');
      setTimeout(() => modal.remove(), 500);
    });
  }

  updateResults(winnerHorse) {
    const rows = this.resultsTable.getElementsByTagName('tr');
    
    for (let row of rows) {
      const cells = row.getElementsByTagName('td');
      if (cells.length < 4) continue;

      const horseCell = cells[2];
      const horseName = horseCell.textContent.trim().split(' ')[1];
      const betAmount = parseInt(cells[1].textContent.trim().split(' ')[1]);
      
      const resultCell = cells[3];
      resultCell.classList.remove('resultado', 'resultado2', 'animate__animated', 'animate__fadeIn');
      void resultCell.offsetWidth; // Forzar reflow para reiniciar la animación
      resultCell.classList.add('animate__animated', 'animate__fadeIn');
      
      if (horseName === winnerHorse) {
        resultCell.innerHTML = `🎉 Gana ${betAmount * 2}`;
        resultCell.classList.add('resultado');
      } else {
        resultCell.innerHTML = `😢 Pierde ${betAmount}`;
        resultCell.classList.add('resultado2');
      }
    }
  }

  resetGame() {
    const rows = Array.from(this.resultsTable.getElementsByTagName('tr'));
    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add('animate__animated', 'animate__fadeOutRight');
      }, index * 100);
    });
    
    setTimeout(() => {
      while (this.resultsTable.firstChild) {
        this.resultsTable.removeChild(this.resultsTable.firstChild);
      }
      // Resetear el formulario si estaba en modo edición
      if (this.editingRow) {
        this.editingRow = null;
        this.form.reset();
        this.form.querySelector('button[type="submit"]').textContent = 'Registrar Apuesta';
      }
    }, rows.length * 100 + 500);
  }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new HorseRacing();
});
