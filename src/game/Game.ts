import type { CardData, CardState } from './types';

export class Game {
  cards: CardData[];
  flippedCards: CardData[];
  isBusy: boolean;
  moves: number;

  constructor(symbols: string[]) {
    this.cards = this.shuffle(
      symbols.map((symbol, index): CardData => ({
        id: index,
        value: symbol,
        state: 'hidden' as CardState,
      }))
    );
    this.flippedCards = [];
    this.isBusy = false;
    this.moves = 0;
  }

  private shuffle(array: CardData[]): CardData[] {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  flipCard(cardId: number) {
    if (this.isBusy) return;
    const card = this.cards.find((c) => c.id === cardId);
    if (!card || card.state !== 'hidden') return;

    card.state = 'flipped';
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkMatch();
    }
  }

  private checkMatch() {
    const [first, second] = this.flippedCards;
    this.isBusy = true;

    if (first.value === second.value) {
      first.state = 'matched';
      second.state = 'matched';
      this.resetAfterDelay();
    } else {
      setTimeout(() => {
        first.state = 'hidden';
        second.state = 'hidden';
        this.resetAfterDelay();
      }, 1000);
    }
  }

  private resetAfterDelay() {
    this.flippedCards = [];
    this.isBusy = false;
  }

  isGameOver(): boolean {
    return this.cards.every((card) => card.state === 'matched');
  }

  restart() {
    this.cards.forEach((card) => (card.state = 'hidden'));
    this.cards = this.shuffle(this.cards);
    this.flippedCards = [];
    this.isBusy = false;
    this.moves = 0;
  }
}
