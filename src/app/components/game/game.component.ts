import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {PartyAnimalService} from '../../services/party-animal.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {RegistrationDialogComponent} from '../registration-dialog/registration-dialog.component';
import {CATEGORIES} from '../../app.const';
import {Idea} from '../../models/rule.model';
import {IdeaHttpService} from '../../services/idea-http.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  public categories = CATEGORIES;
  public partyAnimals = [];
  public loggedInUserIndex = -1;
  private unsubscribe$ = new Subject();

  constructor(public partyAnimalService: PartyAnimalService,
              public dialog: MatDialog,
              private ideaService: IdeaHttpService) {
  }

  public ngOnInit(): void {
    if (this.partyAnimalService.isLoggedInUserGameMaster() === undefined) {
      this.openRegistrationDialog();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event) {
    this.partyAnimalService.leaveSession();
  }

  private openRegistrationDialog(): void {
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {width: '250px'});
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(name => {
        if (name === undefined) {
          this.openRegistrationDialog();
        } else {
          this.fetchRules();
          this.partyAnimalService.createUser(name)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(animals => {
              if (this.loggedInUserIndex < 0) {
                this.loggedInUserIndex = animals.length - 1;
              }
              this.partyAnimals = animals.map(a => a.name);
            });
          // TODO: set Cookie
        }
      });
  }

  private fetchRules(): void {
    for (const c of this.categories) {
      this.ideaService.fetchIdeas(c.name)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((ideas: Idea[]) => {
          c.ideas = [...ideas];
          c.ideas.forEach(idea => idea.text = `"${idea.text}"`);
        });
    }
  }
}
