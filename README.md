# Viamedia
#### ACME API Integration

Date: 06-02-2022
Developer: Anton de Villiers

---

NodeJS:     ```v16.13.0```
Start:      ```npm run server```
port:       ```7000```

---

### Notes

***Out of time for:***
- Some more refined refactoring.
- Unit Tests. But, everything was tested multiples times to guarantee a working product. As off 19h00, 6th of March 2022 everything was functional. That include all routes and all expected responses in the correct schema format.
- High Level Technical Drafts.
- Functional Draft/Blueprint of each Route.
- Documented, function explaining.
- Per route JWT authentication. *For this I have current working integration examples.*

**For actual productions examples, regarding the above**, I am happy to share current and past projects via a online meeting.

Projects Include:
- Fully functional Cloud-based Point-of-Sale system for a company. (React + Redux, NodeJs + Express, MongoDB). - *13 months*
 - Rewards and Loyalties Micro Server (NodeJS + Express + MongoDB). *(100,000 - 1000,000 users)*
- Push Notifications Micro Server (NodeJS + Express + MongoDB). - *(100,000 - 1000,000 users)*


For some reason I am unable to export the Postman captured responses, but have attached it below.

For this problematic API, all server errors coming from the ACME API is placed into a continues loop until a valid response is supplied. It will only return a error from the ACME API if the "msisdn" parameter is not in the correct format.

- If this was a actual production API, and if I had more time, I could have created cloned routes, that accepts an ```/:error/``` parameter to be able to return ALL ACME API errors on purpose.


**For example:**

To retry until the condition is met, of a valid 200 OK reponse.

```
GET: api/v1/balances/msisdn/:msisdn
GET: api/v1/balances/msisdn/0829991234
```

To return any errors that are encountered. Basically to test the ACME API.

```
GET: api/v1/balances/msisdn/:msisdn/apierror/:apierr
GET: api/v1/balances/msisdn/27829991234/apierror/true
```

**Extra:**

- Would have ("time") integrated a server reporting tool per API route, to capture all server errors, because of the amount of errors returned, it would be better to separate the errors into their own log files.

**For example:**

```
/logs/
      balance.log
      profile.log
      game.log
      rewards.log
```
**Please note, there is still some active console.log()'s to print errors.** This will still be captured via logging services like PM2.

---

<br/><br/> 

### BALANCE CHECK:

**Get Balance**
 - API ROUTE : ```api/v1/balances/msisdn/:msisdn```
<br/><br/> 

### FOR PROFILE:

**Get Profile (wallet)**
- API ROUTE : ```api/v1/profiles/wallet/msisdn/:msisdn```

**Get Rewards**
- API ROUTE : ```api/v1/rewards/msisdn/:msisdn```

**THIS: Get Profile (wallet) + Rewards Mix (REF)**
- API ROUTE : ```api/v1/profiles/walletref/msisdn/:msisdn```
<br/><br/> 

### FOR PLAY:

**Request To Play The Game**
- API ROUTE : ```api/v1/games/msisdn/:msisdn```

<br/><br/> 

## Postman

### API - Online Documentations

