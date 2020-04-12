import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RegistrationDialogComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
