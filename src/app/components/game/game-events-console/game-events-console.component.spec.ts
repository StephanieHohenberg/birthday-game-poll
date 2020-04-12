import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GameEventsConsoleComponent} from './game-events-console.component';

describe('GameEventsConsoleComponent', () => {
  let component: GameEventsConsoleComponent;
  let fixture: ComponentFixture<GameEventsConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameEventsConsoleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameEventsConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
