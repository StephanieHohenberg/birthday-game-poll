import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent {

  private icons = ['fas fa-glass-whiskey', 'fas fa-beer', 'fas fa-wine-glass-alt', 'fas fa-glass-cheers', 'fas fa-cocktail'];

  constructor(public translate: TranslateService, public dialogRef: MatDialogRef<RegistrationDialogComponent>) {
  }

  // TODO: Besser in LanguageKey mit drinne und inner HTML
  public getIconClass(value: number): string {
    return this.icons[value];
  }

  public getSliderLabel(value: number): string {
    return `SLIDER_LABEL_${value}`;
  }
}
