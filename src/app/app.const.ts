import {Category} from './models/category.model';

export const CATEGORIES: Category[] = [
  {name: 'SOCIAL_DRINKING', color: 'red', ideas: []},
  {name: 'INTERACTIVE_CHALLENGES', color: 'orange', ideas: []},
  {name: 'GAMES', color: 'blue', ideas: []},
  {name: 'ICEBREAKER', color: 'green', ideas: []}
];

export const RULE_CHANGE_SECS = 5000;
export const SEND_BUTTON_DELAY_SECS = 800;
export const RANDOMIZER_SECS = 200;
export const COLORS = ['red', 'orange', 'blue', 'green'];

export const EVENT_RANDOMIZER_START = 'EVENT_RANDOMIZER_START';
export const EVENT_RANDOMIZER_STOP = 'EVENT_RANDOMIZER_STOP';
export const EVENT_CARD_PICKED = 'EVENT_CARD_PICKED';

export const CARD_AMOUNT = 6;
export const PATH_IMG_CARD_BACK = './../../../../assets/card_';
