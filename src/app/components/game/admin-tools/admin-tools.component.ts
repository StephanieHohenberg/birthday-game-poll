import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DrinkingCommandDialogComponent} from '../../dialogs/drinking-command-dialog/drinking-command-dialog.component';
import {map, skip, takeUntil} from 'rxjs/operators';
import {User} from '../../../models/user.model';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {GameSessionService} from '../../../services/game-session.service';
import {EVENT_RANDOMIZER_START, EVENT_RANDOMIZER_STOP, RANDOMIZER_SECS} from '../../../app.const';
import {DrinkingEvent, RandomizerEvent} from '../../../models/event.model';
import {DrinkNotificationDialogComponent} from '../../dialogs/drink-notification-dialog/drink-notification-dialog.component';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css'],
  providers: [MatDialog],
})
export class AdminToolsComponent implements OnInit, OnDestroy {

  @Input() public myId: string;
  @Input() public partyAnimals: User[] = [];
  @Input() public isGameMaster = false;
  public isRandomizerRunning = false;
  private unsubscribe$ = new Subject();

  constructor(public gameSessionService: GameSessionService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchDrinkingCommandEvents();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public startRandomizerAsAdmin(): void {
    this.isRandomizerRunning = true;
    const randomizerSecsTotal = RANDOMIZER_SECS * (Math.random() * 10 + 3);
    this.gameSessionService.createRandomizerNotification('');
    const selectedIndex = Math.floor(Math.random() * this.partyAnimals.length);
    setTimeout(() => {
          const userId = this.partyAnimals[selectedIndex].id;
          this.gameSessionService.createRandomizerNotification(userId);
          this.isRandomizerRunning = false;
        }, randomizerSecsTotal);
  }

  public openDrinkCommandDialog(): void {
    const dialogRef = this.dialog.open(DrinkingCommandDialogComponent, {
      panelClass: 'mat-drinking-dialog-container',
      data: {partyAnimals: this.partyAnimals}
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: {partyAnimalIDs: string[]}) => {
        if (result !== undefined) {
          this.gameSessionService.createDrinkingEvent(result.partyAnimalIDs);
        }
      });
  }

  private fetchDrinkingCommandEvents(): void {
    this.gameSessionService.fetchDrinkingEvents()
      .pipe(skip(1), takeUntil(this.unsubscribe$), map((e: DrinkingEvent) => e.userIDs))
      .subscribe((userIDs: string[]) => {

        if (userIDs.findIndex(id => id === this.myId) > -1) {
          const dialogRef = this.dialog.open(DrinkNotificationDialogComponent, {
            panelClass: 'mat-drinking-dialog-container',
            width: '400px'
          });
        }
      });
  }
}
