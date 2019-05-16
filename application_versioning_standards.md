# API versioning standards

#### API Version changes

* When we do any kind of structural changes or major changes in logic then we need to change **API Version**.
* Before the deployment , we need to do below changes :

   * We need to update the **appConstant.APP_VERSION** with next inceremented version under constant.ts file.
        * For example, if current version of api is v1 then next version of api would be v2.

   * we also need to change the **firebase.json** file which will include last 2 versions url references.

       * For example,
                    {
                          “source” : ”/v1/**”,
                          “function” : “v1”
                    },
                   {
                         “source” : ”/v2/**”,
                        “function” : “v2”
                    }

 * When we deploy functions, we need keep last 2 versions functions and remove other api versions.

----

#### Mobile application change

* we need to update versions of android & ios with next incremented version in **ApplicationSettings** collection.

* For example,
     * If current version of android & ios is 1.0 then we need to update the version as 2.0
     * Below are the parameters which represents 		android & ios current versions :
        * android_version
        * ios_version


* Based on **current versionCode** of android and ios application and version of **application settings collection**, application will display dialog to force update application from store.
