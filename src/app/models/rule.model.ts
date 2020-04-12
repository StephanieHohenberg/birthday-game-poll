export interface Idea {
  text: string;
}

export interface Rule {
  text: string;
  categoryIndex: number;
}

export interface Card {
  categoryIndex: number;
  ruleIndex: number;
}
