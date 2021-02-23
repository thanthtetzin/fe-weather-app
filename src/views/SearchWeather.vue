<template>
  <div class="searchWeather">
    <b-row>
        <b-col md="3" class="weatherInfoCol">
          <WeatherInfoCard ref="weatherInfoCard" :lat="lat" :long="long" />
        </b-col>
        <b-card class="searchbox">
          <h5>Search weather in your city</h5>
          <form @submit="searchWeatherByCity">
            <b-input-group class="mt-3">
              <b-form-input
                type="text"
                required
                v-model="searchValue"
                placeholder="Berlin, DE"
              ></b-form-input>
              <b-input-group-append>
                <b-button type="submit" variant="primary"><b-icon-search /></b-button>
              </b-input-group-append>
            </b-input-group>
          </form>
        </b-card>
    </b-row>
  </div>
</template>

<script>
import WeatherInfoCard from '@/components/WeatherInfoCard.vue'
import { BIconSearch } from 'bootstrap-vue'

export default {
  name: 'SearchWeather',
  components: {
    WeatherInfoCard,
    BIconSearch
  },
  data () {
    return {
      // uncomment to use exact lat & long instead of random at WeatherInfoCard component
      lat: null, // 37.7764685,
      long: null, // -122.4193891
      searchValue: ''
    }
  },
  methods: {
    searchWeatherByCity: function (e) {
      e.preventDefault()
      if (!this.searchValue) {
        return
      }
      const searchValObj = this.searchValue.trim().split(',')
      const cityName = searchValObj[0]
      const countryCode = searchValObj[1] || ''
      this.$refs.weatherInfoCard.getWeatherByCityCountryCode(cityName, countryCode)
    }
  }
}
</script>
<style scoped lang="scss">
.searchWeather {
  padding-top: 20px;
  .row {
    justify-content: center;
    .weatherInfoCol {
      max-width: 20rem;
    }
  }
  .searchbox {
    box-shadow: 0 1px 7px -4px #696868;
    border: none;
    background-color: #e9ecef;
    border-radius: 0px;
    @media screen and (min-width: $tablet) {
      min-width: 20rem;
      margin-left: -15px;
    }
  }
  .border-danger {
    border: 1px solid red;
  }
}
</style>
