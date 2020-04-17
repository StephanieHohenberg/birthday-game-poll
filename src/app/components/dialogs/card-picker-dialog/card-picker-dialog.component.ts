import {Component, Inject} from '@angular/core';
import {Card} from '../../../models/rule.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PATH_IMG_CARD_BACK} from '../../../app.const';

class DialogData {
  cards: Card[];
}

@Component({
  selector: 'app-card-picker-dialog',
  templateUrl: './card-picker-dialog.component.html',
  styleUrls: ['./card-picker-dialog.component.css']
})
export class CardPickerDialogComponent {

  public displayedCards: Card[] = [];
  public titleKey: string;
  public selectedCardIndex = -1;

  // TODO: Timer

  constructor(public dialogRef: MatDialogRef<CardPickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.displayedCards = data.cards;
  }

  public selectCard(index: number) {
    if (this.selectedCardIndex < 0) {
      this.selectedCardIndex = index;
      const selectedCard = this.displayedCards[index];
      this.dialogRef.close(selectedCard);
    }
  }

  public getBackCardImageUrlOfCard(cardIndex: number): string {
    const color = this.displayedCards[cardIndex].color;
    return `url(${PATH_IMG_CARD_BACK}${color}.png)`;
  }

}
