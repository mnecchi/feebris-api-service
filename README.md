# Feebris Task API

The API is composed of three simple AWS Lambda functions which connect to a DynamoDB database.

The API has been deployed to AWS using the [*Serverless framework*](https://serverless.com).

The three functions respond at following endpoints:

- [`/selftest`](https://oct54u7p09.execute-api.eu-west-2.amazonaws.com/dev/selftest): a simple endpoint used only to see if the API is working fine
<img width="1249" alt="Screenshot 2019-10-19 at 18 46 29" src="https://user-images.githubusercontent.com/31031647/67149255-10fa3400-f2a1-11e9-9b50-109479899f75.png">

- [`/readings`](https://oct54u7p09.execute-api.eu-west-2.amazonaws.com/dev/readings): this endpoint has a Lambda function for the POST method, which allows the user to insert a new *reading*,
and the GET method, which returns the list of all inserted *readings*.
<img width="1251" alt="Screenshot 2019-10-19 at 18 47 06" src="https://user-images.githubusercontent.com/31031647/67149266-325b2000-f2a1-11e9-9318-ca04d763a3bd.png">
<img width="1255" alt="Screenshot 2019-10-19 at 18 47 22" src="https://user-images.githubusercontent.com/31031647/67149269-38510100-f2a1-11e9-8c62-2ae83b00deb0.png">

The `readings` endpoint called with POST method expects a *reading* object like this:
```
{
  temperature: [float]
  cough: [boolean]
  feverInLast5Days: [boolean]
 }
 ```
 If the reading is valid (temp >= 35 and temp <=43) it is saved on the DB and it gets the following added properties:
 ```
 {
  id: [guid]
  temperature: [float]
  cough: [boolean]
  feverInLast5Days: [boolean]
  isFlu: [boolean]
  createdAt: [timestamp]
 }
 ```

**NB**: for this task I kept the solution as simple as possible. There's no authentication or authorisation in place so every one can calle the endpoints
and the data are not linked to a specific user.
Of course in a production solution this must be addressed.

## Tests

To run the unit tests just run `npm test` (or `yarn test`) in the project's folder.
