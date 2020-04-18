import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {map, skip, takeUntil} from 'rxjs/operators';
import {GameEvent, RandomizerEvent} from '../../../models/event.model';
import {Subject} from 'rxjs';
import {GameSessionService} from '../../../services/game-session.service';
import {EVENT_CARD_PICKED, EVENT_RANDOMIZER_START, EVENT_RANDOMIZER_STOP} from '../../../app.const';
import {TranslatePipe} from '@ngx-translate/core';
import {User} from '../../../models/user.model';
import {Category} from '../../../models/category.model';

@Component({
  selector: 'app-game-events-console',
  templateUrl: './game-events-console.component.html',
  styleUrls: ['./game-events-console.component.css']
})
export class GameEventsConsoleComponent implements OnInit, OnDestroy {

  @Input() public isGameMaster: boolean;
  @Input() public partyAnimals: User[] = [];
  @Input() public categories: Category[] = [];
  public eventsMessages: string[] = [];
  public displayedText: string;
  public isLoading = false;
  private userOfLastTurn: User;
  private unsubscribe$ = new Subject();

  constructor(private gameSessionService: GameSessionService,
              private translate: TranslatePipe) {
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
      .pipe(skip(1), takeUntil(this.unsubscribe$), map((r: RandomizerEvent) => r.userId))
      .subscribe((selectedUserId: string) => {
        const selectedIndex = this.partyAnimals.findIndex(user => user.id === selectedUserId);
        if (selectedIndex < 0) {
          this.userOfLastTurn = undefined;
          this.displayedText = this.translate.transform(EVENT_RANDOMIZER_START);
        } else {
          this.isLoading = true;
          this.userOfLastTurn = this.partyAnimals[selectedIndex];
          this.displayedText = this.translate.transform(EVENT_RANDOMIZER_STOP, {name: this.partyAnimals[selectedIndex].name});
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
          const rule = this.categories[gameEvent.categoryIndex].ideas[gameEvent.ruleIndex];
          this.isLoading = false;
          this.displayedText = this.translate.transform(EVENT_CARD_PICKED, {name: this.userOfLastTurn.name, rule: rule.text});
        }
      });
  }
}
