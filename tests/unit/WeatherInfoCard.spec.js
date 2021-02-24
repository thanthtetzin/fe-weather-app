import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue';
import WeatherInfoCard from '@/components/WeatherInfoCard'
import weathers from '../unit/mocks/weathers.json'
const flushPromises = require('flush-promises');
const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('WeatherInfoCard.vue', () => {
  require('jest-fetch-mock').enableMocks()
  it('renders weatherInfo by specified coordinates props of (Copenhagen, DK) when passed', async () => {
    fetch.mockResponseOnce(JSON.stringify(weathers.Copenhagen))
    const wrapper = shallowMount(WeatherInfoCard, { localVue,
      propsData: {
        lat: 55.6761,
        long: 12.5683
      }
    })
    await flushPromises();
    const expectedLocation = 'Copenhagen, DK'
    expect(wrapper.vm.location).toBe(expectedLocation)
    expect(wrapper.find('.location').exists()).toBe(true)
    expect(wrapper.find('.location').text()).toMatch(expectedLocation)
  })
  it('renders weatherInfo by random coordinates without specified coordinates props when passed', async () => {
    fetch.mockResponseOnce(JSON.stringify(weathers.Stockholm))
    const wrapper = shallowMount(WeatherInfoCard, { localVue })
    await flushPromises();
    const expectedLocation = 'Stockholm, SE'
    expect(wrapper.vm.location).toBe(expectedLocation)
    expect(wrapper.find('.location').exists()).toBe(true)
    expect(wrapper.find('.location').text()).toMatch(expectedLocation)
  })
  it('search weatherInfo by specified city and render', async () => {
    fetch.mockResponses(
      [
        JSON.stringify(weathers.Stockholm)
      ],
      [
        JSON.stringify(weathers.Amsterdam)
      ]
    )
    const wrapper = shallowMount(WeatherInfoCard, { localVue })
    wrapper.vm.getWeatherByCityCountryCode('Amsterdam', '')
    await flushPromises();
    const expectedLocation = 'Amsterdam, NL'
    expect(wrapper.vm.location).toBe(expectedLocation)
    expect(wrapper.find('.location').exists()).toBe(true)
    expect(wrapper.find('.location').text()).toMatch(expectedLocation)
  })
})
