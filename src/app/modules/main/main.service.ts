import { Injectable } from '@angular/core';

/**
 * RxJs
 */
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MainService {
  competitionId: BehaviorSubject<number> = new BehaviorSubject(null);
  
  constructor(
  ) { }

  setCompetitionId = (competitionId: number) => {
    this.competitionId.next(competitionId);
  }

  getCompetitionId = () => {
    return this.competitionId;
  }
}
