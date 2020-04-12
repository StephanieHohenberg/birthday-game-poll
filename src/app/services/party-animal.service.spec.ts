import {TestBed} from '@angular/core/testing';

import {PartyAnimalService} from './party-animal.service';

describe('PartyAnimalService', () => {
  let service: PartyAnimalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartyAnimalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
