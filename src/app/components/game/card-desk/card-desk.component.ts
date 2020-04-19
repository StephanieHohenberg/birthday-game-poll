import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {map, skip, takeUntil} from 'rxjs/operators';
import {GameEvent, RandomizerEvent} from '../../../models/event.model';
import {GameSessionService} from '../../../services/game-session.service';
import {interval, Subject, Subscription} from 'rxjs';
import {Card, Idea} from '../../../models/rule.model';
import {BLINKING_SECS_INTERVAL, TIMER_SECS_INTERVAL, TIMER_SECS_TOTAL} from '../../../app.const';
import {Category} from '../../../models/category.model';
import {MatDialog} from '@angular/material/dialog';
import {DisplayCardDialogComponent} from '../../dialogs/display-card-dialog/display-card-dialog.component';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-card-desk',
  templateUrl: './card-desk.component.html',
  styleUrls: ['./card-desk.component.scss'],
  providers: [MatDialog],
})
export class CardDeskComponent implements OnInit, OnDestroy {

  @Input() public myId: string;
  @Input() public categories: Category[] = [];
  @Input() public partyAnimals: User[] = [];
  public hovered = -1;
  public blinking = -1;
  public disabled = true;
  public timer = TIMER_SECS_TOTAL;
  private unsubscribe$ = new Subject();
  private blinkingSubscription: Subscription;
  private timerSubscription: Subscription;
  private lastTurnUserIndex: number;


  constructor(private gameSessionService: GameSessionService, public dialog: MatDialog) {
  }

  public ngOnInit(): void {
    this.fetchRandomizerEvents();
    this.fetchGameEvents();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onPickCategorizedCard(categoryIndex: number, ideas: Idea[]): void {
    if (!this.disabled && ideas.length > 0) {
      this.stopBlinking();
      this.stopTimer();
      this.disabled = true;
      const ruleIndex = Math.floor(Math.random() * ideas.length);
      this.gameSessionService.createGameEventNotification({categoryIndex, ruleIndex});
    }
  }

  public startBlinking(index: number): void {
    if (!this.disabled) {
      this.blinking = index;
      this.blinkingSubscription = interval(BLINKING_SECS_INTERVAL)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() =>
          this.blinking = this.blinking < (this.categories.length - 1) ? this.blinking + 1 : 0);
    }
  }

  public stopBlinking(): void {
    if (this.blinkingSubscription) {
      this.blinkingSubscription.unsubscribe();
      this.blinking = -1;
    }
  }

  private startTimer(): void {
    this.timer = TIMER_SECS_TOTAL;
    this.timerSubscription = interval(TIMER_SECS_INTERVAL)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.timer--;
        if (this.timer === 0) {
          this.onPickCategorizedCard(this.blinking, this.categories[this.blinking].ideas);
        }
      });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private fetchRandomizerEvents(): void {
    this.gameSessionService.fetchRandomizerEvents()
      .pipe(skip(1), takeUntil(this.unsubscribe$), map((r: RandomizerEvent) => r.userId))
      .subscribe((selectedUserId: string) => {
        const selectedIndex = this.partyAnimals.findIndex(user => user.id === selectedUserId);
        this.lastTurnUserIndex = selectedIndex;
        this.dialog.closeAll();
        if (selectedIndex > -1) {
          if (selectedUserId === this.myId) {
            this.disabled = false;
            this.startBlinking(-1);
            this.startTimer();
          }
        }
      });
  }

  private fetchGameEvents(): void {
    this.gameSessionService.fetchGameEvents()
      .pipe(skip(1), takeUntil(this.unsubscribe$))
      .subscribe((gameEvent: GameEvent) => {
        if (gameEvent.categoryIndex > -1
          && gameEvent.ruleIndex > -1
          && gameEvent.categoryIndex < this.categories.length
          && gameEvent.ruleIndex < this.categories[gameEvent.categoryIndex].ideas.length) {
          this.disabled = true;
          const card = this.mapIndicesToCard(gameEvent.categoryIndex, gameEvent.ruleIndex);
          this.openCardPickedDialog(card);
          this.stopBlinking();
        }
      });
  }

  private mapIndicesToCard(categoryIndex: number, ruleIndex: number): Card {
    return {
      color: this.categories[categoryIndex].color,
      categoryName: this.categories[categoryIndex].name,
      ruleText: this.categories[categoryIndex].ideas[ruleIndex].text
    };
  }

  private openCardPickedDialog(card: Card): void {
    const dialogRef = this.dialog.open(DisplayCardDialogComponent, {data: {card}});
  }

}
