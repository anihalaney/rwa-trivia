import { CategoryEffects } from './category.effects';
import { TagEffects } from './tag.effects';

import { UserEffects } from './user.effects';


export const effects = [
  UserEffects,
  CategoryEffects,
  TagEffects
];

export * from './category.effects';
export * from './tag.effects';
export * from './user.effects';

