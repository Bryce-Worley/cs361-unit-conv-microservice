# unit-conversion-microservice
A microservice that converts between different units of measurements. The microservice utilizes a REST api through express.

A user/application sends a request with a value, the current unit of measurement, and the desired unit of measurment. The converted value is then returned.

## Set-up
To run this program locally:

1)  Create a .env file in the main directory. In this file include:
PORT=3001  ALLOWED_ORIGINS=http://localhost:3000 // Or another applicable port and origin to run the express server and microservice on.

2) In your terminal, navigate to your main directory and run the following commands:
```
npm init -y
npm install express cors
npm install dotenv
```

3) To run the serve enter the following command in your terminal:
``` 
npm start 
```

You are now ready to send unit conversion requests!

## How To Request Data

**GET** requests can be made to the service as follows:

PORT = port referenced in the env file

VALUE = the value for the measurement

FROM_UNIT= the current unit of measurement

TO_UNIT = the unit of measurement you would like to convert to

*Call Structure in HTTP*
```
http://localhost:{{**PORT**}}/convert?value={{**VALUE**}}&from={{**FROM_UNIT**}}&to={{**TO_UNIT)}
```


*Example Call:*
```
http://localhost:3001/convert?value=10&from=lbs&to=kg
```

## How To Receive Data

The following is the expected response to the **GET** request above returned in a JSON format:

```
{
  "request": {
    "value": 10,
    "from": "lbs",
    "to": "kg"
  },
  "result": 4.5359,
  "unit": "weight"
}
```

## UML Sequence Diagram
<img width="2385" height="4491" alt="Weather Microservice UML Diagram" src="https://github.com/Bryce-Worley/cs361-unit-conv-microservice/blob/main/UML.png?raw=true" />