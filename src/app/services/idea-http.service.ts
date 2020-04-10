import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {Rule} from '../models/rule.model';

@Injectable({
  providedIn: 'root'
})
export class IdeaHttpService {

  public categoriesRefs: AngularFireList<Rule>[] = [];

  constructor(public db: AngularFireDatabase) {
  }

  public addIdea(categoryIndex: number, rule: string): Observable<Rule[]> {
    this.categoriesRefs[categoryIndex].push({rule});
    return this.categoriesRefs[categoryIndex].valueChanges();
  }

  public fetchIdeas(category: string): Observable<Rule[]> {
    const categoryRef: AngularFireList<Rule> = this.db.list<Rule>(category);
    this.categoriesRefs.push(categoryRef);
    return categoryRef.valueChanges();
  }

}
