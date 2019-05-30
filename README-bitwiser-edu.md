# Bitwiser-edu app

## Quick Installation Instructions For New Project

1) Add your firebase configurations in environment file under shared library.

    put your environment files under directory with specific project name
    
    Add new configuration for project in angular.json 
        
        1) Trivia

            add new configurations for dev, staging and production in angular.json projects > trivia > architect > build > configurations and projects > trivia > architect > serve > configurations

        2) Trivia-admin

            add new configurations for dev, staging and production in angular.json projects > trivia-admin > architect > build > configurations and projects > trivia-admin > architect > serve > configurations

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
    Add Config for specific project under functions > Configs folder add non-confidential information in this file

4) Add commands in package.json to run project in dev, staging, production for trivia and trivia-admin

5) Add commands in package.json to deploy functions

6) Add commands in package.json for Mobile App

7) Add logo of project in trivia > src > assets > logo folder

8) Mobile App Settings
    add google-services settings from firebase Settings > General > Your App android > google.services.json to 
    App_Resources > Android > google-services >  < make project specific folder>

    add google-services settings from firebase Settings > General > Your App ios > googleService-info.plist to 
    App_Resources > IOS > google-services > <make project specific folder>

    add configuration for Android and IOS under configurations folder in project specific folder

    add certificates


