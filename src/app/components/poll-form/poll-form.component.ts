import {Component, OnDestroy, OnInit} from '@angular/core';
import {CATEGORIES, SEND_BUTTON_DELAY_SECS} from '../../app.const';
import {Subject} from 'rxjs';
import {IdeaHttpService} from '../../services/idea-http.service';
import {delay, takeUntil} from 'rxjs/operators';
import {Idea} from '../../models/rule.model';

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

  constructor(private ideaService: IdeaHttpService) {
  }

  public ngOnInit(): void {
    // TODO: Wegleiten auf Game, wenn GameStatus >= BEREITSGESTARTET - RuleService? GameSessionService

    this.fetchIdeas();
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

  private fetchIdeas() {
    for (const c of this.categories) {
      this.ideaService.fetchIdeas(c.name)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((ideas: Idea[]) => {
          c.ideas = ideas;
          c.ideas.forEach(idea => idea.text = `"${idea.text}"`);
        });
    }
  }
}
