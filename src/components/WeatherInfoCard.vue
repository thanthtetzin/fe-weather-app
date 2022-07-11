<template>
  <b-card class="weatherInfoCard">
    <p class="cityNotFound" v-if="cityNotFound">City Not found!</p>
    <b-card-title>
      {{ day }}
      <p class="date">{{ date }}</p>
    </b-card-title>
    <b-card-text class="location">
      <b-icon-geo-alt-fill /> {{ location }}
    </b-card-text>
    <img class="weatherIcon" :src="weatherIcon" />
    <h1 class="temp">{{ temp }}</h1>
    <h6>{{ weather }}</h6>

    <input v-model="searchTerm" />
    <button @click="test()" type="button">Search</button>

    <div class="tabs" v-if="totalResult > 0">
      <ul>
        <li role="button" tabindex="0">
          <span>
            "All Results"
            <span>
              "(" "{{ totalResult }}" ")"
            </span>
          </span>
        </li>
        <li role="button" tabindex="0">
          <span>
            "Content"
            <span>
              "(" "{{ totalContents }}" ")"
            </span>
          </span>
        </li>
        <li role="button" tabindex="0">
          <span>
            "News"
            <span>
              "(" "{{ totalNews }}" ")"
            </span>
          </span>
        </li>
        <li role="button" tabindex="0">
          <span>
            "Users"
            <span>
              "(" "{{ totalUsers }}" ")"
            </span>
          </span>
        </li>
      </ul>
    </div>
  </b-card>
</template>

<script>
import { BIconGeoAltFill } from 'bootstrap-vue'
import moment from 'moment'
import randomCityJson from '../shared/json/city.list.json'

export default {
  name: 'WeatherInfoCard',
  components: {
    BIconGeoAltFill
  },
  props: {
    lat: Number,
    long: Number
  },
  data () {
    return {
      isLoading: true,
      cityNotFound: false,
      day: '',
      date: '',
      location: '',
      weatherIcon: '',
      temp: '',
      weather: '',
      searchTerm: '',
      totalResult: 0,
      totalUsers: 0,
      totalContents: 0,
      totalNews: 0
    }
  },
  created: function () {
    if (this.lat && this.long) {
      this.getWeatherByLatLong(this.lat, this.long)
    }
  },
  mounted: function () {
    this.setCookie('wsessionid', 'testing', 2)
  },
  methods: {
    getCookie: function (name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    },
    setCookie: function (name, value, days) {
      var expires = ''
      if (days) {
        var date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/'
    },
    test: function () {
      const types = ['users', 'contents', 'news']
      this.totalResult = 0
      this.totalUsers = 0
      this.totalContents = 0
      this.totalNews = 0
      types.map(async (type) => {
        try {
          let result = await fetch(
            'https://62cc8d768042b16aa7d11817.mockapi.io/search',
            {
              method: 'POST',
              body: JSON.stringify({
                cookie: this.getCookie('wsessionid'),
                q: this.searchTerm,
                limit: 31,
                types: [type]
              })
            }
          )
          result = await result.json()
          if (result.cod === '404') {
            throw new Error(result.message)
          }
          if (type === 'users') {
            this.totalUsers = result.entries.length
          } else if (type === 'contents') {
            this.totalContents = result.entries.length
          } else if (type === 'news') {
            this.totalNews = result.entries.length
          }
          console.log('responses: ', result)
          this.totalResult += result.entries.length
        } catch (error) {
          this.cityNotFound = true
          console.log('Error in getting weather: ', error.message)
          this.loadInfoToCard()
        }
      })
    },
    loadWeatherForRandomCoordinates: function () {
      const randomCityIndex = Math.floor(Math.random() * randomCityJson.length)
      const randomCityLat = randomCityJson[randomCityIndex].coord.lat
      const randomCityLon = randomCityJson[randomCityIndex].coord.lon
      this.getWeatherByLatLong(randomCityLat, randomCityLon)
    },
    getRandomCoordinates: function (from, to, fixed) {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1
    },
    getWeatherByLatLong: function (lat, long) {
      const fullUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_MAP_API_KEY}`
      this.fetchWeatherInfoAndLoadData(fullUrl)
    },
    getWeatherByCityCountryCode: function (cityName, countryCode) {
      const fullUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},,${countryCode}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_MAP_API_KEY}`
      this.fetchWeatherInfoAndLoadData(fullUrl)
    },
    fetchWeatherInfoAndLoadData: async function (fullUrl) {
      try {
        this.cityNotFound = false
        let result = await fetch(fullUrl)
        result = await result.json()
        if (result.cod === '404') {
          throw new Error(result.message)
        }
        this.loadInfoToCard(result)
      } catch (error) {
        this.cityNotFound = true
        console.log('Error in getting weather: ', error.message)
        this.loadInfoToCard()
      }
    },
    loadInfoToCard: function (result = null) {
      const timezoneInMinutes = result ? result.timezone / 60 : null
      this.day = result
        ? moment().utcOffset(timezoneInMinutes).format('dddd')
        : '------'
      this.date = result
        ? moment().utcOffset(timezoneInMinutes).format('DD MMM YYYY')
        : '-- --- ----'
      this.location =
        result && result.sys
          ? `${result.name}, ${result.sys.country}`
          : '--, --'
      this.weatherIcon =
        result && result.weather
          ? `https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`
          : ''
      this.temp =
        result && result.main ? `${Math.round(result.main.temp)}°C` : '_°C'
      this.weather =
        result && result.weather ? result.weather[0].main : '------'
    }
  }
}
</script>
<style scoped lang="scss">
.weatherInfoCard {
  background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,84,166,1) 0%, rgba(132,189,201,1) 90% );
  border: none;
  box-shadow: 0 7px 8px -4px #696868;
  color: #ffffff;
  min-height: 350px;

  p.cityNotFound {
    color: #ffe007;
    font-weight: bolder;
  }
  div.card-body {
    padding: 25px;

    h4.card-title {
      font-weight: bold;
      font-size: 1.6rem;
      p.date {
        font-size: 14px;
        padding-top: 4px;
      }
    }
    img.weatherIcon {
      padding-top: 20px;
      margin-left: -10px;
      width: 70px;
    }
    h1.temp {
      font-size: 3rem;
    }
  }
}
</style>
