import { Achievement } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementService } from '../services/achievement.service';
import { Utils } from './utils';

export class AchievementMechanics {

    static async addNewAchievement(name: string, property: any): Promise<any> {
        try {
                let achievement = new Achievement(name, property);
                let dbAchievement = achievement.getDbModel();
                
                const achievements: Achievement[] = await AchievementService.getAchievementByPropertyName(achievement.property['name']);
                
                if(achievements.length > 0 ) {
                    dbAchievement.id = achievements[0].id;
                } else {
                    const ref = await AchievementService.addAchievement(dbAchievement);
                    dbAchievement.id = ref.id;
                }

            return await AchievementService.setAchievement(dbAchievement);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}

