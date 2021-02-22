<template>
  <b-card class="weatherInfoCard">
    <b-card-title>
      {{day}}
      <p class="date">{{date}}</p>
    </b-card-title>
    <b-card-text>
      <b-icon-geo-alt-fill /> {{location}}
    </b-card-text>
    <img class="weatherIcon" :src="weatherIcon">
    <h1 class="temp">{{temp}}</h1>
    <h6>{{weather}}</h6>
  </b-card>
</template>

<script>
import { BIconGeoAltFill } from 'bootstrap-vue'
import moment from 'moment'

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
      day: '',
      date: '',
      location: '',
      weatherIcon: '',
      temp: '',
      weather: ''
    }
  },
  created: async function () {
    await this.loadWeatherForRandomCoordinates()
  },
  methods: {
    loadWeatherForRandomCoordinates: async function () {
      this.getWeatherByLatLong(this.lat, this.long)
    },
    getRandomCoordinates: function (from, to, fixed) {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1
    },
    getWeatherByLatLong: async function (lat, long) {
      try {
        let result = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_MAP_API_KEY}`)
        result = await result.json()
        const timezoneInMinutes = result.timezone / 60
        this.day = moment().utcOffset(timezoneInMinutes).format('dddd') || '------'
        this.date = moment().utcOffset(timezoneInMinutes).format('DD MMM YYYY') || '-- --- ----'
        this.location = `${result.name}, ${result.sys.country}` || '--, --'
        this.weatherIcon = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png` || ''
        this.temp = `${Math.round(result.main.temp)}°C` || '°C'
        this.weather = result.weather[0].main || '------'
      } catch (error) {
        console.log('Error in getting weather: ', error.message)
      }
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
