import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONFIG } from '../../environments/environment';
import { AchievementRule } from '../../shared/model';

@Injectable()
export class AchievementService {
  constructor(
    private http: HttpClient
  ) {
  }

  getAchievements(): Observable<AchievementRule[]> {
    const url = `${CONFIG.functionsUrl}/achievement`;
    return this.http.get<AchievementRule[]>(url);
  }

}
