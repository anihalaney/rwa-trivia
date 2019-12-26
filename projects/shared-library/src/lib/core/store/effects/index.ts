import { CategoryEffects } from './category.effects';
import { TagEffects } from './tag.effects';
import { QuestionEffects } from './question.effects';
import { UserEffects } from './user.effects';
import { GameEffects } from './game.effects';
import { ApplicationSettingsEffects } from './application-settings.effects';
import { TopicEffects } from './topic.effects';
export const effects = [
  UserEffects,
  CategoryEffects,
  TagEffects,
  QuestionEffects,
  GameEffects,
  ApplicationSettingsEffects,
  TopicEffects
];

export * from './category.effects';
export * from './tag.effects';
export * from './topic.effects';
export * from './question.effects';
export * from './user.effects';
export * from './game.effects';
export * from './application-settings.effects';
