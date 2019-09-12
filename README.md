# rwa-trivia app

See it in action:
* On the web - https://bitwiser.io
* App Store - https://itunes.apple.com/us/app/bitwiser-trivia/id1447244501?mt=8
* Google Play - https://play.google.com/store/apps/details?id=io.bitwiser.trivia

This is part of building a new app for my series - Real World Angular @ https://blog.realworldfullstack.io/

[Part 0: From zero to cli-ng](https://blog.realworldfullstack.io/real-world-angular-part-0-from-zero-to-cli-ng-a2ff646b90cc)

[Part 1: Not another todo list app](https://blog.realworldfullstack.io/real-world-angular-part-1-not-another-todo-list-c2ea5020f944)

[Part 2: It's a Material world](https://blog.realworldfullstack.io/real-world-angular-part-2-its-a-material-world-2d70238ef8ef)

[Part 3: Form Formation](https://blog.realworldfullstack.io/real-world-angular-part-3-form-formation-f78d8462da70)

[Part 4: State of my SPA](https://blog.realworldfullstack.io/real-world-angular-part-4-state-of-my-spa-10bf90c5a15)

[Part 5: Light my fire](https://blog.realworldfullstack.io/real-world-angular-part-5-light-my-fire-34b0bcb351a8)

[Part 6: 3Rs ... Rules, Roles & Routes](https://blog.realworldfullstack.io/real-world-angular-part-6-3rs-rules-roles-routes-9e7de5a3ea8e)

[Part 6.1: Upgrading to 4.0.0-rc.2](https://blog.realworldfullstack.io/real-world-angular-part-6-1-upgrading-to-4-0-0-rc-2-fcaab81603fa)

[Part 7: Split my lazy loaded code](https://blog.realworldfullstack.io/real-world-angular-part-7-lazy-coding-load-splitting-4552f5f54ef7)

[Part 8: Just Ahead of In Time](https://blog.realworldfullstack.io/real-world-angular-part-8-just-ahead-of-in-time-ae2d3cc89656)

[Part 9: Unit Testing](https://blog.realworldfullstack.io/real-world-angular-part-9-unit-testing-c62ba20b1d93)

[Part 9.1: More Unit Testing](https://blog.realworldfullstack.io/real-world-angular-part-9-1-more-unit-testing-f0545ece586d)

[Part 9.2: Even More Unit Tests](https://blog.realworldfullstack.io/real-world-angular-part-9-2-even-more-unit-tests-f903df40530a)

[Part 10: Angular 4 upgrade](https://blog.realworldfullstack.io/real-world-angular-part-x-fantastic-4-c714b04640ab)

[Part 11: Gameplay with Angular](https://blog.realworldfullstack.io/real-world-app-part-11-gameplay-with-angular-2a660fad52c2)

[Part 12: Cloud Functions for Firebase](https://blog.realworldfullstack.io/real-world-app-part-12-cloud-functions-for-firebase-8359787e26f3)

[Part 13: Elasticsearch on Google Cloud with Firebase functions](https://blog.realworldfullstack.io/real-world-app-part-13-elasticsearch-on-google-cloud-with-firebase-functions-8a24fa2b95ed)

[Part 14: Faceted search with Elasticsearch and Angular Material data-table](https://blog.realworldfullstack.io/real-world-app-part-14-faceted-search-with-elasticsearch-and-angular-material-data-table-d90ebaf2ee4b)

[Part 15: Incorporate Material UI design into the app](https://blog.realworldfullstack.io/real-world-app-part-15-ui-design-with-angular-material-1a5c597c679e)

[Part 16: Migrating from Firebase to Firestore](https://blog.realworldfullstack.io/real-world-app-part-16-from-firebase-to-firestore-f6c494e80237)

[Part 17: Bulk upload and User profile settings using firebase cloud storage](https://blog.realworldfullstack.io/real-world-app-part-17-cloud-storage-with-firebase-and-angular-d3d2c9f5f27c)

[Part 18: Revisiting ngrx - Splitting store into feature modules, using action classes, selectors & router-store](https://blog.realworldfullstack.io/real-world-app-part-18-revisiting-ngrx-e20feed6312c)

[Part 19: Ready Player Two - Two player game play, computing stats, dashboard and other features](https://blog.realworldfullstack.io/real-world-app-part-19-ready-player-two-9e17c2e7c694)

[Part 20: Angular, ngrx & cli version 6 - Upgrading Angular, cli, ngrx, material & RxJS to version 6](https://blog.realworldfullstack.io/real-world-app-part-20-angular-ngrx-cli-version-6-a3490b64f0c7)

[Part 21: Service Workers (Progressive Web App) with Angular](https://blog.realworldfullstack.io/real-world-app-part-21-service-workers-pwa-with-angular-3ba5c7168f3f)

[Part 22: Angular Testing with Protractor, Jasmine and Jest](https://blog.realworldfullstack.io/real-world-app-part-22-angular-testing-with-protractor-jasmine-and-jest-6a0e03a89038)

[Part 23: Server side rendering with Angular universal](https://blog.realworldfullstack.io/real-world-app-part-23-ssr-with-angular-universal-637ec8490c44)

[Part 24: Angular workspace](https://blog.realworldfullstack.io/real-world-app-part-24-angular-workspace-69345d32e00e)

[Part 25-a: NativeScript, Angular and Firebase](https://blog.realworldfullstack.io/real-world-app-part-25-a-nativescript-and-angular-e9ff4b102e9b)

## Quick Installation Instructions

* Install cli globally (version should match the one in package.json)

`npm install -g @angular/cli@1.0.0`

* Install npm packages

`npm install`

* Setup your firebase instance @ https://firebase.google.com/

* Setup providers in Firebase Authentication

* Use the firebase configuration information and plug it in src/environment.ts

* Import src/db.json to your firebase database instance to get the initial set of test data

* Run the application using ng serve

`ng serve`

* Add yourself as a user using the application. Ensure you are added as a user in Authentication tab of firebase console.

* Add your user id as an admin in the firebase database (admins need to be added manually) -

Set: users/\<user id\>/roles/admin: true

* Use firebase-rules.json file to setup the firebase rules for your database

* Serve the application again. Ensure you have admin privileges

`ng serve`

## Deploy to Firebase Server

* Install firebase tools globally

`npm install -g firebase-tools`

* Authenticate with your firebase credentials

`firebase login`

* Setup firebase hosting configuration for the application, using "dist" instead of public as the public folder name

`firebase init`

* Create a build

`ng build`

* Serve up the app using firebase server locally

`firebase serve`

* Deploy Site to firebase

`firebase deploy --only hosting`

* Setup firebase functions - creates functions folder and installs dependencies

`firebase init`

* Deploy functions to firebase

`npm run deploy-functions`

## Testing
* Test the application using

`ng test`
