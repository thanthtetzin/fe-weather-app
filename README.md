# fe-weather-app

### This App is about
- A Vue App Client that is talking to [Open Weather Map API](http://openweathermap.org/API#weather) JSON api
- At the first page, You can see the weather info of geographic coordinates of random city
- You can also search the weather info by 
1. the city name (OR)
2. the city name and country code (Comma seperated value e.g. "Berlin, DE")

### This App is built with
- Vue.js (v2), BootstrapVue, SCSS, Moment.js

### Future improvements
- Add unit tests for SearchWeather.vue component
- Split API talking part into seperate file instead of directly at component
- Usage of @mixin and more global style variables in SCSS

### Requirements to run the project
- Node.js (I used v12.19.0)
- Downloaded Project folder

### How to run the project in terminal
- Go to the project directory 
- Run `npm install`
- After install, run `npm run serve`
- Then, in the terminal, it will show
```
App running ​at:
​Local:​ ​http:​//localhost:8080/ ​
Network:​ ​http:​//192.168.1.35:8080/
```
- Based on the port available on your machine, the port may be changed.
- Please open ​http://localhost:8080/​ at browser.
- You will see the weather info page and Enjoy! :)

### Run unit tests
```
npm run test:unit
```

### Compiles, minifies and build for production
```
npm run build
```
