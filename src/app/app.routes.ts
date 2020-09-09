import {PollFormComponent} from './components/poll-form/poll-form.component';
import {GameComponent} from './components/game/game.component';

export const ROUTES_CONFIG = [
  {path: '', component: GameComponent},
  {path: 'poll', component: PollFormComponent},
  {path: 'session', component: GameComponent},
  {path: '**', redirectTo: '/'}
];

