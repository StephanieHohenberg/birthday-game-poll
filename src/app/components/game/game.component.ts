import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {PartyAnimalService} from '../../services/party-animal.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {CATEGORIES, COOKIE_KEY} from '../../app.const';
import {Card, Idea} from '../../models/rule.model';
import {IdeaHttpService} from '../../services/idea-http.service';
import {RegistrationDialogComponent} from '../dialogs/registration-dialog/registration-dialog.component';
import {mapStringToUser, mapUsertoString, User} from '../../models/user.model';
import {DisplayCardDialogComponent} from '../dialogs/display-card-dialog/display-card-dialog.component';
import {DrinkingCommandDialogComponent} from '../dialogs/drinking-command-dialog/drinking-command-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  public categories = CATEGORIES;
  public partyAnimals = [];
  public loggedInUserId;
  private unsubscribe$ = new Subject();

  constructor(public partyAnimalService: PartyAnimalService,
              public dialog: MatDialog,
              private ideaService: IdeaHttpService) {
  }

  public ngOnInit(): void {
    if (this.partyAnimalService.isLoggedInUserGameMaster() === undefined
        && !this.userCookieCouldBeFetched()) {
      this.openRegistrationDialog();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnloadHandler(event): void {
    if (this.loggedInUserId) {
      this.partyAnimalService.leaveSession();
    }
  }

  private openRegistrationDialog(): void {
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {width: '250px'});
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: {name, isDrinking}) => {
        if (result === undefined) {
          this.openRegistrationDialog();
        } else {
          this.createUserAndFetchOtherUsers(result);
          this.setCookie(result);
          this.fetchRules();
        }
      });
  }

  private createUserAndFetchOtherUsers(result: {name, isDrinking}): void {
    this.partyAnimalService.createUser(result.name, result.isDrinking)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(animals => {
        this.loggedInUserId = this.partyAnimalService.getIdOfLoggedInUser();
        this.partyAnimals = [...animals];
      });
  }

  private fetchRules(): void {
    for (const c of this.categories) {
      this.ideaService.fetchIdeas(c.name)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((ideas: Idea[]) => {
          c.ideas = [...ideas].map(idea => ({text: `"${idea.text}"`, isDrinkingRule: idea.isDrinkingRule}));
          if (!this.partyAnimalService.isLoggedInUserDrinking()) {
            c.ideas = c.ideas.filter(idea => !idea.isDrinkingRule);
            if (c.ideas.length === 0) {
              c.color = 'grey';
            }
          }
        });
    }
  }

  private setCookie(result: {name, isDrinking}): void {
    const userString = mapUsertoString(result);
    localStorage.setItem(COOKIE_KEY, userString);
  }

  private userCookieCouldBeFetched(): boolean {
    const userString = localStorage.getItem(COOKIE_KEY);
    console.log(userString);
    if (userString) {
      this.createUserAndFetchOtherUsers(mapStringToUser(userString));
      this.fetchRules();
      return true;
    } else {
      return false;
    }
  }

}
