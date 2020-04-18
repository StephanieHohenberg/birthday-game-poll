import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkingCommandDialogComponent } from './drinking-command-dialog.component';

describe('DrinkingCommandDialogComponent', () => {
  let component: DrinkingCommandDialogComponent;
  let fixture: ComponentFixture<DrinkingCommandDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkingCommandDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkingCommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
