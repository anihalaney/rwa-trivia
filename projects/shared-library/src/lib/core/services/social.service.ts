import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, of } from 'rxjs';
import { finalize, catchError, take, map } from 'rxjs/operators';
import { CONFIG } from '../../environments/environment';
import { Subscription, Subscribers, SocialGameScoreShare, Blog } from '../../shared/model';
import { UserService } from './user.service';


@Injectable()
export class SocialService {
    basePath = '/social_share';
    folderPath = '/score_images';

    constructor(private db: AngularFirestore,
        private http: HttpClient,
        private storage: AngularFireStorage,
        private userService: UserService) {
    }

    checkSubscription(subscription: Subscription) {
        return this.db.doc<any>(`/subscription/${subscription.email}`)
            .snapshotChanges()
            .pipe(
                take(1),
                map(s => {
                    if (s.payload.exists && s.payload.data().email === subscription.email) {
                        return true;
                    } else {
                        return false;
                    }
                })
            );
    }
    saveSubscription(subscription: Subscription) {
        const dbSubscription = Object.assign({}, subscription);
        return this.db.doc(`/subscription/${dbSubscription.email}`)
            .set(dbSubscription)
            .then(ref => {
                if (subscription.userId) {
                    this.userService.setSubscriptionFlag(subscription.userId);
                }
            });
    }

    getTotalSubscription(): Observable<Subscribers> {
        const url: string = CONFIG.functionsUrl + '/app/subscription/count';
        return this.http.get<Subscribers>(url);
    }

    generateScoreShareImage(imageBlob: any, userId: string) {
        const fileName = new Date().getTime();
        const socialGameScoreShare: SocialGameScoreShare = new SocialGameScoreShare();
        socialGameScoreShare.filename = fileName;
        socialGameScoreShare.created_uid = userId;
        this.db.doc(`/social_share/${socialGameScoreShare.filename}`).set({ ...socialGameScoreShare });

        const filePath = `${this.basePath}/${userId}/${this.folderPath}/${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);

        const socialShareImageObj = this.storage.upload(filePath, imageBlob);
        return socialShareImageObj.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL())
        );
    }


    loadBlogs(): Observable<Blog[]> {
        return this.db.collection('blogs', ref => ref.orderBy('id', 'desc').limit(3))
            .valueChanges()
            .pipe(catchError(error => {
                console.log(error);
                return of(null);
            }));
    }
}
