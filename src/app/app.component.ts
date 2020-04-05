import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CATEGORIES} from './app.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private currentLang = 'en';
  public categories = CATEGORIES;
  public selectedCategoryIndex = 0;
  public hovered = -1;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(this.currentLang);
  }
}
