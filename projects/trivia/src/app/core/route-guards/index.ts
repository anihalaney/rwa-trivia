import { CategoriesResolver } from './categories-resolver';
import { TagsResolver } from './tags-resolver';
import { AuthGuard } from './auth-guard';
import { BulkLoadGuard } from './load-guard';

export {
  CategoriesResolver,
  TagsResolver,
  AuthGuard,
  BulkLoadGuard
};

export default [
  CategoriesResolver,
  TagsResolver,
  AuthGuard,
  BulkLoadGuard
];
