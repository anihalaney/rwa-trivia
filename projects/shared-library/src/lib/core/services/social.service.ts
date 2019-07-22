import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, take } from 'rxjs/operators';
import { CONFIG } from '../../environments/environment';
import { Blog, SocialGameScoreShare, Subscribers, Subscription } from '../../shared/model';
import { DbService } from './../db-service';
import { UserService } from './user.service';


@Injectable()
export class SocialService {
    basePath = '/social_share';
    folderPath = '/score_images';

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private dbService: DbService) {
    }

    checkSubscription(subscription: Subscription) {
        return this.dbService.valueChanges('subscription', subscription.email)
            .pipe(
                take(1),
                map(s => {
                    if (s !== undefined && s.email === subscription.email) {
                        return true;
                    } else {
                        return false;
                    }
                })
            );
    }

    saveSubscription(subscription: Subscription) {
        const dbSubscription = Object.assign({}, subscription);

        this.dbService.getDoc('subscription', dbSubscription.email)
            .set(dbSubscription)
            .then(ref => {
                if (subscription.userId) {
                    this.userService.setSubscriptionFlag(subscription.userId);
                }
            });
    }

    getTotalSubscription(): Observable<Subscribers> {
        const url = `${CONFIG.functionsUrl}/subscription/count`;
        return this.http.get<Subscribers>(url);
    }

    generateScoreShareImage(imageBlob: any, userId: string) {
        const fileName = new Date().getTime();
        const socialGameScoreShare: SocialGameScoreShare = new SocialGameScoreShare();
        socialGameScoreShare.filename = fileName;
        socialGameScoreShare.created_uid = userId;
        this.dbService.setDoc('social_share', socialGameScoreShare.filename, { ...socialGameScoreShare });

        const filePath = `${this.basePath}/${userId}/${this.folderPath}/${new Date().getTime()}`;
        const fileRef = this.dbService.getFireStorageReference(filePath);

        return this.dbService.upload(filePath, imageBlob).snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL())
        );
    }


    loadBlogs(): Observable<Blog[]> {
        const queryParams = {
            condition: [],
            orderBy: [{ name: 'id', value: 'desc' }],
            limit: 3
        };

        return this.dbService.valueChanges('blogs', '', queryParams).pipe(catchError(error => {
            console.log(error);
            return of(null);
        }));

    }
}
