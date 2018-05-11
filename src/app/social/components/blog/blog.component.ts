import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  @Input() blogId: number;
  blogData = [];



  getSocial(blogNo) {
    this.blogData[blogNo].status = true;
  }

  onNotify(info: any) {
    this.blogData[info.blogNo].status = info.status;
  }

  ngOnInit() {

    this.blogData = [{
      blogNo: 0,
      status: false,
      link: 'https://blog.realworldfullstack.io/real-world-app-part-17-cloud-storage-with-firebase-and-angular-d3d2c9f5f27c',
      image: 'https://cdn-images-1.medium.com/max/2000/1*a0Z6jsHuF8ASw089hSgnIw.jpeg',
      imageAlt: 'Real World App: Cloud storage with Firebase and Angular',
      title: 'Angularfire2, Google Cloud Storage',
      subTitle: 'Real World App: Cloud storage with Firebase and Angular',
      description: 'Adding features: Bulk upload and User profile settings using firebase cloud storage',
      commentCount: 12,
      viewCount: 70
    },
    {
      blogNo: 1,
      status: false,
      link: 'https://blog.realworldfullstack.io/real-world-app-part-16-from-firebase-to-firestore-f6c494e80237',
      image: 'https://cdn-images-1.medium.com/max/2000/1*6DrNpNpbrQt1v-NQjh9xow.jpeg',
      imageAlt: 'Real World App - Part 16: From Firebase to Firestore',
      title: 'Firebase realtime database, Firestore',
      subTitle: 'Real World App: From Firebase to Firestore',
      description: 'Migrating from Firebase realtime database to Cloud Firestore',
      commentCount: 236,
      viewCount: 2907
    },
    {
      blogNo: 2,
      status: false,
      link: 'https://blog.realworldfullstack.io/real-world-app-part-15-ui-design-with-angular-material-1a5c597c679e',
      image: 'https://cdn-images-1.medium.com/max/1600/1*piXzTMJL11cdzaaYLDziCA.png',
      imageAlt: 'Real World App - Part 15: UI design with Angular Material',
      title: 'Angular Material',
      subTitle: 'Real World App: UI design with Angular Material',
      description: 'Incorporate Material UI design into the app.',
      commentCount: 237,
      viewCount: 1029
    }];
  }
}
