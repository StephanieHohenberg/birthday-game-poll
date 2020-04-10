import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CATEGORIES, RULE_CHANGE_SECS, SEND_BUTTON_DELAY_SECS} from './app.const';
import {IdeaHttpService} from './services/idea-http.service';
import {interval, Subject} from 'rxjs';
import {delay, takeUntil} from 'rxjs/operators';
import {Rule} from './models/rule.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private currentLang = 'en';
  public displayedRule: string;
  private unsubscribe$ = new Subject();
  public categories = CATEGORIES;
  public selectedCategoryIndex = 0;
  private displayedRuleIndex = -1;
  public hovered = -1;
  public isLoading = false;

  constructor(private translate: TranslateService, private ideaService: IdeaHttpService) {
  }

  public ngOnInit(): void {
    this.translate.setDefaultLang(this.currentLang);
    for (const c of this.categories) {
      this.ideaService.fetchIdeas(c.name)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((rules: Rule[]) => {
          c.rules = rules.map(r => `"${r.rule}"`);
          this.changeDisplayedRule();
        });
    }

    interval(RULE_CHANGE_SECS)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.changeDisplayedRule());

  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public clickOnCategory(categoryIndex: number): void {
    if (this.selectedCategoryIndex !== categoryIndex) {
      this.selectedCategoryIndex = categoryIndex;
      this.displayedRuleIndex = -1;
      this.changeDisplayedRule();
    }
  }

  public changeDisplayedRule(): void {
    const rules = this.categories[this.selectedCategoryIndex].rules;
    if (rules.length === 0) {
      return;
    }
    this.displayedRuleIndex = this.displayedRuleIndex === rules.length - 1 ? 0 : this.displayedRuleIndex + 1;
    this.displayedRule = rules[this.displayedRuleIndex];
  }


  public sendIdea(idea: string): void {
    this.isLoading = true;
    this.ideaService.addIdea(this.selectedCategoryIndex, idea)
      .pipe(delay(SEND_BUTTON_DELAY_SECS), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}
