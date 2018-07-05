<template>
  <section v-if="ready">
    <b-row>
      <b-col>
        <h1>Drafting <small>Composition & Strength</small></h1>
      </b-col>
    </b-row>
    <b-row v-if="!full">
      <b-col>
        <p>NOT FULL</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus accumsan mi at felis ornare, quis suscipit lacus facilisis. Sed eu cursus augue. Praesent faucibus erat sed finibus vulputate. Curabitur sollicitudin augue in sodales molestie. Aenean et nisl justo. Etiam varius ut dui at tempor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec a neque egestas, placerat ante eu, congue odio. Nunc at quam nisi.</p>
      </b-col>
    </b-row>
    <b-row v-if="!full">
      <b-col>
        <draggable v-model="heroes" :options="{group:'heroes'}" >
          <template v-for="hero in pool">
            <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="select(hero)" />
          </template>
        </draggable>
      </b-col>
    </b-row>
    <br />
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <div class="text-center text-success">
              <h3>Radiant</h3>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="text-center">
              <h5>Safe</h5>
            </div>
            <draggable v-model="radiant_safe" :options="{group:'heroes'}" class="border border-success dropable-target text-center">
              <template v-for="hero in radiant_safe">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Mid</h5>
            </div>
            <draggable v-model="radiant_mid" :options="{group:'heroes'}" class="border border-success dropable-target text-center">
              <template v-for="hero in radiant_mid">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Off</h5>
            </div>
            <draggable v-model="radiant_off" :options="{group:'heroes'}" class="border border-success dropable-target text-center">
              <template v-for="hero in radiant_off">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <b-row>
          <b-col>
            <div class="text-center text-danger">
              <h3>Dire</h3>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="text-center">
              <h5>Safe</h5>
            </div>
            <draggable v-model="dire_safe" :options="{group:'heroes'}" class="border border-danger dropable-target text-center">
              <template v-for="hero in dire_safe">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Mid</h5>
            </div>
            <draggable v-model="dire_mid" :options="{group:'heroes'}" class="border border-danger dropable-target text-center">
              <template v-for="hero in dire_mid">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Off</h5>
            </div>
            <draggable v-model="dire_off" :options="{group:'heroes'}" class="border border-danger dropable-target text-center">
              <template v-for="hero in dire_off">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <br />
    <b-row v-if="full">
      <b-col>
        <div class="text-center">
          <b-btn @click="calculate">Calculate</b-btn>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <GChart type="LineChart" :data="chartData" :options="chartOptions" />
      </b-col>
    </b-row>
  </section>
  <section v-else class="text-center">
    <hgv-loader :color="'#ffc107'"></hgv-loader>
  </section>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import { GChart } from 'vue-google-charts'

export default {
  name: 'Draft',
  components: { draggable, GChart },
  methods: {
    calculate () {
      console.log('calculate & plot')
    },
    select (item) {
      if (this.radiant_safe.length !== 2) {
        this.radiant_safe.push(item)
      } else if (this.radiant_mid.length !== 1) {
        this.radiant_mid.push(item)
      } else if (this.radiant_off.length !== 2) {
        this.radiant_off.push(item)
      } else if (this.dire_safe.length !== 2) {
        this.dire_safe.push(item)
      } else if (this.dire_mid.length !== 1) {
        this.dire_mid.push(item)
      } else if (this.dire_off.length !== 2) {
        this.dire_off.push(item)
      } else {
        return
      }

      this.heroes = this.heroes.filter(i => i.id !== item.id)
    },
    deselect (item) {
      debugger
      if (this.radiant_safe.includes(item)) {
        this.heroes.push(item)
        this.radiant_safe = this.radiant_safe.filter(i => i.id !== item.id)
      } else if (this.radiant_mid.includes(item)) {
        this.heroes.push(item)
        this.radiant_mid = this.radiant_mid.filter(i => i.id !== item.id)
      } else if (this.radiant_off.includes(item)) {
        this.heroes.push(item)
        this.radiant_off = this.radiant_off.filter(i => i.id !== item.id)
      } else if (this.dire_safe.includes(item)) {
        this.heroes.push(item)
        this.dire_safe = this.dire_safe.filter(i => i.id !== item.id)
      } else if (this.dire_mid.includes(item)) {
        this.heroes.push(item)
        this.dire_mid = this.dire_mid.filter(i => i.id !== item.id)
      } else if (this.dire_off.includes(item)) {
        this.heroes.push(item)
        this.dire_off = this.dire_off.filter(i => i.id !== item.id)
      }
    }
  },
  computed: {
    pool () {
      let heroes = this.heroes
      heroes.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name))
      return heroes
    },
    full () {
      return (this.heroes.length === 105)
    }
  },
  data () {
    return {
      'ready': false,
      'heroes': [],
      'radiant_safe': [],
      'radiant_mid': [],
      'radiant_off': [],
      'dire_safe': [],
      'dire_mid': [],
      'dire_off': [],
      'data': [],
      // Array will be automatically processed with visualization.arrayToDataTable function
      'chartData': [
        ['Time', 'Radiant', 'Dire'],
        ['15', 58, 42],
        ['30', 56, 44],
        ['45', 55, 45],
        ['60', 48, 52],
        ['60+', 42, 58]
      ],
      'chartOptions': {
        title: 'Test',
        curveType: 'function',
        hAxis: {title: 'Time'},
        vAxis: {title: 'Win Rate'},
        colors: ['#28a745', '#dc3545'],
        trendlines: {
          0: {
            type: 'linear',
            color: '#28a745'
          },
          1: {
            type: 'linear',
            color: '#dc3545'
          }
        }
      }
    }
  },
  created () {
    const vm = this

    let p1 = axios.get('/static/data/heroes.json').then((reponse) => { return reponse.data })
    let p2 = axios.get('/static/data/hero_winrate_lane_duration.json').then((reponse) => { return reponse.data })
    Promise.all([p1, p2]).then((values) => {
      const heroes = values[0]
      const data = values[0]

      for (let i = 0; i < heroes.length; i++) {
        const hero = heroes[i]
        hero.icon = hero.icon = hero.img.replace('/banner/', '/icons/')
      }

      vm.heroes = heroes
      vm.data = data
      vm.ready = true
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropable-target {
  min-height: 60px; 
  padding:10px;
}
</style>
