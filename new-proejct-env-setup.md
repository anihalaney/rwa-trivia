
## Quick Installation Instructions For New Project

1) Add your firebase configurations in environment file under shared-library folder.

    put your environment files under directory with specific project name
    
    Add new configuration for project in angular.json 
        
        1) Trivia

            add new configurations for dev, staging and production in angular.json projects > trivia > architect > build > configurations and projects > trivia > architect > serve > configurations
            1) add dev configuration 
            2) add staging configuration 
            3) add production configuration

        2) Trivia-admin

            add new configurations for dev, staging and production in angular.json projects > trivia-admin > architect > build > configurations and projects > trivia-admin > architect > serve > configurations

            1) add dev configuration 
            2) add staging configuration 
            3) add production configuration

2) Firebase settings
        1) Authentication
            add signin Methods
        2) Setup Database
            create collections
            add data for collections application_settings, blogs, categories, countries, lists, schedular_auth_tokens
            Set Rules for database
            Set Indexes 
        3) Setup Storage
            Add Folders
            Add Rules
        4) Crashlytics
            Enable Crashlytics for mobile android and ios
        5) Project Settings
            Add Android and Ios App under general tab

3) Functions Settings
    Add new project in .firebaserc - (add name of your firebase project)

    Add Config for specific project under functions > Configs folder add non-confidential information in project specific file
    
    file name should be `{projectNameFrom .firebaserc}.json`
    e.g. rwa-trivia.json

4) Add commands in package.json to run project in dev, staging, production for trivia and trivia-admin

    1) command to run web app in (dev / local) / staging / production
        "{environment}:start-{projectName}": "ng serve {trivia / trivia-admin} --configuration={build configuration specified in angular.json for trivia/ trivia-admin}" // also verify it with the configuration in angular.json under trivia > configurations 
        do not specify environment for dev in command
        e.g.  "prod:start-trivia": "ng serve  trivia --configuration=trivia-production",

    2) Follow above instruction for admin web app

5) Add commands in package.json to deploy functions (use projectName as specified in .firebaserc)

    1) deploy functions local
    "deploy-{projectName}-functions-local": "npm run compile-functions  && firebase serve -P {projectName from .firebaserc}  --only functions",

    e.g. "deploy-trivia-functions-local": "npm run compile-functions  && firebase serve -P trivia-dev  --only functions"
    

    2) deploy functions staging / production (specify environment for production only)
        1)    "{environment(specify environment only for prod else it will be considered as staging)}:deploy-{projectName}-functions" : "npm run {environment}:deploy-{projectName}-functions-build && npm run {environment}:{projectName}:set-index && npm run {environment}:{projectName}:deploy-functions-app && npm run {environment}:{projectName}:deploy-functions-ssr && npm run {environment}:{projectName}:deploy-apps-to-firebase && npm install firebase@6.0.2",

            e.g.    "prod:deploy-bitwiser-edu-functions": "npm run prod:deploy-bitwiser-edu-functions-build && npm run prod:bitwiser-edu:set-index && npm run prod:bitwiser-edu:deploy-functions-app && npm run prod:bitwiser-edu:deploy-functions-ssr && npm run prod:bitwiser-edu:deploy-apps-to-firebase && npm install firebase@6.0.2"

        2)  "{environment}:deploy-{projectName}-functions-build": "npm run {environment}:build-{projectName}:ssr && npm run compile-ssr-functions"

            e.g. "prod:deploy-bitwiser-edu-functions-build": "npm run prod:build-bitwiser-edu:ssr && npm run compile-ssr-functions",

        3) build ssr

            "{environment}:build-{projectName}:ssr": "ng build trivia  --configuration={production configuration of web app} && ng build trivia-admin  --configuration={production configuration of admin web app} && ng run trivia:server",

            e.g. "prod:build-bitwiser-edu:ssr": "ng build trivia  --configuration=bitwiser-edu-production && ng build trivia-admin  --configuration=bitwiser-edu-admin-production && ng run trivia:server",

        4)  deploy functions app
         "{environment}:deploy-{projectName}-functions-app": "npm run pre-compile-app-functions && firebase deploy -P {projectName from .firebaserc} --only functions"

            e.g. "deploy-bitwiser-edu-functions-app": "npm run pre-compile-app-functions && firebase deploy -P bitwiser-edu-dev --only functions",

         5) deploy functions ssr
            
            "{environment (only specify for prod)}:{projectName}:deploy-functions-ssr": "npm run pre-compile-ssr-functions && firebase deploy -P {projectName from .firebaserc} --only functions:ssr",

             e.g. "prod:bitwiser-edu:deploy-functions-ssr": "npm run pre-compile-ssr-functions && firebase deploy -P bitwiser-edu-production --only functions:ssr",

        6) deploy functions to firebase
            "{environment (only specify for prod)}:{projectName}:deploy-apps-to-firebase": "firebase deploy -P {projectName from .firebaserc} --only hosting"

            e.g. "prod:bitwiser-edu:deploy-apps-to-firebase": "firebase deploy -P bitwiser-edu-production --only hosting",

        7) production set index

                "prod:{projectName}:set-index": "firebase -P {projectName from .firebaserc} functions:config:set environment.production=true",

                e.g.  "prod:bitwiser-edu:set-index": "firebase -P bitwiser-edu-production functions:config:set environment.production=true"




