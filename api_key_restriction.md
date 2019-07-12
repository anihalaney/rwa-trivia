# API key restriction

#### API key restriction changes

* Go [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) and select project for which you want to add API key restriction
 

#### Restrict Google MAP API key

      1. Create new API using ` Create credentials ` for use Google map APIs. This API we are using for getting address using longitude and latitude and suggest address which are used in profile. we are not using this API in other place.
      2. Select `API restrictions` and select Restrict key. Enable below 3 APIs.
            * Geocoding API
            * Places API
            * Token Service API
      3 Save


#### Restrict web API key
      1. Create/use existing Web API for restrict web API key.
      2. Under `Application restrictions` section select `HTTP referrers (web sites)`
      3. In New Item section add website url for which you want to restrict API key.
      4. Under the `API restrictions` select `Restrict key` and enable below 2 APIs.
            * Identity Toolkit API
            * Token Service API
      5. Save


#### Restrict Android API key

      1. Create/use existing Android API for restrict web API key.
      2. Under `Application restrictions` section select `Android apps`
      3. In `Restrict usage to your Android apps`  add `package name` and `sha-1 certificates fingerprint`
      4. Under the `API restrictions` select `Restrict key` and enable below 3 APIs.
            * Identity Toolkit API
            * Token Service API
            * Firebase Cloud Messaging API
      5. Save

#### Restrict Android API key

      1. Create/use existing iOS API for restrict web API key.
      2. Under `Application restrictions` section select `iOS apps`
      3. In `Restrict usage to your Android apps`  add `bundle identifiers`
      4. Under the `API restrictions` select `Restrict key` and enable below 3 APIs.
            * Identity Toolkit API
            * Token Service API
            * Firebase Cloud Messaging API
      5. Save

