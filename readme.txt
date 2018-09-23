Quick Installation Deployment Instructions:

  1) Git clone
  
  2) Register in google firebase console
  
  3) Create new App in firebase

  4) You have allowed sign in method for authentication in firebase. 
	Go -> firebase console -> YOUR PROJECT -> Develop -> Authentication -> sign-in method.

  5) Copy and past firebase details in environment file

  6) Install firebase tools globally
     
     npm install -g firebase-tools

  7) Traverse in Functions folder and  install node_modules   

     npm install

  8) Authenticate with your firebase credentials
  
     firebase login    

  9) Initialize Firebase
     
     firebase init
	
     Firebase will ask you few question for setup firebase.

		1) Which Firebase CLI features do you want to setup for this folder?
			-- Select Option:: Functions: Configure and deploy Cloud Functions -> press enter

		2) Select language option
			 What language would you like to use to write Cloud Functions? (Use arrow keys)
			 -- Select Option: Javascript 
		3) Don't replace create new package.json and tsconfig.json file

  10) Run below command : Deploy Site to firebase
			- npm run compile-functions
			- firebase serve --only functions
		        This will generate functionsUrl. You need to put this url in enviornment file.

  11) You need to index key also: 
		1) Group Collection : games
		   Fields indexed: gameOver ASC playerId_1 ASC turnAt DESC
                2) Group Collection : games
		   Fields indexed: GameStatus ASC gameOver ASC playerId_1 ASC turnAt DESC
		3) Group Collection : games
		   Fields indexed: gameOver ASC playerId_0 ASC turnAt DESC


 12)  Setup Elasticsearch:

      NOTE: Upgrade to Firebase plan to ‘Blaze’ to allow for network connection to the Elasticsearch VM otherwise elasticsearch will not working.
      Set Enviroment variables to identify correct elasticsearch index :
  
     i) set Environment variable using below command :

        firebase -P production functions:config:set elasticsearch.index.production=true

     ii) check Environment variable using below command :

        firebase -P production functions:config:get

13)  Go outside of functions folder and run below command to deploy API on server
  
      Dev server -> npm run deploy-functions
      Production server -> npm run prod:deploy-functions    

14)  Run below command to deploy UI on server

      Dev server -> npm run deploy-app-to-firebase
      Production server -> npm run prod:deploy-app-to-firebase   

15) Run scheduler job to check expired games  

      Dev server -> npm run run-scheduler-dev
      Production server -> npm run run-scheduler-prod


Update mail configuration file with correct credentials and add it into functions/config folder of API

   1) place below json file with name mail.config.json in functions/config folder

      {
        "host": "YOUR_HOST",
        "port": 587,
        "secure": false,
        "auth": {
                  "user": "YOUR_EMAIL_USERNAME",
                  "pass": "YOUR_EMAIL_PASSWORD"
                },
        "hosturl": "https://FIREBASE_URL/invitation-redirection/",
        "enableMail": false
      }

    2) Update below json file with name elasticsearch.config.json infunctions/config folder
	{
  	 "hosts": [
                 "https://YOUR_HOST_IP:PORT",
                 "https://YOUR_HOST_IP:PORT", // IF you have mulitple host		  ],
		  "log": "error",
		  "httpAuth": "YOUR_USER_NAME:YOUR_PASSWORD",
		  "ssl": {
		      "rejectUnauthorized": false
		  }	
	}


Setup CORS configuration for firebase storage 

  1) Follow below link to setup gsutil in server 
 
      https://cloud.google.com/storage/docs/gsutil_install#linux

  2) setup cors.json and add it in gsutil as per command suggested in link
      
       https://developer.bitmovin.com/hc/en-us/articles/360000059353-How-do-I-set-up-CORS-for-my-Google-Cloud-Storage-Bucket-       


API calls : 

  1) Generate User Stat

	   URL: https://FIREBASE_URL/app/user/stat
	   Method: GET

  2) Generate LeaderBoard Stat
   
	   URL: https://FIREBASE_URL/app/leaderboard/stat
	   Method: GET

  3) Generate User Contribution Stat
  
	   URL:  https://FIREBASE_URL/app/user/contribution/stat
	   Method: GET

  4) Generate System Stat
   
	   URL:  https://FIREBASE_URL/app/stat/system
	   Method: POST  

  5) Update Bulk upload files data with flags
   
	   URL:  https://FIREBASE_URL/app/bulkupload/update
	   Method: GET   


  6) Rebuild Question Index
   
	   URL:  https://FIREBASE_URL/app/rebuild/question/index
	   Method: GET 

  7) Generate Blog Data
   
     URL:  https://FIREBASE_URL/app/general/blog
     Method: POST

     Note : Call the API with token added in db  

  8) update question collection 
   
     URL:  https://FIREBASE_URL/app/general/question/update/unpublished_questions
     URL:  https://FIREBASE_URL/app/general/question/update/questions
     Method: POST


  9) update users collection 
   
     URL:  https://FIREBASE_URL/app/general/auth-users
     Method: POST   
     
     Note : Call the API with token added in db  

Note : User Admin User Authorization Header while calling API 


Rules Updates:

   1) Update Firestore, Firestorage Rules from dev to production. 



