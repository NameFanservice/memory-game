import { Game } from './game/Game';
import { Card } from './game/Cards';

const baseSymbols = ['🍎', '🍌', '🍇', '🍒', '🍋', '🍉', '🥝', '🍓'];

let game: Game;
let timerInterval: number | null = null;
let seconds = 0;

const board = document.getElementById('game-board') as HTMLDivElement;
const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
const movesDisplay = document.getElementById('moves') as HTMLDivElement;
const timerDisplay = document.getElementById('timer') as HTMLDivElement;
const winModal = document.getElementById('win-modal') as HTMLDivElement;
const winText = document.getElementById('win-text') as HTMLParagraphElement;
const playAgainBtn = document.getElementById('play-again-btn') as HTMLButtonElement;
const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement;

function startTimer() {
  stopTimer();
  seconds = 0;
  timerDisplay.textContent = `Time: 0 s`;
  timerInterval = window.setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds} s`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function showWinModal() {
  stopTimer();
  winText.textContent = `Вы нашли все пары за ${game.moves} ходов и ${seconds} секунд!`;
  winModal.classList.add('active');
}

function hideWinModal() {
  winModal.classList.remove('active');
}

function renderBoard() {
  board.innerHTML = '';
  const cardComponents: Card[] = [];

  game.cards.forEach((cardData) => {
    const card = new Card(cardData, (clickedCard: Card) => {
      game.flipCard(clickedCard.data.id);

      game.cards.forEach((c) => {
        const comp = cardComponents.find((cc) => cc.data.id === c.id);
        if (comp) comp.updateVisual(c.state);
      });

      movesDisplay.textContent = `Moves: ${game.moves}`;
      if (game.moves === 1 && !timerInterval) startTimer();

      if (game.isGameOver()) {
        setTimeout(showWinModal, 400);
      }
    });

    card.getElement().style.animationDelay = `${Math.random() * 0.5}s`;
    board.appendChild(card.getElement());
    cardComponents.push(card);
  });
}

function restartGame() {
  board.classList.add('fade-out');
  setTimeout(() => {
    const pairCount = Number(difficultySelect.value);
    const symbols = baseSymbols.slice(0, pairCount);
    game = new Game([...symbols, ...symbols]);
    movesDisplay.textContent = 'Moves: 0';
    stopTimer();
    renderBoard();
    board.classList.remove('fade-out');
  }, 300);
}

restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', () => {
  hideWinModal();
  restartGame();
});

restartGame();
