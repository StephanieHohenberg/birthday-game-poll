import {Component, OnDestroy, OnInit} from '@angular/core';
import {CATEGORIES, SEND_BUTTON_DELAY_SECS} from '../../app.const';
import {Subject} from 'rxjs';
import {IdeaHttpService} from '../../services/idea-http.service';
import {delay, takeUntil} from 'rxjs/operators';
import {Idea} from '../../models/rule.model';
import {Router} from '@angular/router';
import {PartyAnimalService} from '../../services/party-animal.service';

@Component({
  selector: 'app-poll-form',
  templateUrl: './poll-form.component.html',
  styleUrls: ['./poll-form.component.css']
})
export class PollFormComponent implements OnInit, OnDestroy {

  public categories = CATEGORIES;
  public selectedCategoryIndex = 0;
  public hovered = -1;
  public isLoading = false;
  private unsubscribe$ = new Subject();

  constructor(private ideaService: IdeaHttpService,
              private partyAnimalService: PartyAnimalService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.fetchIdeas();
    this.routeToGameIfAlreadyStarted();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public sendIdea(idea: string): void {
    this.isLoading = true;
    this.ideaService.addIdea(this.selectedCategoryIndex, idea)
      .pipe(delay(SEND_BUTTON_DELAY_SECS), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  private fetchIdeas(): void {
    for (const c of this.categories) {
      this.ideaService.fetchIdeas(c.name)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((ideas: Idea[]) => {
          c.ideas = [...ideas].map(idea => ({text: `"${idea.text}"`, isDrinkingRule: idea.isDrinkingRule}));
        });
    }
  }

  private routeToGameIfAlreadyStarted(): void {
    this.partyAnimalService.fetchUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(animals => {
        if (animals.length > 0) {
          this.router.navigate(['session']);
        }
      });
  }
}
