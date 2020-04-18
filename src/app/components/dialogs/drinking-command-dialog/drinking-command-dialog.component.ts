import {Component, Inject, OnInit} from '@angular/core';
import {COLORS} from '../../../app.const';
import {User} from '../../../models/user.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

class DialogData {
  partyAnimals: User[];
}


@Component({
  selector: 'app-drinking-command-dialog',
  templateUrl: './drinking-command-dialog.component.html',
  styleUrls: ['../dialog.component.css']
})
export class DrinkingCommandDialogComponent implements OnInit {

  public partyAnimals: User[] = [];
  public selectedUserIDs: string[] = [];
  public hovered = -1;

  constructor(public dialogRef: MatDialogRef<DrinkingCommandDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.partyAnimals = data.partyAnimals;
  }

  ngOnInit(): void {
  }

  public selectPartyAnimal(partyAnimal: User): void {
    if (partyAnimal.isDrinking) {
      if (this.isSelectedPartyAnimal(partyAnimal.id)) {
        const index = this.selectedUserIDs.findIndex(selectedId => selectedId === partyAnimal.id);
        this.selectedUserIDs.splice(index, 1);
      } else {
        this.selectedUserIDs.push(partyAnimal.id);
      }
    }
  }

  public isSelectedPartyAnimal(id: string): boolean {
    return this.selectedUserIDs.findIndex(selectedId => selectedId === id) > -1;
  }

  public getColorForIndex(index: number): string {
    return this.partyAnimals[index].isDrinking ? COLORS[index % COLORS.length] : 'grey';
  }

}
