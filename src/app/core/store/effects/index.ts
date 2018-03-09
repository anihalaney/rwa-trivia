import { CategoryEffects } from './category.effects';
import { TagEffects } from './tag.effects';
import { QuestionEffects } from './question.effects';
import { UserEffects } from './user.effects';
import { GameEffects } from './game.effects';

export const effects = [
  UserEffects,
  CategoryEffects,
  TagEffects,
  QuestionEffects,
  GameEffects
];

export * from './category.effects';
export * from './tag.effects';
export * from './question.effects';
export * from './user.effects';
export * from './game.effects';
