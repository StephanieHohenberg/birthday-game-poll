import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardDeskComponent} from './card-desk.component';

describe('CardDeskComponent', () => {
  let component: CardDeskComponent;
  let fixture: ComponentFixture<CardDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardDeskComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
