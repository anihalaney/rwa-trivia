import { SystemStatsBase } from '../../projects/shared-library/src/lib/shared/model';
import { FieldValue } from '@google-cloud/firestore';

export class SystemStatsAtomic extends SystemStatsBase {
    total_users?: FieldValue;
    total_questions?: FieldValue;
}
