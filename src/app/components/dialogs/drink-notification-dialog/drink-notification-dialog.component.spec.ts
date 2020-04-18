import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkNotificationDialogComponent } from './drink-notification-dialog.component';

describe('DrinkNotificationDialogComponent', () => {
  let component: DrinkNotificationDialogComponent;
  let fixture: ComponentFixture<DrinkNotificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkNotificationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
