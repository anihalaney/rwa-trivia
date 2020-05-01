export const TEST_DATA = {
    "categories": [
        { "id": 1, "categoryName": "Special" },
        { "id": 2, "categoryName": "Programming" },
        { "id": 3, "categoryName": "Architecture" },
        { "id": 4, "categoryName": "Networking/Infrastructure" },
        { "id": 5, "categoryName": "Database" },
        { "id": 6, "categoryName": "Dev Ops" },
        { "id": 7, "categoryName": "UX/UI" }
    ],
    "categoryDictionary": {
        "1": {
          "id": 1,
          "categoryName": "Bit of sci-fi",
          "requiredForGamePlay": true
        },
        "2": {
          "id": 2,
          "categoryName": "Programming",
          "requiredForGamePlay": false
        },
        "3": {
          "id": 3,
          "categoryName": "Architecture",
          "requiredForGamePlay": false
        },
        "4": {
          "id": 4,
          "categoryName": "Networking/Infrastructure",
          "requiredForGamePlay": false
        },
        "5": {
          "id": 5,
          "categoryName": "Database",
          "requiredForGamePlay": false
        },
        "6": {
          "id": 6,
          "categoryName": "Dev Ops",
          "requiredForGamePlay": false
        },
        "7": {
          "id": 7,
          "categoryName": "UX/UI",
          "requiredForGamePlay": false
        },
        "8": {
          "id": 8,
          "categoryName": "Bit of fact",
          "requiredForGamePlay": true
        },
        "9": {
          "id": 9,
          "categoryName": "Hardware",
          "requiredForGamePlay": false
        }
      },
    "tagList": [
        "C#",
        "iOS",
        "Objective-C",
        "Swift",
        "Mobile",
        "Cloud",
        "AWS",
        "Azure",
        "Open Source",
        "NoSql",
        "SQL",
        "SQL Server",
        "MongoDB",
        "CI",
        "Selenium",
        "Agile",
        "Scrum",
        "Waterfall",
        "SDLC",
        "BI",
        "IoT",
        "Social",
        "Windows",
        "iPhone",
        "Analytics",
        "Data",
        "UX",
        "UI",
        "Python",
        "VB",
        ".Net",
        "ASP.Net",
        "Unity",
        "DI",
        "EF",
        "ORM",
        "Spring",
        "Hibernate",
        "Oracle",
        "DB2",
        "Java",
        "Ruby",
        "Rails",
        "MySQL",
        "Postgres",
        "Enterprise",
        "Active Directory",
        "C",
        "C++",
        "REST",
        "API",
        "SDK",
        "SharePoint",
        "CRM",
        "Dynamics CRM",
        "Salesforce",
        "JavaScript",
        "AngularJS",
        "MVC",
        "MVP",
        "MVVM",
        "View",
        "Controller",
        "Model",
        "Cassandra",
        "DocumentDB",
        "ColumnDB",
        "Elastic Search",
        "Neo4J",
        "GraphDB",
        "KeyValue",
        "Hadoop",
        "HBase",
        "Pig",
        "Hive",
        "Zookeeper",
        "Linux",
        "Mac OS",
        "Motherboard",
        "Apache",
        "Cordova",
        "SPA",
        "PhoneGap",
        "Universal Apps",
        "Xamarin",
        "Eclipse",
        "PHP",
        "T-SQL",
        "Stored Procedure",
        "Trigger",
        "NTFS",
        "Journaled",
        "BootCamp",
        "Office 365",
        "POP",
        "IMAP",
        "SMTP",
        "TCP/IP",
        "IP Address",
        "Domain Controller",
        "DNS",
        "DHCP",
        "SATA",
        "USB",
        "HDMI",
        "Firewire",
        "Lightening",
        "Edison",
        "Galileo",
        "Arduino",
        "Rasberry Pi",
        "TypeScript",
        "CoffeeScript",
        "jQuery",
        "3D Printer",
        "CAD",
        "Photoshop",
        "Illustrator",
        "jpg",
        "png",
        "Partition",
        "Unix",
        "kernel",
        "SOAP",
        "Authentication",
        "OAuth",
        "OpenID",
        "BitCoin",
        "ASP",
        "Mainframe",
        "Storyboard",
        "XCode",
        "AirDrop",
        "Bluetooth",
        "BLE",
        "ApplePay",
        "App Store",
        "Metal",
        "Pattern",
        "Distributed",
        "GIT"
    ],
    "questions": {
        "published": [
            {
                "id": "1",
                "questionText": "Which of the following function of Array object reverses the order of the elements of an array?",
                "answers": [
                    {
                        "id": 1,
                        "answerText": "reverse()",
                        "correct": true
                    },
                    {
                        "id": 2,
                        "answerText": "push()",
                        "correct": false
                    },
                    {
                        "id": 3,
                        "answerText": "reduce()",
                        "correct": false
                    },
                    {
                        "id": 4,
                        "answerText": "reduceRight()",
                        "correct": false
                    }
                ],
                "ordered": false,
                "tags": ["JavaScript", "front-end", "ES5"],
                "categoryIds": [2]
            },
            {
                "id": "2",
                "questionText": "Which of the following function of Array object calls a function for each element in the array?",
                "answers": [
                    {
                        "id": 1,
                        "answerText": "concat()",
                        "correct": false
                    },
                    {
                        "id": 2,
                        "answerText": "every()",
                        "correct": false
                    },
                    {
                        "id": 3,
                        "answerText": "filter()",
                        "correct": false
                    },
                    {
                        "id": 4,
                        "answerText": "forEach()",
                        "correct": true
                    }
                ],
                "ordered": false,
                "tags": ["JavaScript", "front-end"],
                "categoryIds": [2]
            },
            {
                "id": "3",
                "questionText": "Which of the following function of String object returns the index within the calling String object of the first occurrence of the specified value?",
                "answers": [
                    {
                        "id": 1,
                        "answerText": "firstIndexOf()",
                        "correct": false
                    },
                    {
                        "id": 2,
                        "answerText": "lastIndexOf()",
                        "correct": false
                    },
                    {
                        "id": 3,
                        "answerText": "indexOf()",
                        "correct": true
                    },
                    {
                        "id": 4,
                        "answerText": "search()",
                        "correct": false
                    }
                ],
                "ordered": false,
                "tags": ["JavaScript"],
                "categoryIds": [2]
            },
            {
                "id": "4",
                "questionText": "Which of the following function of Boolean object returns a string containing the source of the Boolean object?",
                "answers": [
                    {
                        "id": 1,
                        "answerText": "valueOf()",
                        "correct": false
                    },
                    {
                        "id": 2,
                        "answerText": "toSource()",
                        "correct": true
                    },
                    {
                        "id": 3,
                        "answerText": "indexOf()",
                        "correct": false
                    },
                    {
                        "id": 4,
                        "answerText": "toString()",
                        "correct": false
                    }
                ],
                "ordered": false,
                "tags": ["JavaScript"],
                "categoryIds": [2]
            },
            {
                "id": "5",
                "questionText": "Which of the following is true about cookie handling in JavaScript?",
                "answers": [
                    {
                        "id": 1,
                        "answerText": "JavaScript can manipulate cookies using the cookie property of the Document object.",
                        "correct": false
                    },
                    {
                        "id": 2,
                        "answerText": "JavaScript can read, create, modify, and delete the cookie or cookies that apply to the current web page.",
                        "correct": false
                    },
                    {
                        "id": 3,
                        "answerText": "All of the above.",
                        "correct": true
                    },
                    {
                        "id": 4,
                        "answerText": "None of the above.",
                        "correct": false
                    }
                ],
                "ordered": true,
                "tags": ["JavaScript", "ES5"],
                "categoryIds": [2]
            },
            {
                "id": "6",
                "questionText": "What's the best Trivia game?",
                "answers": [
                    {
                        "id": 1,
                        "answerText": "Quiz Up",
                        "correct": false
                    },
                    {
                        "id": 2,
                        "answerText": "Trivia Crack",
                        "correct": false
                    },
                    {
                        "id": 3,
                        "answerText": "The one I'm playing",
                        "correct": true
                    },
                    {
                        "id": 4,
                        "answerText": "It's subjective",
                        "correct": false
                    }
                ],
                "ordered": false,
                "tags": ["gaming"],
                "categoryIds": [1]
            }
        ],
        "unpublished": []
    },
    "userList": [
        {
            "androidPushTokens": [
              {
                "online": false,
                "token": "ct7vhZOa__U:APA91bFCVEncCZg__c0P8kZo2k0WfCB_nVUds4sViaQiyPmUX7VUf29vfKUEQ4jRQ5BRq9BMRNdZDrVIVgMH-fGB6f1AEXXca4TAjPOGoaFVjKMA7952BMuaLy4-Z9-y0EC76abGDPsJ"
              }
            ],
            "authState": null,
            "bulkUploadPermissionStatus": 'false',
            "bulkUploadPermissionStatusUpdateTime" : 1588266851711,
            "croppedImageUrl": '',
            "originalImageUrl": '',
            "imageType": '',
            "gamePlayed": [],
            "captured": "web",
            "categoryIds": [
              2,
              8,
              3,
              4,
              5,
              9,
              7
            ],
            "displayName": "Priyanka 124",
            "email": "priyankamavani99+124@gmail.com",
            "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4ODQ4YjVhZmYyZDUyMDEzMzFhNTQ3ZDE5MDZlNWFhZGY2NTEzYzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcndhLXRyaXZpYS1kZXYtZTU3ZmMiLCJhdWQiOiJyd2EtdHJpdmlhLWRldi1lNTdmYyIsImF1dGhfdGltZSI6MTU4NzEyMTIwNiwidXNlcl9pZCI6IjRrRmE2SFJ2UDVPaHZZWHNIOW1Fc1JyWGo0bzIiLCJzdWIiOiI0a0ZhNkhSdlA1T2h2WVhzSDltRXNSclhqNG8yIiwiaWF0IjoxNTg4MjY0OTIzLCJleHAiOjE1ODgyNjg1MjMsImVtYWlsIjoicHJpeWFua2FtYXZhbmk5OSsxMjRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInByaXlhbmthbWF2YW5pOTkrMTI0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.PYorEbISiEgg728CNYxvFcJU4PxCvts50IoumdTN39xF9yKQl0t1rZt8CkNjPu9lP_eZcvbxHPET583LhqiVR6E-HjxMACV23tTrSpJlEfi3FTcG4BlELDNOIt529Il0xYlDJaLCTnT8D3uJV79dBpyFYQ9tP3RRXxTdJv4HZXYbjiXLmuK3tOwLiLzI_ZWgFDfpYHqg17bJKTtfjTC7blorhpZYfDDrc6BH4y3aJaN84CJtIhTeN4fNePjEBRWDWa3hNZs2lDik5eslRWXP8HR09k4c251UKw1vcehZm-ISzYSVuYHCMoK9eDjB2Hj4qx6oRhdbJh_WiRul_WvPEw",
            "isAutoComplete": false,
            "isCategorySet": true,
            "location": "Surendranagar,Gujarat",
            "phoneNo": null,
            "profilePictureUrl": "/assets/images/default-avatar-small.png",
            "tags": [
              
            ],
            "totalFriends": 0,
            "userId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2"
          },
          {
            "androidPushTokens": [
              {
                "online": false,
                "token": "ct7vhZOa__U:APA91bFCVEncCZg__c0P8kZo2k0WfCB_nVUds4sViaQiyPmUX7VUf29vfKUEQ4jRQ5BRq9BMRNdZDrVIVgMH-fGB6f1AEXXca4TAjPOGoaFVjKMA7952BMuaLy4-Z9-y0EC76abGDPsJ"
              }
            ],
            "authState": null,
            "bulkUploadPermissionStatus": 'false',
            "bulkUploadPermissionStatusUpdateTime" : 1588266851711,
            "croppedImageUrl": '',
            "originalImageUrl": '',
            "imageType": '',
            "gamePlayed": [],
            "captured": "web",
            "categoryIds": [
              2,
              8,
              3,
              4,
              5,
              9,
              7
            ],
            "displayName": "Priyanka 124",
            "email": "priyankamavani99+124@gmail.com",
            "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4ODQ4YjVhZmYyZDUyMDEzMzFhNTQ3ZDE5MDZlNWFhZGY2NTEzYzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcndhLXRyaXZpYS1kZXYtZTU3ZmMiLCJhdWQiOiJyd2EtdHJpdmlhLWRldi1lNTdmYyIsImF1dGhfdGltZSI6MTU4NzEyMTIwNiwidXNlcl9pZCI6IjRrRmE2SFJ2UDVPaHZZWHNIOW1Fc1JyWGo0bzIiLCJzdWIiOiI0a0ZhNkhSdlA1T2h2WVhzSDltRXNSclhqNG8yIiwiaWF0IjoxNTg4MjY0OTIzLCJleHAiOjE1ODgyNjg1MjMsImVtYWlsIjoicHJpeWFua2FtYXZhbmk5OSsxMjRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInByaXlhbmthbWF2YW5pOTkrMTI0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.PYorEbISiEgg728CNYxvFcJU4PxCvts50IoumdTN39xF9yKQl0t1rZt8CkNjPu9lP_eZcvbxHPET583LhqiVR6E-HjxMACV23tTrSpJlEfi3FTcG4BlELDNOIt529Il0xYlDJaLCTnT8D3uJV79dBpyFYQ9tP3RRXxTdJv4HZXYbjiXLmuK3tOwLiLzI_ZWgFDfpYHqg17bJKTtfjTC7blorhpZYfDDrc6BH4y3aJaN84CJtIhTeN4fNePjEBRWDWa3hNZs2lDik5eslRWXP8HR09k4c251UKw1vcehZm-ISzYSVuYHCMoK9eDjB2Hj4qx6oRhdbJh_WiRul_WvPEw",
            "isAutoComplete": false,
            "isCategorySet": true,
            "location": "Surendranagar,Gujarat",
            "phoneNo": null,
            "profilePictureUrl": "/assets/images/default-avatar-small.png",
            "tags": [
              
            ],
            "totalFriends": 0,
            "userId": "yP7sLu5TmYRUO9YT4tWrYLAqxSz1"
          }

    ],

    "userDict": {
        'ssHmHkKq9BPByP9c4CtmEqvO4xp2': {
            "userId": "ssHmHkKq9BPByP9c4CtmEqvO4xp2",
            "displayName": "trivia",
            "email": "trivia@realworldfullstack.io",
            "roles": {},
            "authState": null
        }
    },

    "leaderBoard": {
        "1": [
            { "score": 123, "userId": "ssHmHkKq9BPByP9c4CtmEqvO4xp2" },
            { "score": 406, "userId": "ssHmHkKq9BPByo9c4CtmEqvO4xp2" },
            { "score": 10, "userId": "ssHmHkKq9BPSyP9c4CtmEqvO4xp2" },
            { "score": 80, "userId": "ssHmHkKq9BPSyP9c4CtmEqvO4xp2" },
            { "score": 100, "userId": "ssHmHkKq9BPPyP9c4CtmEqvO4xp2" },
            { "score": 102, "userId": "ssHmHkKq9BPYyP9c4CtmEqvO4xp2" },
            { "score": 109, "userId": "ssHmHkKq9BPOyP9c4CtmEqvO4xp2" },
            { "score": 105, "userId": "ssHmHkKq9BPLyP9c4CtmEqvO4xp2" },
            { "score": 1000, "userId": "ssHmHkKq9BPRyP9c4CtmEqvO4xp2" },
            { "score": 50, "userId": "ssHmHkKq9BPTyP9c4CtmEqvO4xp2" }
        ],
        "2": [
            { "score": 100, "userId": "ssHmHkKq9BPByP9c4CtmEqvO4xp2" },
            { "score": 40, "userId": "ssHmHkKq9BPByo9c4CtmEqvO4xp2" },
            { "score": 54, "userId": "ssHmHkKq9BPSyP9c4CtmEqvO4xp2" },
            { "score": 100, "userId": "ssHmHkKq9BPPyP9c4CtmEqvO4xp2" },
            { "score": 102, "userId": "ssHmHkKq9BPYyP9c4CtmEqvO4xp2" },
            { "score": 109, "userId": "ssHmHkKq9BPOyP9c4CtmEqvO4xp2" },
            { "score": 105, "userId": "ssHmHkKq9BPLyP9c4CtmEqvO4xp2" },
            { "score": 1000, "userId": "ssHmHkKq9BPRyP9c4CtmEqvO4xp2" },
            { "score": 50, "userId": "ssHmHkKq9BPTyP9c4CtmEqvO4xp2" },
            { "score": 50, "userId": "ssHmHkKq9BPTyP9c4CtmEqvO4xp2" }],
        "3": [
            { "score": 5, "userId": "ssHmHkKq9BPByP9c4CtmEqvO4xp2" },
            { "score": 80, "userId": "ssHmHkKq9BPByo9c4CtmEqvO4xp2" },
            { "score": 500, "userId": "ssHmHkKq9BPSyP9c4CtmEqvO4xp2" },
            { "score": 100, "userId": "ssHmHkKq9BPPyP9c4CtmEqvO4xp2" },
            { "score": 102, "userId": "ssHmHkKq9BPYyP9c4CtmEqvO4xp2" },
            { "score": 109, "userId": "ssHmHkKq9BPOyP9c4CtmEqvO4xp2" },
            { "score": 105, "userId": "ssHmHkKq9BPLyP9c4CtmEqvO4xp2" },
            { "score": 1000, "userId": "ssHmHkKq9BPRyP9c4CtmEqvO4xp2" },
            { "score": 50, "userId": "ssHmHkKq9BPTyP9c4CtmEqvO4xp2" },
            { "score": 50, "userId": "ssHmHkKq9BPTyP9c4CtmEqvO4xp2" }
        ]
    },
    blog: [{
        'author': 'Akshay Nihalaney',
        'blogNo': 0,
        'categories': [
            "angular",
            "jasmine",
            "jest",
            "testing",
            "protractor"],
        'commentCount': 5,
        'content': 'test',
        'guid': 'https://medium.com/p/6a0e03a89038',
        'id': 1532279340000,
        'link': 'https://blog.realworldfullstack.io/real-world-app-part-22-angular-testing-with-protractor-jasmine-and-jest-6a0e03a89038?source=rss----5fcb8756dcc3---4',
        'pubDate': "2018-07-22 17:09:00",
        'share_status': false,
        'subtitle': "End to end testing with Protractor and unit tests with Jest",
        'thumbnail': "https://cdn-images-1.medium.com/max/1024/1*VAuIh4dq6BxKDL8yXmGMTw.jpeg",
        'title': "Real World App - Part 22: Angular Testing with Protractor, Jasmine and Jest",
        'viewCount': 100,
        'created_uuid': 'ssHmHkKq9BPByP9c4CtmEqvO4xp2'
    }
    ],
    realTimeStats:
        {
            'active_games': 2,
            'game_played': 2518,
            'total_questions': 106,
            'total_users': 67
        },
    "game": [
        {
            "gameOptions": {
                "categoryIds": [
                    1,
                    8,
                    2,
                    3,
                    4,
                    5,
                    7,
                    9
                ],
                "gameMode": 0,
                "isBadgeWithCategory": true,
                "isChallenge": false,
                "maxQuestions": 8,
                "opponentType": 0,
                "playerMode": 1,
                "tags": []
            },
            "playerIds": [
                "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                "yP7sLu5TmYRUO9YT4tWrYLAqxSz1"
            ],
            "nextTurnPlayerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
            "gameOver": true,
            "playerQnAs": [
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "0OpXYFZSk505ra1jW6fb",
                    "addedOn": 1587463516000,
                    "playerAnswerId": "0",
                    "playerAnswerInSeconds": 2,
                    "answerCorrect": true,
                    "round": 1,
                    "categoryId": [
                        5
                    ],
                    "badge": {
                        "name": "scissors",
                        "won": true
                    },
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "T5NYSrY4BrlwI2j2zFz4",
                    "addedOn": 1587463525000,
                    "playerAnswerId": "1",
                    "playerAnswerInSeconds": 3,
                    "answerCorrect": true,
                    "round": 1,
                    "categoryId": [
                        2
                    ],
                    "badge": {
                        "name": "paper",
                        "won": true
                    },
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "0POnDURRgIGOs9kU2nLH",
                    "addedOn": 1587463537000,
                    "playerAnswerId": "3",
                    "playerAnswerInSeconds": 1,
                    "answerCorrect": false,
                    "round": 1,
                    "categoryId": [
                        8
                    ],
                    "badge": {
                        "name": "lizard",
                        "won": false
                    },
                    "isReported": false
                },
                {
                    "playerId": "yP7sLu5TmYRUO9YT4tWrYLAqxSz1",
                    "questionId": "3o2wdaX1HzBWtKZCLGi6",
                    "addedOn": 1587463593000,
                    "playerAnswerId": "2",
                    "playerAnswerInSeconds": 3,
                    "answerCorrect": true,
                    "round": 1,
                    "categoryId": [
                        8
                    ],
                    "badge": {
                        "name": "lizard",
                        "won": true
                    },
                    "isReported": false
                },
                {
                    "playerId": "yP7sLu5TmYRUO9YT4tWrYLAqxSz1",
                    "questionId": "4h2XmfCQH1fVP7LtLN26",
                    "addedOn": 1587463604000,
                    "playerAnswerId": "0",
                    "playerAnswerInSeconds": 1,
                    "answerCorrect": false,
                    "round": 1,
                    "categoryId": [
                        2
                    ],
                    "badge": {
                        "name": "rock",
                        "won": false
                    },
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "GkHDJPwUUYF8C57hBTfU",
                    "addedOn": 1587463649000,
                    "playerAnswerId": "1",
                    "playerAnswerInSeconds": 2,
                    "answerCorrect": true,
                    "round": 2,
                    "categoryId": [
                        3
                    ],
                    "badge": {
                        "name": "rock",
                        "won": true
                    },
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "7YPp6rOYJZ1LjUK0E3qy",
                    "addedOn": 1587463658000,
                    "playerAnswerId": "0",
                    "playerAnswerInSeconds": 2,
                    "answerCorrect": true,
                    "round": 2,
                    "categoryId": [
                        8
                    ],
                    "badge": {
                        "name": "lizard",
                        "won": true
                    },
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "GMwmK5ckSoQuRXRpB0jb",
                    "addedOn": 1587463668000,
                    "playerAnswerId": "0",
                    "playerAnswerInSeconds": 2,
                    "answerCorrect": true,
                    "round": 2,
                    "categoryId": [
                        4
                    ],
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "gqyxSCBlWNIL3IUJnop1",
                    "addedOn": 1587463678000,
                    "playerAnswerId": "0",
                    "playerAnswerInSeconds": 2,
                    "answerCorrect": true,
                    "round": 2,
                    "categoryId": [
                        4
                    ],
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "NmK5ApBbcqV7t3JVZGTh",
                    "addedOn": 1587463686000,
                    "playerAnswerId": "1",
                    "playerAnswerInSeconds": 5,
                    "answerCorrect": false,
                    "round": 2,
                    "categoryId": [
                        4
                    ],
                    "isReported": false
                },
                {
                    "playerId": "yP7sLu5TmYRUO9YT4tWrYLAqxSz1",
                    "questionId": "ZvRtEegq8CPySojR6RUd",
                    "addedOn": 1587463734000,
                    "playerAnswerId": "1",
                    "playerAnswerInSeconds": 2,
                    "answerCorrect": false,
                    "round": 2,
                    "categoryId": [
                        2
                    ],
                    "badge": {
                        "name": "paper",
                        "won": false
                    },
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "USxShnwfA65wkxs2X9rY",
                    "addedOn": 1587463742000,
                    "playerAnswerId": "2",
                    "playerAnswerInSeconds": 1,
                    "answerCorrect": true,
                    "round": 3,
                    "categoryId": [
                        4
                    ],
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "544BhjgXE070vNC0II5q",
                    "addedOn": 1587463751000,
                    "playerAnswerId": "1",
                    "playerAnswerInSeconds": 8,
                    "answerCorrect": true,
                    "round": 3,
                    "categoryId": [
                        4
                    ],
                    "isReported": false
                },
                {
                    "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                    "questionId": "8QgcZTS0cQAokNG7oqQr",
                    "addedOn": 1587463775000,
                    "playerAnswerId": "1",
                    "playerAnswerInSeconds": 4,
                    "answerCorrect": true,
                    "round": 3,
                    "categoryId": [
                        9
                    ],
                    "isReported": false
                }
            ],
            "gameId": "vTzY3HeUvy9lXxaGHa0d",
            "GameStatus": "waiting for next question",
            "createdAt": 1587463514000,
            "turnAt": 1588206930838,
            "gameOverAt": 1587463792000,
            "reminder32Min": false,
            "reminder8Hr": false,
            "stats": {
                "4kFa6HRvP5OhvYXsH9mEsRrXj4o2": {
                    "avgAnsTime": 2,
                    "badge": [
                        "scissors",
                        "paper",
                        "rock",
                        "lizard"
                    ],
                    "consecutiveCorrectAnswers": 1,
                    "score": 10
                },
                "yP7sLu5TmYRUO9YT4tWrYLAqxSz1": {
                    "avgAnsTime": 2,
                    "badge": [
                        "lizard"
                    ],
                    "consecutiveCorrectAnswers": 0,
                    "score": 1
                }
            },
            "round": 3
        },
        {
          "gameOptions": {
              "categoryIds": [
                  1,
                  8,
                  2,
                  3,
                  4,
                  5,
                  7,
                  9
              ],
              "gameMode": 0,
              "isBadgeWithCategory": true,
              "isChallenge": false,
              "maxQuestions": 8,
              "opponentType": 0,
              "playerMode": 1,
              "tags": []
          },
          "playerIds": [
              "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
              "yP7sLu5TmYRUO9YT4tWrYLAqxSz1"
          ],
          "nextTurnPlayerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
          "gameOver": true,
          "playerQnAs": [
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "0OpXYFZSk505ra1jW6fb",
                  "addedOn": 1587463516000,
                  "playerAnswerId": "0",
                  "playerAnswerInSeconds": 2,
                  "answerCorrect": true,
                  "round": 1,
                  "categoryId": [
                      5
                  ],
                  "badge": {
                      "name": "scissors",
                      "won": true
                  },
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "T5NYSrY4BrlwI2j2zFz4",
                  "addedOn": 1587463525000,
                  "playerAnswerId": "1",
                  "playerAnswerInSeconds": 3,
                  "answerCorrect": true,
                  "round": 1,
                  "categoryId": [
                      2
                  ],
                  "badge": {
                      "name": "paper",
                      "won": true
                  },
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "0POnDURRgIGOs9kU2nLH",
                  "addedOn": 1587463537000,
                  "playerAnswerId": "3",
                  "playerAnswerInSeconds": 1,
                  "answerCorrect": false,
                  "round": 1,
                  "categoryId": [
                      8
                  ],
                  "badge": {
                      "name": "lizard",
                      "won": false
                  },
                  "isReported": false
              },
              {
                  "playerId": "yP7sLu5TmYRUO9YT4tWrYLAqxSz1",
                  "questionId": "3o2wdaX1HzBWtKZCLGi6",
                  "addedOn": 1587463593000,
                  "playerAnswerId": "2",
                  "playerAnswerInSeconds": 3,
                  "answerCorrect": true,
                  "round": 1,
                  "categoryId": [
                      8
                  ],
                  "badge": {
                      "name": "lizard",
                      "won": true
                  },
                  "isReported": false
              },
              {
                  "playerId": "yP7sLu5TmYRUO9YT4tWrYLAqxSz1",
                  "questionId": "4h2XmfCQH1fVP7LtLN26",
                  "addedOn": 1587463604000,
                  "playerAnswerId": "0",
                  "playerAnswerInSeconds": 1,
                  "answerCorrect": false,
                  "round": 1,
                  "categoryId": [
                      2
                  ],
                  "badge": {
                      "name": "rock",
                      "won": false
                  },
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "GkHDJPwUUYF8C57hBTfU",
                  "addedOn": 1587463649000,
                  "playerAnswerId": "1",
                  "playerAnswerInSeconds": 2,
                  "answerCorrect": true,
                  "round": 2,
                  "categoryId": [
                      3
                  ],
                  "badge": {
                      "name": "rock",
                      "won": true
                  },
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "7YPp6rOYJZ1LjUK0E3qy",
                  "addedOn": 1587463658000,
                  "playerAnswerId": "0",
                  "playerAnswerInSeconds": 2,
                  "answerCorrect": true,
                  "round": 2,
                  "categoryId": [
                      8
                  ],
                  "badge": {
                      "name": "lizard",
                      "won": true
                  },
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "GMwmK5ckSoQuRXRpB0jb",
                  "addedOn": 1587463668000,
                  "playerAnswerId": "0",
                  "playerAnswerInSeconds": 2,
                  "answerCorrect": true,
                  "round": 2,
                  "categoryId": [
                      4
                  ],
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "gqyxSCBlWNIL3IUJnop1",
                  "addedOn": 1587463678000,
                  "playerAnswerId": "0",
                  "playerAnswerInSeconds": 2,
                  "answerCorrect": true,
                  "round": 2,
                  "categoryId": [
                      4
                  ],
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "NmK5ApBbcqV7t3JVZGTh",
                  "addedOn": 1587463686000,
                  "playerAnswerId": "1",
                  "playerAnswerInSeconds": 5,
                  "answerCorrect": false,
                  "round": 2,
                  "categoryId": [
                      4
                  ],
                  "isReported": false
              },
              {
                  "playerId": "yP7sLu5TmYRUO9YT4tWrYLAqxSz1",
                  "questionId": "ZvRtEegq8CPySojR6RUd",
                  "addedOn": 1587463734000,
                  "playerAnswerId": "1",
                  "playerAnswerInSeconds": 2,
                  "answerCorrect": false,
                  "round": 2,
                  "categoryId": [
                      2
                  ],
                  "badge": {
                      "name": "paper",
                      "won": false
                  },
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "USxShnwfA65wkxs2X9rY",
                  "addedOn": 1587463742000,
                  "playerAnswerId": "2",
                  "playerAnswerInSeconds": 1,
                  "answerCorrect": true,
                  "round": 3,
                  "categoryId": [
                      4
                  ],
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "544BhjgXE070vNC0II5q",
                  "addedOn": 1587463751000,
                  "playerAnswerId": "1",
                  "playerAnswerInSeconds": 8,
                  "answerCorrect": true,
                  "round": 3,
                  "categoryId": [
                      4
                  ],
                  "isReported": false
              },
              {
                  "playerId": "4kFa6HRvP5OhvYXsH9mEsRrXj4o2",
                  "questionId": "8QgcZTS0cQAokNG7oqQr",
                  "addedOn": 1587463775000,
                  "playerAnswerId": "1",
                  "playerAnswerInSeconds": 4,
                  "answerCorrect": true,
                  "round": 3,
                  "categoryId": [
                      9
                  ],
                  "isReported": false
              }
          ],
          "gameId": "vTzY3HeUvy9lXxaGHa0d",
          "GameStatus": "waiting for next question",
          "createdAt": 1587463514000,
          "turnAt": 1588197930838,
          "gameOverAt": 1587463792000,
          "reminder32Min": false,
          "reminder8Hr": false,
          "stats": {
              "4kFa6HRvP5OhvYXsH9mEsRrXj4o2": {
                  "avgAnsTime": 2,
                  "badge": [
                      "scissors",
                      "paper",
                      "rock",
                      "lizard"
                  ],
                  "consecutiveCorrectAnswers": 1,
                  "score": 10
              },
              "yP7sLu5TmYRUO9YT4tWrYLAqxSz1": {
                  "avgAnsTime": 2,
                  "badge": [
                      "lizard"
                  ],
                  "consecutiveCorrectAnswers": 0,
                  "score": 1
              }
          },
          "round": 3
      }
    ],
    "applicationSettings": {
        "android_version": 79,
        "answer_max_length": 128,
        "apple_authentication": true,
        "auto_save": {
          "is_enabled": true,
          "time": 30000
        },
        "badges": {
          "lizard": {
            "category": 8,
            "class": "score5",
            "image": {
              "full_name": "badge5.png",
              "name": "badge5"
            }
          },
          "paper": {
            "category": 0,
            "class": "score2",
            "image": {
              "full_name": "badge2.png",
              "name": "badge2"
            }
          },
          "rock": {
            "category": 0,
            "class": "score1",
            "image": {
              "full_name": "badge1.png",
              "name": "badge1"
            }
          },
          "scissors": {
            "category": 0,
            "class": "score3",
            "image": {
              "full_name": "badge3.png",
              "name": "badge3"
            }
          },
          "spoke": {
            "category": 1,
            "class": "score4",
            "image": {
              "full_name": "badge4.png",
              "name": "badge4"
            }
          }
        },
        "default_names": [
          "HackMan",
          "FluxCapacitor",
          "PyCharmer",
          "NullPointer",
          "ContinuousIntegrator",
          "SeeSharper",
          "NothingBut.Net"
        ],
        "display_achievements": false,
        "earn_bytes_on_question_contribute": 4,
        "enabled_rich_editor": true,
        "first_question_bits": 50,
        "game_play_categories": [
          9,
          8,
          4,
          1,
          6,
          2,
          3,
          5,
          7
        ],
        "game_play_max_time": [
          8,
          16,
          32,
          64,
          128
        ],
        "game_play_show_tags": true,
        "game_play_timer_loader_ranges": [
          {
            "end": 256,
            "seconds": 16,
            "start": 0
          },
          {
            "end": 512,
            "seconds": 24,
            "start": 256
          },
          {
            "end": 10000000000000000,
            "seconds": 32,
            "start": 512
          }
        ],
        "game_question_bits": 50,
        "invite_bits": 4,
        "invite_bits_enabled": true,
        "ios_version": 74,
        "lives": {
          "enable": true,
          "lives_add": 2,
          "lives_after_add_millisecond": 1920000,
          "max_lives": 4
        },
        "notification_template": {
          "achievement_notification": {
            "message": "You get ${achievement} Achievement"
          },
          "friend_notifications": {
            "message": "${displayName}  wants to friend you on bitWiser! Accept or Deny. Let the bitWiser battles begin!"
          },
          "game_completed": {
            "message": "${displayName} won this bitWiser game. Play again, to get even!"
          },
          "game_invitation_remaining_time_notifications_8_hr": {
            "message": "Your game play invitation from ${displayName} will expire in 8 hours. Accept the challenge and play now!"
          },
          "game_play_lag_notification": {
            "message": "${displayName} - we have added new questions to bitWiser! Come back and challenge your friends to a new game."
          },
          "game_remaining_time_notifications_32_mins": {
            "message": "You have only 32 minutes left to be a bitWiser! Play now!"
          },
          "game_remaining_time_notifications_8_hr": {
            "message": "Your bitWiser game will expire in 8 hours, play now!"
          },
          "invitation_timeout": {
            "message": "Your game play invitation to ${displayName} expired. Challenge your friends to a new game!"
          },
          "new_gmae_start_with_opponent": {
            "message": "${displayName} started a new bitWiser game with you! Stay tuned for your turn!"
          },
          "question_notifications_approved": {
            "message": "Yay! Your submitted question has been approved for the bitWiser question bank. You earned 8 bytes!!"
          },
          "question_notifications_status_change": {
            "message": "The status changed from ${oldStatus} to ${newStatus} for your question."
          },
          "time_expired_notification_game_lost": {
            "message": "You snooze you lose! sorry, your bitWiser game ended. Take another shot now!"
          },
          "time_expired_notification_game_won": {
            "message": "${displayName} did not answer in time. You have won this bitWiser game! You are on a roll, start another game."
          },
          "turn_change_notification_current_player": {
            "message": "${displayName}’s turn to play bitWiser."
          },
          "turn_change_on_wrong_answer": {
            "message": "${displayName} did not answer correctly. It's your turn now!!"
          },
          "turn_change_user_not_answered_notification_to_next_player": {
            "message": "${displayName} did not answer in time. It’s your turn to play and win bitWiser!"
          },
          "waiting_for_friend_invitation_acceptance": {
            "message": "${displayName} has invited you to a new game. It's your turn to play!"
          },
          "waiting_for_random_player_invitation_acceptance": {
            "message": "${displayName} has invited you to a new game. It's your turn to play!"
          }
        },
        "phone_authentication": true,
        "question_max_length": 256,
        "quill_options": {
          "custom_toolbar_position": "bottom",
          "list": [
            {
              "list": "bullet"
            },
            {
              "list": "ordered"
            }
          ],
          "options": [
            "bold",
            "italic",
            "underline",
            "strike",
            "mathEditor",
            "image",
            "code-block"
          ],
          "web_view_answer_options": {
            "ql-code-block": "<button type=\"button\" class=\"ql-code-block\"></button>"
          },
          "web_view_question_options": {
            "ql-code-block": "<button type=\"button\" class=\"ql-code-block\"></button>",
            "ql-image": "<button type=\"button\" class=\"ql-image\"></button>"
          }
        },
        "show_welcome_screen": true,
        "social_profile": [
          {
            "display": "Github",
            "enable": false,
            "position": 0,
            "social_name": "githubUrl",
            "url": "https://www.github.com/"
          },
          {
            "display": "Stack Overflow",
            "enable": true,
            "position": 1,
            "social_name": "stackoverflowUrl",
            "url": "https://www.stackoverflow.com/users/"
          },
          {
            "display": "Hacker News",
            "enable": true,
            "position": 2,
            "social_name": "hackernewsUrl",
            "url": "https://thehackernews.com/"
          },
          {
            "display": "Reddit",
            "enable": true,
            "position": 3,
            "social_name": "redditUrl",
            "url": "https://www.reddit.com/user/"
          },
          {
            "display": "LinkedIn",
            "enable": true,
            "position": 4,
            "social_name": "linkedInUrl",
            "url": "https://www.linkedin.com/in/"
          },
          {
            "display": "Twitter",
            "enable": true,
            "position": 5,
            "social_name": "twitterUrl",
            "url": "https://www.twitter.com/"
          }
        ],
        "tag_count_limit": 10,
        "tokens": {
          "earn_bits": 4,
          "earn_bytes": 2,
          "enable": true
        },
        "user_display_name_value": 1282
      }
}
