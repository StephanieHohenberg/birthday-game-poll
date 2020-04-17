import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {map, skip, takeUntil} from 'rxjs/operators';
import {GameEvent, RandomizerEvent} from '../../../models/event.model';
import {GameSessionService} from '../../../services/game-session.service';
import {Subject} from 'rxjs';
import {Card} from '../../../models/rule.model';
import {CARD_AMOUNT} from '../../../app.const';
import {Category} from '../../../models/category.model';
import {MatDialog} from '@angular/material/dialog';
import {CardPickerDialogComponent} from '../../dialogs/card-picker-dialog/card-picker-dialog.component';
import {DisplayCardDialogComponent} from '../../dialogs/display-card-dialog/display-card-dialog.component';

@Component({
  selector: 'app-card-desk',
  templateUrl: './card-desk.component.html',
  styleUrls: ['./card-desk.component.scss']
})
export class CardDeskComponent implements OnInit, OnDestroy {

  @Input() public myIndex: number;
  @Input() public categories: Category[] = [];
  private unsubscribe$ = new Subject();
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

  private fetchRandomizerEvents(): void {
    this.gameSessionService.fetchRandomizerEvents()
      .pipe(skip(1), takeUntil(this.unsubscribe$), map((r: RandomizerEvent) => r.userIndex))
      .subscribe((selectedIndex: number) => {
        this.lastTurnUserIndex = selectedIndex;
        this.dialog.closeAll();
        if (selectedIndex > -1) {
          if (selectedIndex === this.myIndex) {
            const cards = this.shuffleCards();
            this.openCardPickerDialog(cards);
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
          const card = this.mapIndicesToCard(gameEvent.categoryIndex, gameEvent.ruleIndex);
          this.openCardPickedDialog(card);
        }
      });
  }

  private shuffleCards(): Card[] {
    const cards = [];
    for (let i = 1; i <= CARD_AMOUNT; i++) {
      const categoryIndex = Math.floor(Math.random() * this.categories.length);
      const ruleIndex = Math.floor(Math.random() * this.categories[categoryIndex].ideas.length);
      cards.push(this.mapIndicesToCard(categoryIndex, ruleIndex));
    }
    return cards;
  }

  private mapIndicesToCard(categoryIndex: number, ruleIndex: number): Card {
    return {
      categoryIndex,
      ruleIndex,
      color: this.categories[categoryIndex].color,
      categoryName: this.categories[categoryIndex].name,
      ruleText: this.categories[categoryIndex].ideas[ruleIndex].text
    };
  }

  private openCardPickedDialog(card: Card): void {
    const dialogRef = this.dialog.open(DisplayCardDialogComponent, {
      width: '172px',
      panelClass: 'custom-dialog-container',
      data: {card}
    });
  }

  private openCardPickerDialog(cards: Card[]): void {
    const dialogRef = this.dialog.open(CardPickerDialogComponent,
      {
        width: '400px', data: {cards}
      });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((selectedCard: Card) => {
        if (selectedCard === undefined) {
          this.openCardPickerDialog(cards); // TODO oder choose random?
        } else {
          this.gameSessionService.createGameEventNotification({
            categoryIndex: selectedCard.categoryIndex,
            ruleIndex: selectedCard.ruleIndex
          });
        }
      });
  }

}
