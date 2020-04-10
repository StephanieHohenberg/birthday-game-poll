import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdeaHttpService {

  public categoriesRefs: AngularFireList<Rule>[] = [];

  constructor(public db: AngularFireDatabase) {
  }

  public addIdea(categoryIndex: number, rule: string): Observable<Rule[]> {
    console.log('add idea: ' + rule);
    this.categoriesRefs[categoryIndex].push({rule});
    return this.categoriesRefs[categoryIndex].valueChanges();
  }

  public fetchIdeas(category: string): Observable<Rule[]> {
    const categoryRef: AngularFireList<Rule> = this.db.list<Rule>(category);
    this.categoriesRefs.push(categoryRef);
    console.log('fetch idea for category: ' + category);

    return categoryRef.valueChanges();
  }

}


export class Rule {
  rule: string;
}
