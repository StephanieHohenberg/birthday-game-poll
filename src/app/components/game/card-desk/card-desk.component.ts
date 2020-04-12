import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {map, skip, takeUntil} from 'rxjs/operators';
import {GameEvent, RandomizerEvent} from '../../../models/event.model';
import {GameSessionService} from '../../../services/game-session.service';
import {Subject} from 'rxjs';
import {Card} from '../../../models/rule.model';
import {CARD_AMOUNT, PATH_IMG_CARD_BACK} from '../../../app.const';
import {Category} from '../../../models/category.model';

@Component({
  selector: 'app-card-desk',
  templateUrl: './card-desk.component.html',
  styleUrls: ['./card-desk.component.scss']
})
export class CardDeskComponent implements OnInit, OnDestroy {

  @Input() public myIndex: number;
  @Input() public categories: Category[] = [];
  public displayedCards: Card[] = [];
  public selectedCardIndex = -1;
  private unsubscribe$ = new Subject();

  constructor(private gameSessionService: GameSessionService) {
  }

  public ngOnInit(): void {
    this.fetchRandomizerEvents();
    this.fetchGameEvents();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public selectCard(index: number) {
    if (this.selectedCardIndex < 0) {
      this.selectedCardIndex = index;
      const selectedCard = this.displayedCards[index];
      this.gameSessionService.createGameEventNotification({categoryIndex: selectedCard.categoryIndex, ruleIndex: selectedCard.ruleIndex});
    }
  }

  public getCardBackUrlByColor(color: string): string {
    return `url(${PATH_IMG_CARD_BACK}${color}.png)`;
  }

  private fetchRandomizerEvents(): void {
    this.gameSessionService.fetchRandomizerEvents()
      .pipe(skip(1), takeUntil(this.unsubscribe$), map((r: RandomizerEvent) => r.userIndex))
      .subscribe((selectedIndex: number) => {
        console.log('myIndex:' + this.myIndex);
        console.log('selectedIndex: ' + selectedIndex);
        if (selectedIndex > -1) {
          if (selectedIndex === this.myIndex) {
            this.displayRandomCards();
          } else {
            this.displayedCards = [];
            this.selectedCardIndex = -1;
          }
          return;
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
          && gameEvent.ruleIndex < this.categories[gameEvent.categoryIndex].ideas.length
          && this.selectedCardIndex < 0) {
          this.displayedCards = [];
          this.displayedCards.push({categoryIndex: gameEvent.categoryIndex, ruleIndex: gameEvent.ruleIndex});
          this.selectedCardIndex = 0;
        }
      });
  }

  private displayRandomCards(): void {
    this.displayedCards = [];
    this.selectedCardIndex = -1;
    for (let i = 1; i <= CARD_AMOUNT; i++) {
      const categoryIndex = Math.floor(Math.random() * this.categories.length);
      const ruleIndex = Math.floor(Math.random() * this.categories[categoryIndex].ideas.length);
      this.displayedCards.push({categoryIndex, ruleIndex});
    }
  }
}
