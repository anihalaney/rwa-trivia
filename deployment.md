How to deploy Firebase functions ?

    1) Add your firebase configurations in environment file under shared library.

    2) Run below command to deploy firebase functions 

        Dev Env : npm run deploy-trivia-functions
        Prod Env : npm run prod:deploy-trivia-functions


How to deploy Android app on Google play store? 

    You can publish a NativeScript app in Google Play the same way you would release a purely native Android app.


    Assumption : Before creating build , nativescript setup should be done in system for android and ios application environment.

     
    1) Follow below steps to create .keystore file 

       -> create directory to store .keystore file
           
          -> mkdir -p certificates/android 
          -> keytool -genkey -v -keystore application_name.keystore -alias application_name-key -keyalg  RSA -keysize  2048 -validity 10000
             
             -> Enter key informations and set password for key & alias

    2) Update app name and facebook app id informations of dev & prod environment in xml file under configuration/android directory .

    3) Update VersionCode in AndroidManifest.xml file placed under App_Resources/Android directory.

    4) Run below command to generate apk file : 

       Dev Env : npm run release:dev:android
       Prod Env : npm run release:prod:android

    5) Deploy App on Google play  store:

       Assumption : user already have google play account 

       1) open https://play.google.com/apps/publish link in browser
       
       2) We can deploy application using two methods
          
           -> Create application and deploy new apk file
           -> Select existing application and deploy updated apk file

        Follow below steps to deploy new application on google play store   
    
         Create Application :

         -> Click on create application and give the name of application 
         -> Fill information of store listing tab 
         -> complete content rating step
         -> complete pricing & distribution step
         -> click on App release tab 
         -> From App release page, scroll down and click on Alpha release 
         -> Click on Create Release and Upload your apk 
         -> Fill the information and  click on Review button
         -> Select Manage Testing accordian and add tester's email under it
         -> Click on Release button at bottom of the screen
         -> You can find app url for alpha testing after complete release process

         Update existing Application version :

         -> Select your application from application list
         -> Now, Select Release Management Option from sidebar
         -> Select App Release option from option
         -> Click on Create Release button from page .
         -> Upload new apk and fill the information
         -> Click on Release button at bottom of the screen
         -> You can find app url for alpha testing after complete release process

How to deploy Ios app on App store? 

Assumption : Ios app deployment will require MAC system and xcode 10 and app developer account

    1) Update CFBundleDisplayName and FacebookAppID, FacebookDisplayName & CFBundleVersion in Info.plist files under configurations/ios directory

    2) Run below command to prepare xcode compatible project 
       
        Dev Env : npm run release:dev:ios
        Prod Env : npm run release:prod:ios

    3) Right click on rwatrivia.xcworkspace directory under platforms/ios directory and select reveal in folder

    4) Now , Right click on rwatrivia.xcworkspace directory and open it in xcode 10

    5) Before creating build, we need to create application account and certificates from app store & developer account

       Follow below process to create certificates and application on app store

       1) Open https://developer.apple.com/account url in browser
       2) select Certificates, Identifiers & Profiles option from sidebar
       3) Select App Ids option under Identifiers section from sidebar 
       4) Click + button and Fill App Name, bundle id and select app services.
       5) Now, App Id is created for your application.
       6) Click on All under Devices option and add uuid of ios devices.
       7) Click on Development option under Certificates and click on + button .
       8) Now, Open Keychain Access Tool on MAC and select keychain Access menu from menubar.
       9) Select Create Assistant submenu from it and create certificate request file using it.
       




    