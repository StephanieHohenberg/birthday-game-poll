import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

class DialogData {
  name: string;
  drinkingIndex: number;
}

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent {

  public name: string;
  public drinkingIndex = 3;

  private icons = ['fas fa-glass-whiskey', 'fas fa-beer', 'fas fa-wine-glass-alt', 'fas fa-glass-cheers', 'fas fa-cocktail'];

  constructor(public translate: TranslateService,
              public dialogRef: MatDialogRef<RegistrationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data) {
      this.name = data.name;
      if (data.drinkingIndex) {
        this.drinkingIndex = data.drinkingIndex;
      }
    }
  }

  // TODO: Besser in LanguageKey mit drinne und inner HTML
  public getIconClass(value: number): string {
    return this.icons[value];
  }

  public getSliderLabel(value: number): string {
    return `SLIDER_LABEL_${value}`;
  }
}
