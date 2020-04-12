import {Idea} from './rule.model';

export interface Category {
  name: string;
  color: string;
  ideas: Idea[];
}
