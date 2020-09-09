import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DrinkingCommandDialogComponent} from '../../dialogs/drinking-command-dialog/drinking-command-dialog.component';
import {map, skip, takeUntil} from 'rxjs/operators';
import {User} from '../../../models/user.model';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {GameSessionService} from '../../../services/game-session.service';
import {RANDOMIZER_SECS} from '../../../app.const';
import {DrinkingEvent} from '../../../models/event.model';
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
  private partyAnimalsOfRound: User[] = [];
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
    if (this.partyAnimalsOfRound.length === 0) { // TODO funkt nur, wenn nur ein Admin
      this.partyAnimalsOfRound = [ ...this.partyAnimals];
    }
    console.log(this.partyAnimalsOfRound);


    this.isRandomizerRunning = true;
    const randomizerSecsTotal = RANDOMIZER_SECS * (Math.random() * 10 + 3);
    this.gameSessionService.createRandomizerNotification('');
    const selectedIndex = Math.floor(Math.random() * this.partyAnimalsOfRound.length);
    setTimeout(() => {
          const userId = this.partyAnimalsOfRound[selectedIndex].id;
          console.log(userId);
          this.partyAnimalsOfRound.splice(selectedIndex, 1);
          console.log(this.partyAnimalsOfRound);
          this.gameSessionService.createRandomizerNotification(userId);
          this.isRandomizerRunning = false;
        }, randomizerSecsTotal);
  }

  public openDrinkCommandDialog(): void {
    const dialogRef = this.dialog.open(DrinkingCommandDialogComponent, {
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
          const dialogRef = this.dialog.open(DrinkNotificationDialogComponent);
        }
      });
  }
}
