How to deploy Firebase functions ?

    1) Add your firebase configurations in environment file under shared library.

    2) Run below command to deploy firebase functions 

        Dev Env : node cli deploy-functions --p trivia-staging --pv trivia --e staging
        Prod Env : node cli deploy-functions --p trivia-production --pv trivia --e production
        
    3) Run below command to start scheduler  

        Dev Env : node cli run-schedular --se dev
        Prod Env : node cli run-schedular --se prod


How to deploy Android app on Google play store? 

    You can publish a NativeScript app in Google Play the same way you would release a purely native Android app.


    Assumption : Before creating build , nativescript setup should be done in system for android and ios application environment.

     
    1) Follow below steps to create .keystore file 

       -> create directory to store .keystore file
           
          -> mkdir -p certificates/android 
          -> keytool -genkey -v -keystore application_name.keystore -alias application_name-key -keyalg  RSA -keysize  2048 -validity 10000
             
             -> Enter key informations and set password for key & alias

    2) Update app name and facebook app id informations of dev & prod environment in xml file under configuration/android directory .


    3) Run below command to generate apk file : 

       Dev Env : node cli release-mobile --pv trivia --pk io.bitwiser.trivia.dev --plt android --e staging 
                    --keyStorePassword <keyStorePassword> --keyStoreAlias <keyStoreAlias> --keyStoreAliasPassword <keyStoreAliasPassword> --v <versionCode>
       Prod Env : node cli release-mobile --pv trivia --pk io.bitwiser.trivia --plt android --e production 
                    --keyStorePassword <keyStorePassword> --keyStoreAlias <keyStoreAlias> --keyStoreAliasPassword <keyStoreAliasPassword> --v <versionCode>

    4) Deploy App on Google play  store:

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
       
        Dev Env : node cli release-mobile --pv trivia --pk io.bitwiser.trivia.dev --plt ios --e dev 
        Prod Env : node cli release-mobile --pv trivia --pk io.bitwiser.trivia --plt ios --e production

    3) Right click on rwatrivia.xcworkspace directory under platforms/ios directory and select reveal in folder

    4) Now , Right click on rwatrivia.xcworkspace directory and open it in xcode 10

    5) Before creating build, we need to create application account and certificates from app store & developer account

       Follow below process to create certificates and application on app store

       1) Open https://developer.apple.com/account url in browser

       -> Steps to create App Id

       2) select Certificates, Identifiers & Profiles option from sidebar
       3) Select App Ids option under Identifiers section from sidebar 
       4) Click + button and Fill App Name, bundle id and select app services (like APN service).
       5) Now, App Id is created for your application.

       -> Steps to insert devices .

       6) Click on All under Devices option and add uuid of ios devices.

       -> Steps to create Push Notification certificate.

       7) Select All option from Keys and click + button.
       8) Give name to certificate , select APN service and generate certificate.
       9) Download the certificate and double click on the file.

       Note : create certificates for Dev and production environment. 

       -> Steps to create App on App store.

       10) Open https://appstoreconnect.apple.com url in browser .
       11) Click on + button and Fill the New App Information, select bundle id and submit the form.

   6) Now, we have certificates and  app on app store.
   7) From Xcode select Automatically manage signing option from General configuration.
   8) Select Development Provisional certificate from dropdown in Signing(Debug) section.
   9) Select Distribution Provisional certificate from dropdown in Signing(Release) section.
   10) Select Capabilities tab from tabs.
   11) Enable Push Notifications from options.
   12) Now, Select Generic iOs Device in device selection at topbar
   13) Select Archive option from Product Menu of xcode.
   14) Now, Build will be generated.
   15) Once build will be generated , upload window will be opened.
   16) Select Distribute App option and complete the steps.
   17) Once App will be uploaded , close the xcode and other window.
   18) Open https://appstoreconnect.apple.com url in browser .
   19) Select Activity Tab from Tabs.
   20) App store will display result as Processing.
   21) Once status will be changed, select Test Flight option.
   22) Click on uploaded version App .
   23) Now, Select Add Testers to Build option and give encryption as NO status & submit it.
   24) Add Store Connect Users and External Testers and invite users.
   25) Bingo ! your app is uploaded now.


       

       




    