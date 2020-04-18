import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.css']
})
export class LanguageToggleComponent implements OnInit {

  public currentLang = 'en';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(this.currentLang);
  }

  ngOnInit(): void {
  }

  public useLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
  }

}
