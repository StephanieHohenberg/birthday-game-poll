import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {DrinkingEvent, GameEvent, RandomizerEvent} from '../models/event.model';
import {DB_DRINKING_EVENTS, DB_GAME_EVENTS, DB_RANDOMIZER} from '../db.routes';

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {

  public randomizerRef: AngularFireObject<RandomizerEvent>;
  public gameEventsRef: AngularFireObject<GameEvent>;
  public drinkingEventsRef: AngularFireObject<DrinkingEvent>;

  constructor(public db: AngularFireDatabase) {
    this.randomizerRef = this.db.object<RandomizerEvent>(DB_RANDOMIZER);
    this.gameEventsRef = this.db.object<GameEvent>(DB_GAME_EVENTS);
    this.drinkingEventsRef = this.db.object<DrinkingEvent>(DB_DRINKING_EVENTS);
  }

  public createGameEventNotification(gameEvent: GameEvent): Observable<GameEvent> {
    this.gameEventsRef.update(gameEvent);
    return this.gameEventsRef.valueChanges();
  }

  public createRandomizerNotification(userId: string): Observable<RandomizerEvent> {
    this.randomizerRef.update({userId});
    return this.randomizerRef.valueChanges();
  }

  public fetchRandomizerEvents(): Observable<RandomizerEvent> {
    return this.randomizerRef.valueChanges();
  }

  public fetchGameEvents(): Observable<GameEvent> {
    return this.gameEventsRef.valueChanges();
  }

  public createDrinkingEvent(userIDs: string[]): Observable<DrinkingEvent> {
    this.drinkingEventsRef.update({userIDs});
    return this.drinkingEventsRef.valueChanges();
  }

  public fetchDrinkingEvents(): Observable<DrinkingEvent> {
    return this.drinkingEventsRef.valueChanges();
  }
}
