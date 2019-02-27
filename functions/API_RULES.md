# API Rules
 [Rule-1] - only get and post verb
All route which modify data must be a post request
Route which do not modify data can be a get request
 [Rule-2] - Middleware
All public API (API that can be called without login from Angular or mobile App) should not have any Middleware
All APIs that can only be accessed after login from Angular or mobile App must have authroizedOnly Middleware
All APIs that can only be accessed after login by admin user from Angular or mobile app must  have adminOnly Middleware
All APIs which are created for maintenance/migration or to be run with scheduler must have authTokenOnly Middleware
 [Rule-3]  - request validation
API with authroizedOnly , must check that data user is trying to add/update/delete belongs to logged in user
never trust data(userid,user object) sent as param/body in req, always validate req.user.id against userID sent as part of request
validate all require params are available and valid before starting execution of API
Never directly dump any security sensitive data into firestore without check permission or data integrity
 [Rule-4] -
all maintainace/migration API end points ideally required to be called only once should be under /migration route
Put comment on top under which circumstances this end point should be called
 All APIs required to be called in scheduler should be under  /schedule route
Put comment on top under which circumstances this end point should be called
 [Rule-5] - Promises
use Await/Async where possible and avoid chaining of promises
use promise.all when promise do not need to be executed in sequence
use for of loop instead of array.map function becuase it has better try catch support and await is supported in for of loop
Ensure promises are always resolved or rejected from function	
with Away/Async use try and catch blocks,  when you cache error and return error it handled as reject, you use throw as well with Away/Async use try and catch blocks,  when you cache error and return error it handled as reject, you can use throw as well
 [Rule-6] Firebase http/db trigger
always ensure that http routes must always send response to complete http trigger, either it could be any response from ok to error
db trigger function must  always return value or promises 
 [Rule-7] Business logic
Controller
should only handle request,response, request validation , and delegate actual work to either service or utility functions
 Utility
should contain business logic that does not require making a firestore call, it should never modify or access firestore directly.
rather delegate it to service function for any need to modify firestore db including updating documents.
It should only work on data that is in memory.
 Service
should contain all function that interact with firestore db including any business logic that update documents.
it should try to hide how document properties are updated to outside/caller
 [Rule-8]  Generating statistics
generation of statistic can be triggered from API call, DB trigger
We should business logic that actually create statistic for one document in single place either utility or service
we should not have logic to create statistics for one type of document scattered in many files for better readability
 [Rule-9]  Application configuration
Always put all configuration in application_settings document, do not hard code as constant in API
 [Rule-10]  Import/export
Always use ES6 import/export ,lets not mix it with require use require when there is no option
 [Rule-11]
Always use class construct
when object is not required add method as static then it could be used without creating instance of class
All controller class should have static methods to handle request and response
Avoid having member variables (this.xxxx) as it may cause data sharing problems,
when it is safer to create instance of class export instance of class rather than exporting class it self itself to have 
singleton effect