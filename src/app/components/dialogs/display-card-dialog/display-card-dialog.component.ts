import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Card} from '../../../models/rule.model';
import {PATH_IMG_CARD_FRONT} from '../../../app.const';

class DialogData {
  card: Card;
}

@Component({
  selector: 'app-display-card-dialog',
  templateUrl: './display-card-dialog.component.html',
  styleUrls: ['./display-card-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DisplayCardDialogComponent {

  public displayedCard: Card;

  constructor(public dialogRef: MatDialogRef<DisplayCardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.displayedCard = data.card;
  }

  public getFrontCardImageUrlOfCard(): string {
    const color = this.displayedCard.color;
    return `url(${PATH_IMG_CARD_FRONT}${color}.png)`;
  }

}
