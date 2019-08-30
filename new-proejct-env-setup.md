
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

4) For commands refer commands.md

5)  release android/ios app

    1 ) make changes in current trivia project release folder for android release

        put .sh files for dev and prod environment in project specific folder 
        e.g. release > trivia > prod-android.sh

        add new folder in release and add release file

        specify --env.project={projectName} in release command in {environment}.{platform}.sh

    2) add certificates in current trivia certificate folder for android/ios

        directory structure : certificate > {projectName} > {platform} > {certificate files}
        e.g. certificates > trivia > android > {certificate file}

6) Add logo of project in (trivia / trivia-admin) > src > assets > images > logo > {projectName} > add logo and favicon file

7) Add Manifest.json file for (trivia / trivia-admin) > src > assets > manifest > {projectName} 

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