6) Add commands in package.json for Mobile App

        1) build app
            "dev:{platform (android/ios)}:{projectName}": "tns run {platform} --bundle  --env.package_name={packageName from firebase general settings} --env.project={projectName}",

            e.g. "dev:ios:bitwiser-edu": "tns run ios --bundle  --env.package_name=io.bitwiser.edu.dev --env.project=bitwiser-edu"

        2)  build prod app

           "prod:{platform}:{projectName}": "tns run {platform} --bundle --env.prod --env.aot --env.uglify --env.package_name=io.bitwiser.edu.dev --env.project={projectName}",

            e.g. "prod:android:bitwiser-edu": "tns run android --bundle --env.prod --env.aot --env.uglify --env.package_name=io.bitwiser.edu.dev --env.project=bitwiser-edu",

        3) release android app

                1 ) make changes in current trivia project release folder

                    put .sh files for dev and prod environment in project specific folder 
                    e.g. release > trivia > prod-android.sh

                    add new folder in release and add release file

                    specify --env.project={projectName} in release command in {environment}.{platform}.sh

                2) add certificates in current trivia certificate folder

                    directory structure : certificate > {projectName} > {platform} > {certificate files}
                    e.g. certificates > trivia > android > {certificate file}

                3) add command in package.json : "release:{environment}:android:{projectName}": "sh release/{projectDir}/      {environment}-android.sh",

                    e.g. "release:dev:android:trivia": "sh release/trivia/dev-android.sh",



        4) release ios app
        
            Add certificates in certificates > {projectName} > {platform} folder
     
            1) release dev

            command: "release:dev:ios:{projectName}": "rm -rf platforms/ios && tns prepare ios --bundle --release  --env.aot --env.uglify --for-device --env.package_name={packageName from firebase}  --env.project={projectName}",

            e.g. "release:dev:ios:trivia": "rm -rf platforms/ios && tns prepare ios --bundle --release  --env.aot --env.uglify --for-device --env.package_name=io.bitwiser.trivia.dev  --env.project=trivia",

            2) release prod

            "release:prod:ios:{projectName}": "rm -rf platforms/ios && tns prepare ios --bundle --release --env.prod --env.aot --env.uglify --for-device --env.package_name={packageName from firebase}  --env.project={projectName}",

            e.g.   "release:prod:ios:trivia": "rm -rf platforms/ios && tns prepare ios --bundle --release --env.prod --env.aot --env.uglify --for-device --env.package_name=io.bitwiser.trivia  --env.project=trivia"



7) Add logo of project in (trivia / trivia-admin) > src > assets > images > logo > {projectName} > add logo and favicon file

8) Add Manifest.json file for (trivia / trivia-admin) > src > assets > manifest > {projectName} 

8) Mobile App Settings
    add google-services settings from firebase Settings > General > Your App android > google.services.json to 
    App_Resources > Android > google-services >  < make project specific folder>

    add google-services settings from firebase Settings > General > Your App ios > googleService-info.plist to 
    App_Resources > IOS > google-services > <make project specific folder>

    add configuration for Android and IOS under configurations folder in project specific folder

    add certificates under certificates folder

9) add icons in folders for App_Resources
    put Drawable screen and logo, icon specific for platform under projects-assets folder 
    platform wise follow the same structure as used in project-assets

10) Add index.html file in (trivia / trivia-admin) > src > assets > index > {projectName} folder


