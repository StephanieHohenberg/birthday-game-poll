export interface Idea {
  text: string;
}

export interface Rule {
  text: string;
  categoryIndex: number;
}

export interface Card {
  color: string;
  categoryIndex: number;
  ruleIndex: number;
  categoryName: string;
  ruleText: string;
}
