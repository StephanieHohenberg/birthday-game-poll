export interface GameEvent {
  categoryIndex: number;
  ruleIndex: number;
}

export interface DrinkingEvent {
  userIDs: string[];
}

export interface RandomizerEvent {
  userId: string;
}
