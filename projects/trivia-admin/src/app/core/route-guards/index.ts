import { CategoriesResolver } from './categories-resolver';
import { TagsResolver } from './tags-resolver';
import { AuthGuard } from './auth-guard';
import { AdminLoadGuard } from './load-guard';

export {
  CategoriesResolver,
  TagsResolver,
  AuthGuard,
  AdminLoadGuard
};

export default [
  CategoriesResolver,
  TagsResolver,
  AuthGuard,
  AdminLoadGuard
];
