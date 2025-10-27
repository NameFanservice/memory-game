import type { CardData, CardState } from './types';

export class Card {
  private element: HTMLDivElement;
  private front: HTMLDivElement;
  private back: HTMLDivElement;
  public data: CardData;
  private onClick: (card: Card) => void;

  constructor(data: CardData, onClick: (card: Card) => void) {
    this.data = data;
    this.onClick = onClick;

    this.element = document.createElement('div');
    this.element.classList.add('card');
    this.element.addEventListener('click', () => this.handleClick());

    this.front = document.createElement('div');
    this.front.classList.add('front');
    this.front.textContent = data.value;

    this.back = document.createElement('div');
    this.back.classList.add('back');
    this.back.textContent = '?';

    this.element.appendChild(this.front);
    this.element.appendChild(this.back);

    this.updateVisual(this.data.state);
  }

  private handleClick() {
    if (this.data.state === 'hidden') {
      this.onClick(this);
    }
  }

  public updateVisual(state: CardState) {
    this.data.state = state;

    this.element.classList.remove('flipped', 'matched');
    if (state === 'flipped' || state === 'matched') {
      this.element.classList.add('flipped');
    }
    if (state === 'matched') {
      this.element.classList.add('matched');
    }
  }

  public getElement(): HTMLDivElement {
    return this.element;
  }
}
