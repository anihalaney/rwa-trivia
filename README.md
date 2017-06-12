# rwa-trivia app

This is part of building a new app for my series - Real World Angular @ https://blog.realworldfullstack.io/

See demo (development server) - https://rwa-trivia.firebaseapp.com

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

