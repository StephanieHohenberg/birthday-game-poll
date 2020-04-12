import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {COLORS, RANDOMIZER_SECS} from '../../../app.const';
import {interval, Subject, Subscription} from 'rxjs';
import {map, skip, takeUntil} from 'rxjs/operators';
import {RandomizerEvent} from '../../../models/event.model';
import {GameSessionService} from '../../../services/game-session.service';

@Component({
  selector: 'app-roulette-wheel',
  templateUrl: './roulette-wheel.component.html',
  styleUrls: ['./roulette-wheel.component.scss']
})
export class RouletteWheelComponent implements OnInit, OnDestroy {

  @Input() public isGameMaster: boolean;
  @Input() public partyAnimals: string[] = [];
  public activeIndex = 0;
  public isRunning = false;
  private randomizerSubscription: Subscription;
  private unsubscribe$ = new Subject();

  constructor(private gameSessionService: GameSessionService) {
  }

  public ngOnInit(): void {
    this.gameSessionService.fetchRandomizerEvents()
      .pipe(skip(1), takeUntil(this.unsubscribe$), map((r: RandomizerEvent) => r.userIndex))
      .subscribe((selectedIndex: number) => {
        if (selectedIndex < 0) {
          this.startRandomizerRunning();
          return;
        }
        this.stopRandomizer(selectedIndex);
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public getColorForIndex(i: number): string {
    return COLORS[i % COLORS.length];
  }

  public startRandomizerAsAdmin(): void {
    const randomizerSecsTotal = RANDOMIZER_SECS * (Math.random() * 10 + 3);
    this.gameSessionService.createRandomizerNotification(-1);
    const selectedIndex = Math.floor(Math.random() * this.partyAnimals.length);
    setTimeout(() => this.gameSessionService.createRandomizerNotification(selectedIndex),
      randomizerSecsTotal);
  }

  public startRandomizerRunning(): void {
    this.isRunning = true;
    this.randomizerSubscription = interval(RANDOMIZER_SECS)
      .subscribe(() =>
        this.activeIndex = Math.floor(Math.random() * this.partyAnimals.length));
  }

  public stopRandomizer(selectedIndex: number): void {
    if (this.randomizerSubscription) {
      this.randomizerSubscription.unsubscribe();
      this.randomizerSubscription = undefined;
    }
    this.activeIndex = selectedIndex;
    this.isRunning = false;
  }

}
