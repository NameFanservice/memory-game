export type CardState = 'hidden' | 'flipped' | 'matched';

export interface CardData {
  id: number;
  value: string;
  state: CardState;
}
