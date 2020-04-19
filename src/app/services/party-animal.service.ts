import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {DB_GAME_MASTERS, DB_PARTY_ANIMALS} from '../db.routes';
import {User} from '../models/user.model';
import * as uuid from 'uuid';
import ThenableReference = firebase.database.ThenableReference;

@Injectable({
  providedIn: 'root'
})
export class PartyAnimalService {

  public usersRef: AngularFireList<User>;
  public adminsRef: AngularFireList<User>;
  public loggedInUser: User;
  public loggedInUserRef: ThenableReference;
  private admins: string[] = ['Stephie', 'Marco', 'Sarah']; // TODO: in DB speichern?

  constructor(public db: AngularFireDatabase) {
    this.usersRef = this.db.list<User>(DB_PARTY_ANIMALS);
    this.adminsRef = this.db.list<User>(DB_GAME_MASTERS);
  }

  public createUser(name: string, isDrinking: boolean, userId: string | undefined): Observable<User[]> {
    const id = userId ? userId : uuid.v4();
    this.loggedInUser = {id, name, isDrinking};
    this.loggedInUserRef = this.usersRef.push(this.loggedInUser);
    return this.usersRef.valueChanges();
  }

  public leaveSession(): void {
    this.usersRef.remove(this.loggedInUserRef.key);
  }

  public fetchUsers(): Observable<User[]> {
    return this.usersRef.valueChanges();
  }

  public isLoggedInUserGameMaster(): boolean {
    return this.loggedInUserRef && this.admins.indexOf(this.loggedInUser.name) > -1;
  }

  public isLoggedInUserDrinking(): boolean {
    return this.loggedInUser && this.loggedInUser.isDrinking;
  }

  public getIdOfLoggedInUser(): string {
    return this.loggedInUser.id;
  }
}