Link: (https://documenter.getpostman.com/view/5601950/UVkvKYBK)
<br/><br/> 

### Postman Collection: JSON Export:

Location: ```/POSTMAN_EXPORT_WithReponseExamples/viamedia.postman_collection.son```

<br/><br/> 

## Proof Folder

The ```/PROOF/``` folder contains test-code and response-results for the ```api/v1/wallet/``` route.

This specific API route is very problematic, in that 99.99% of the time it does not work, due to a internal "Cannot read property 'map' of undefined" error. Clearly there is an expected case where an array is expected.

For this I approached this error, via addressing the api/v1/wallet/ & api/v1/rewards API separately, and then via a another route as combined entity.

<br/><br/> 

## API ACTUAL WORKING REPONSE RESULTS

### BALANCE CHECK:

```
{
    "msisdn": "0829991234",
    "balance": 10,
    "response": {
        "status": 200,
        "message": "Balance for user 0829991234"
    }
}
```

<br/><br/> 


### FOR PLAY:
true

```
{
    "msisdn": "0829991234",
    "balance": 10,
    "won": true,
    "description": "You have won a 30mg data bundle discount",
    "response": {
        "status": 200,
        "message": "Profile for user 0829991234"
    }
}
```

<br/><br/> 

false

```
{
    "msisdn": "0829991234",
    "balance": 5,
    "won": false,
    "description": "Sorry better luck next time",
    "response": {
        "status": 200,
        "message": "Balance for user 0829991234"
    }
}
```

<br/><br/> 

### GET PROFILE: Wallet + Rewards:

ARRAY

```
{
    "wallet": [
        {
            "ref": "50mg-data-bundle-discount",
            "description": "You've won a 50MB Data bundle.",
            "awardedAt": "2022-03-06T09:04:24.691Z"
        },
        {
            "ref": "30mg-data-bundle-discount",
            "description": "You've won 10% off a 30MB Data bundle. Was R5.00 now only R4.50",
            "awardedAt": "2022-03-06T09:08:18.146Z"
        },
        {
            "ref": "gamesforce-voucher",
            "description": "You've won a subscription to GamesForce Premium",
            "awardedAt": "2022-03-06T09:08:30.719Z"
        },
        {
            "ref": "1gb-data-bundle-discount",
            "description": "You've won 30% off a 1GB Data bundle. Was R60.00 now only R42.00",
            "awardedAt": "2022-03-06T09:09:22.692Z"
        },
        {
            "ref": "30mg-data-bundle-discount",
            "description": "You've won 10% off a 30MB Data bundle. Was R5.00 now only R4.50",
            "awardedAt": "2022-03-06T09:15:23.807Z"
        }
    ],
    "response": {
        "status": 200,
        "message": "profile for user 0829991234"
    }
}
```

Single Object


```
{
    "wallet": [
        {
            "ref": "gamesforce-voucher",
            "description": "You've won a subscription to GamesForce Premium",
            "awardedAt": "2022-03-06T10:47:45.596Z"
        }
    ],
    "response": {
        "status": 200,
        "message": "profile for user 0829991234"
    }
}
```

<br/><br/> 

### REWARDS:


```
{
    "msisdn": "0829991234",
    "rewards": [
        {
            "ref": "1gb-data-bundle-discount",
            "description": "You've won 30% off a 1GB Data bundle. Was R60.00 now only R42.00"
        },
        {
            "ref": "50mg-data-bundle-discount",
            "description": "You've won 20% off a 50MB Data bundle. Was R8.00 now only R6.40"
        },
        {
            "ref": "50mg-data-bundle-discount",
            "description": "You've won a 50MB Data bundle."
        },
        {
            "ref": "30mg-data-bundle-discount",
            "description": "You've won 10% off a 30MB Data bundle. Was R5.00 now only R4.50"
        },
        {
            "ref": "500-salon-voucher",
            "description": "You've won a R500 Salon Voucher"
        },
        {
            "ref": "gamesforce-voucher",
            "description": "You've won 7 Days free access to GamesForce Premium"
        },
        {
            "ref": "gamesforce-voucher",
            "description": "You've won a subscription to GamesForce Premium"
        }
    ],
    "response": {
        "status": 200,
        "message": "Rewards for user 0829991234"
    }
}
```

<br/><br/> 

### WALLET:


```
{
    "msisdn": "0829991234",
    "wallet": [
        {
            "description": "You've won 30% off a 1GB Data bundle. Was R60.00 now only R42.00",
            "timestamp": "2022-03-06T16:55:09.385Z"
        }
    ],
    "response": {
        "status": 200,
        "message": "Balance for user 0829991234"
    }
}
```



