import {Category} from './models/category.model';

export const CATEGORIES: Category[] = [
  {name: 'SOCIAL_DRINKING', color: 'red', ideas: []},
  {name: 'INTERACTIVE_CHALLENGES', color: 'orange', ideas: []},
  {name: 'GAMES', color: 'blue', ideas: []},
  {name: 'ICEBREAKER', color: 'green', ideas: []}
];

export const SEND_BUTTON_DELAY_SECS = 800;
export const RANDOMIZER_SECS = 200;
export const RANDOMIZER_BLINKING_SECS_TOTAL = 2500;
export const BLINKING_SECS_INTERVAL = 400;
export const TIMER_SECS_INTERVAL = 1000;
export const TIMER_SECS_TOTAL = 10;
export const COLORS = ['red', 'orange', 'blue', 'green'];

export const EVENT_RANDOMIZER_START = 'EVENT_RANDOMIZER_START';
export const EVENT_RANDOMIZER_STOP = 'EVENT_RANDOMIZER_STOP';
export const EVENT_CARD_PICKED = 'EVENT_CARD_PICKED';

export const COOKIE_KEY = 'StayHomePlayer';

export const CARD_AMOUNT = 4;
export const PATH_IMG_CARD_BACK = './../../../../assets/card_';
export const PATH_IMG_CARD_FRONT = './../../../../assets/card_front_';
