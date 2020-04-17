import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DisplayCardDialogComponent} from './display-card-dialog.component';

describe('DisplayCardDialogComponent', () => {
  let component: DisplayCardDialogComponent;
  let fixture: ComponentFixture<DisplayCardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayCardDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
