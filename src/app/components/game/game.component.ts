import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {PartyAnimalService} from '../../services/party-animal.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {CATEGORIES, COOKIE_KEY_DRINKING, COOKIE_KEY_ID, COOKIE_KEY_NAME} from '../../app.const';
import {Idea} from '../../models/rule.model';
import {IdeaHttpService} from '../../services/idea-http.service';
import {RegistrationDialogComponent} from '../dialogs/registration-dialog/registration-dialog.component';
import {UserCookie} from '../../models/user.model';

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
    if (this.loggedInUserId === undefined) {
      const cookie = this.fetchCookie();
      this.openRegistrationDialog(cookie);
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

  private openRegistrationDialog(cookie: UserCookie): void {
    this.loggedInUserId = cookie?.id;
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {
      data: {name: cookie?.name, drinkingIndex: cookie?.drinkingIndex}
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: { name: string, drinkingIndex: number }) => {
        if (result === undefined) {
          this.openRegistrationDialog(cookie);
        } else {
          this.createUserAndFetchOtherUsers(result);
          this.fetchRules();
        }
      });
  }

  private createUserAndFetchOtherUsers(result: { name: string, drinkingIndex: number }): void {
    this.partyAnimalService.createUser(result.name, result.drinkingIndex > 0, this.loggedInUserId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(animals => {
        this.loggedInUserId = this.partyAnimalService.getIdOfLoggedInUser();
        this.setCookie(result.name, result.drinkingIndex, this.loggedInUserId);
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

  private setCookie(name: string, drinkingIndex: number, userId: string): void {
    localStorage.setItem(COOKIE_KEY_NAME, name);
    localStorage.setItem(COOKIE_KEY_DRINKING, `${drinkingIndex}`);
    localStorage.setItem(COOKIE_KEY_ID, userId);
  }

  private fetchCookie(): UserCookie {
    if (localStorage.length > 1) {
      const name = localStorage.getItem(COOKIE_KEY_NAME);
      const drinkingIndex = localStorage.getItem(COOKIE_KEY_DRINKING) ? +localStorage.getItem(COOKIE_KEY_DRINKING) : undefined;
      const userId = localStorage.getItem(COOKIE_KEY_ID);
      return {name, drinkingIndex, id: userId};
    }
    return undefined;
  }

}
