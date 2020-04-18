import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BLINKING_SECS_INTERVAL, COLORS, RANDOMIZER_BLINKING_SECS_TOTAL, RANDOMIZER_SECS, TIMER_SECS_TOTAL} from '../../../app.const';
import {interval, Subject, Subscription} from 'rxjs';
import {map, skip, takeUntil} from 'rxjs/operators';
import {RandomizerEvent} from '../../../models/event.model';
import {GameSessionService} from '../../../services/game-session.service';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-roulette-wheel',
  templateUrl: './roulette-wheel.component.html',
  styleUrls: ['./roulette-wheel.component.scss']
})
export class RouletteWheelComponent implements OnInit, OnDestroy {

  @Input() public isGameMaster: boolean;
  @Input() public partyAnimals: User[] = [];
  public activeIndex = 0;
  public isRunning = false;
  private randomizerSubscription: Subscription;
  private blinkingSubscription: Subscription;
  private unsubscribe$ = new Subject();

  constructor(private gameSessionService: GameSessionService) {
  }

  public ngOnInit(): void {
    this.fetchRandomizerEvents();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public getColorForIndex(i: number): string {
    return COLORS[i % COLORS.length];
  }

  private startRandomizerRunning(): void {
    this.stopBlinking(this.activeIndex);
    this.isRunning = true;
    this.randomizerSubscription = interval(RANDOMIZER_SECS)
      .subscribe(() =>
        this.activeIndex = Math.floor(Math.random() * this.partyAnimals.length));
  }

  private stopRandomizer(selectedIndex: number): void {
    if (this.randomizerSubscription) {
      this.randomizerSubscription.unsubscribe();
      this.randomizerSubscription = undefined;
    }
    this.startBlinking(selectedIndex);
    this.isRunning = false;
  }

  private fetchRandomizerEvents(): void {
    this.gameSessionService.fetchRandomizerEvents()
      .pipe(skip(1), takeUntil(this.unsubscribe$), map((r: RandomizerEvent) => r.userId))
      .subscribe((selectedUserId: string) => {
        const selectedIndex = this.partyAnimals.findIndex(user => user.id === selectedUserId);
        if (selectedIndex < 0) {
          this.startRandomizerRunning();
          return;
        }
        this.stopRandomizer(selectedIndex);
      });
  }

  private startBlinking(selectedIndex: number): void {
    this.activeIndex = selectedIndex;
    this.blinkingSubscription = interval(BLINKING_SECS_INTERVAL)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.activeIndex = this.activeIndex < 0 ? selectedIndex : -1 );
    setTimeout(() => this.stopBlinking(selectedIndex), RANDOMIZER_BLINKING_SECS_TOTAL);
  }

  private stopBlinking(selectedIndex: number): void {
    if (this.blinkingSubscription) {
      this.blinkingSubscription.unsubscribe();
      this.activeIndex = selectedIndex;
    }
  }

}
