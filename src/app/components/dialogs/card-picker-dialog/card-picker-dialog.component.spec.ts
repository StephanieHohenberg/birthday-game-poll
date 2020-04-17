import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardPickerDialogComponent} from './card-picker-dialog.component';

describe('CardPickerDialogComponent', () => {
  let component: CardPickerDialogComponent;
  let fixture: ComponentFixture<CardPickerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardPickerDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
