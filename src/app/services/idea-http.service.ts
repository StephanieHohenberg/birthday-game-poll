import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {Idea} from '../models/rule.model';

@Injectable({
  providedIn: 'root'
})
export class IdeaHttpService {

  public categoriesRefs: AngularFireList<Idea>[] = [];

  constructor(public db: AngularFireDatabase) {
  }

  public addIdea(categoryIndex: number, idea: string): Observable<Idea[]> {
    this.categoriesRefs[categoryIndex].push({text: idea});
    return this.categoriesRefs[categoryIndex].valueChanges();
  }

  public fetchIdeas(category: string): Observable<Idea[]> {
    const categoryRef: AngularFireList<Idea> = this.db.list<Idea>(category);
    this.categoriesRefs.push(categoryRef);
    return categoryRef.valueChanges();
  }

}
