import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CATEGORIES} from './app.const';
import {IdeaHttpService, Rule} from './idea-http.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private currentLang = 'en';
  private unsubscribe$ = new Subject();
  public categories = CATEGORIES;
  public selectedCategoryIndex = 0;
  public hovered = -1;

  constructor(private translate: TranslateService, private ideaService: IdeaHttpService) {
  }

  public ngOnInit(): void {
    this.translate.setDefaultLang(this.currentLang);
    for (const c of this.categories) {
      this.ideaService.fetchIdeas(c.name)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((rules: Rule[]) => {
          c.rules = rules.map(r => r.rule);
          console.log(c.rules);
        });
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public sendIdea(idea: string): void {
    this.ideaService.addIdea(this.selectedCategoryIndex, idea);
  }
}
