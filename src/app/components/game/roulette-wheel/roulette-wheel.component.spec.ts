import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RouletteWheelComponent} from './roulette-wheel.component';

describe('RouletteWheelComponent', () => {
  let component: RouletteWheelComponent;
  let fixture: ComponentFixture<RouletteWheelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouletteWheelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouletteWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
