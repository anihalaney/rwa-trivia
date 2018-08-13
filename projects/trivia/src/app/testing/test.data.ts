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
        [1]: { "id": 1, "categoryName": "Special" },
        [2]: { "id": 2, "categoryName": "Programming" },
        [3]: { "id": 3, "categoryName": "Architecture" },
        [4]: { "id": 4, "categoryName": "Networking/Infrastructure" },
        [5]: { "id": 5, "categoryName": "Database" },
        [6]: { "id": 6, "categoryName": "Dev Ops" },
        [7]: { "id": 7, "categoryName": "UX/UI" }
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
            "userId": "ssHmHkKq9BPByP9c4CtmEqvO4xp2",
            "displayName": "trivia",
            "email": "trivia@realworldfullstack.io",
            "roles": {},
            "authState": null
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
        }
}
