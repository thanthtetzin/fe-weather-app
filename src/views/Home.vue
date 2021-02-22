<template>
  <div class="home">
    <b-row>
      <b-col md="3" class="weatherInfoCol">
        <WeatherInfoCard ref="weatherInfoCard" :lat="lat" :long="long" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import WeatherInfoCard from '@/components/WeatherInfoCard.vue'

export default {
  name: 'Home',
  components: {
    WeatherInfoCard
  },
  data () {
    return {
      lat: 37.7764685,
      long: -122.4193891
    }
  }
}
</script>
<style scoped lang="scss">
.weatherInfoCol {
  margin: 0 auto;
  max-width: 20rem;
}
</style>
