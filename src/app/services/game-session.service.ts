import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {GameEvent, RandomizerEvent} from '../models/event.model';
import {DB_EVENTS, DB_RANDOMIZER} from '../db.routes';

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {

  public eventsRef: AngularFireObject<GameEvent>;
  public randomizerRef: AngularFireObject<RandomizerEvent>;

  constructor(public db: AngularFireDatabase) {
    this.eventsRef = this.db.object<GameEvent>(DB_EVENTS);
    this.randomizerRef = this.db.object<RandomizerEvent>(DB_RANDOMIZER);
  }

  public createGameEventNotification(gameEvent: GameEvent): Observable<GameEvent> {
    this.eventsRef.update(gameEvent);
    return this.eventsRef.valueChanges();
  }

  public createRandomizerNotification(userIndex: number): Observable<RandomizerEvent> {
    this.randomizerRef.update({userIndex});
    return this.randomizerRef.valueChanges();
  }

  public fetchRandomizerEvents(): Observable<RandomizerEvent> {
    return this.randomizerRef.valueChanges();
  }

  public fetchGameEvents(): Observable<GameEvent> {
    return this.eventsRef.valueChanges();
  }
}
