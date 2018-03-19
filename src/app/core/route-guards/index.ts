import { CategoriesResolver } from './categories-resolver';
import { TagsResolver } from './tags-resolver';
import { AuthGuard } from './auth-guard';
import { AdminLoadGuard, BulkLoadGuard } from './load-guard';

export {
  CategoriesResolver,
  TagsResolver,
  AuthGuard,
  AdminLoadGuard,
  BulkLoadGuard
};

export default [
  CategoriesResolver,
  TagsResolver,
  AuthGuard,
  AdminLoadGuard,
  BulkLoadGuard
];
