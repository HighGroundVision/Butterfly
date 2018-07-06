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
            <draggable v-model="teams.radiant.safe" :options="{group:'heroes'}" class="border border-success dropable-target text-center">
              <template v-for="hero in teams.radiant.safe">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Mid</h5>
            </div>
            <draggable v-model="teams.radiant.mid" :options="{group:'heroes'}" class="border border-success dropable-target text-center">
              <template v-for="hero in teams.radiant.mid">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Off</h5>
            </div>
            <draggable v-model="teams.radiant.off" :options="{group:'heroes'}" class="border border-success dropable-target text-center">
              <template v-for="hero in teams.radiant.off">
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
            <draggable v-model="teams.dire.safe" :options="{group:'heroes'}" class="border border-danger dropable-target text-center">
              <template v-for="hero in teams.dire.safe">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Mid</h5>
            </div>
            <draggable v-model="teams.dire.mid" :options="{group:'heroes'}" class="border border-danger dropable-target text-center">
              <template v-for="hero in teams.dire.mid">
                <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
              </template>
            </draggable>
          </b-col>
          <b-col>
            <div class="text-center">
              <h5>Off</h5>
            </div>
            <draggable v-model="teams.dire.off" :options="{group:'heroes'}" class="border border-danger dropable-target text-center">
              <template v-for="hero in teams.dire.off">
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
    <b-row v-if="calculated">
      <b-col>
        <GChart type="ScatterChart" :data="chartData" :options="chartOptions" class="chart" />
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
// import lsq from 'least-squares' // https://github.com/jprichardson/least-squares

export default {
  name: 'Draft',
  components: { draggable, GChart },
  methods: {
    select (item) {
      if (this.teams.radiant.safe.length !== 2) {
        this.teams.radiant.safe.push(item)
      } else if (this.teams.radiant.mid.length !== 1) {
        this.teams.radiant.mid.push(item)
      } else if (this.teams.radiant.off.length !== 2) {
        this.teams.radiant.off.push(item)
      } else if (this.teams.dire.safe.length !== 2) {
        this.teams.dire.safe.push(item)
      } else if (this.teams.dire.mid.length !== 1) {
        this.teams.dire.mid.push(item)
      } else if (this.teams.dire.off.length !== 2) {
        this.teams.dire.off.push(item)
      } else {
        return
      }

      this.heroes = this.heroes.filter(i => i.id !== item.id)
    },
    deselect (item) {
      if (this.teams.radiant.safe.includes(item)) {
        this.heroes.push(item)
        this.teams.radiant.safe = this.teams.radiant.safe.filter(i => i.id !== item.id)
      } else if (this.teams.radiant.mid.includes(item)) {
        this.heroes.push(item)
        this.teams.radiant.mid = this.teams.radiant.mid.filter(i => i.id !== item.id)
      } else if (this.teams.radiant.off.includes(item)) {
        this.heroes.push(item)
        this.teams.radiant.off = this.teams.radiant.off.filter(i => i.id !== item.id)
      } else if (this.teams.dire_safe.includes(item)) {
        this.heroes.push(item)
        this.teams.dire.safe = this.teams.dire.safe.filter(i => i.id !== item.id)
      } else if (this.teams.dire.mid.includes(item)) {
        this.heroes.push(item)
        this.teams.dire.mid = this.teams.dire.mid.filter(i => i.id !== item.id)
      } else if (this.teams.dire.off.includes(item)) {
        this.heroes.push(item)
        this.teams.dire.off = this.teams.dire.off.filter(i => i.id !== item.id)
      }
    },
    calculate () {
      let time = [900, 1800, 2700, 3600, 5400]
      let axis = [15, 30, 45, 60, 75]

      let map = [
         {'lane': 1, 'items': this.teams.radiant.safe},
         {'lane': 2, 'items': this.teams.radiant.mid},
         {'lane': 3, 'items': this.teams.radiant.off},
         {'lane': 1, 'items': this.teams.dire.safe},
         {'lane': 2, 'items': this.teams.dire.mid},
         {'lane': 3, 'items': this.teams.dire.off}
      ]

      let data = []
      let labels = ['Time']
      let heroes = []

      for (let x = 0; x < map.length; x++) {
        const element = map[x]
        for (let y = 0; y < element.items.length; y++) {
          const item = element.items[y]
          labels.push(item.name)
          heroes.push({'id': item.id, 'lane': element.lane, 'data': []})
        }
      }

      data.push(labels)

      for (let i = 0; i < axis.length; i++) {
        const a = axis[i]
        const t = time[i]

        let record = []
        record.push(a)

        for (let x = 0; x < heroes.length; x++) {
          const hero = heroes[x]

          let collection = this.data
              .filter(_ => _.hero_id === hero.id && _.lane_role === hero.lane && _.time === t)
              .map(_ => Math.round((_.wins / _.games) * 100))

          if (collection.length === 1) {
            let value = collection[0]
            record.push(value)
            hero.data.push(value)
          }
        }

        data.push(record)
      }

      // console.log('DATA', data)

      this.chartData = data
      this.calculated = true
    }
  },
    /*
    calculate () {
      let radaint = []

      for (let i = 0; i < this.radiant_safe.length; i++) {
        const hero = this.radiant_safe[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 1).map(i => Math.round((i.wins / i.games) * 100))
        radaint.push(data)
      }

      for (let i = 0; i < this.radiant_mid.length; i++) {
        const hero = this.radiant_mid[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 2).map(i => Math.round((i.wins / i.games) * 100))
        radaint.push(data)
      }

      for (let i = 0; i < this.radiant_off.length; i++) {
        const hero = this.radiant_off[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 3).map(i => Math.round((i.wins / i.games) * 100))
        radaint.push(data)
      }

      let dire = []

      for (let i = 0; i < this.dire_safe.length; i++) {
        const hero = this.dire_safe[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 1).map(i => Math.round((i.wins / i.games) * 100))
        dire.push(data)
      }

      for (let i = 0; i < this.dire_mid.length; i++) {
        const hero = this.dire_mid[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 2).map(i => Math.round((i.wins / i.games) * 100))
        dire.push(data)
      }

      for (let i = 0; i < this.dire_off.length; i++) {
        const hero = this.dire_off[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 3).map(i => Math.round((i.wins / i.games) * 100))
        dire.push(data)
      }

      let axis = ['Time', 'Radiant', 'Dire']
      let time = [15, 30, 45, 60, 75]

      let data = []
      data.push(axis)

      for (let i = 0; i < time.length; i++) {
        const t = time[i]
        const r = radaint.reduce((acc, item) => acc + item[i], 0) / 5
        const d = dire.reduce((acc, item) => acc + item[i], 0) / 5
        data.push([t, r, d])
      }

      let radaintValues = []
      let direValues = []
      for (let i = 0; i < time.length; i++) {
        const item = data[i + 1]
        const r = item[1]
        const d = item[2]
        radaintValues.push(r)
        direValues.push(d)
      }

      let radaintTrend = {}
      let direTrend = {}
      let radaintFn = lsq(time, radaintValues, radaintTrend)
      let direFn = lsq(time, direValues, direTrend)

      console.log('Radaint Trend', radaintTrend)
      console.log('Radaint Fn', radaintFn(0))

      console.log('Dire Trend', direTrend)
      console.log('Dire Fn', direFn(0))

      this.chartData = data
      this.calculated = true
    }
  },
  */
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
      'calculated': false,
      'heroes': [],
      'teams': {
        'radiant': {
          'safe': [],
          'mid': [],
          'off': []
        },
        'dire': {
          'safe': [],
          'mid': [],
          'off': []
        }
      },
      'data': [],
      'chartData': [],
      'chartOptions': {
        'height': 400,
        'hAxis': {
          'title': 'Time',
          'ticks': [0, 15, 30, 45, 60, 75, 90]
        },
        'vAxis': {
          'title': 'Strength',
          'ticks': [10, 30, 40, 45, 50, 55, 60, 70, 90]
        },
        'pointSize': 10,
        'series': {
          0: { 'pointShape': 'circle' },
          1: { 'pointShape': 'triangle' },
          2: { 'pointShape': 'square' },
          3: { 'pointShape': 'diamond' },
          4: { 'pointShape': 'star' },
          5: { 'pointShape': 'circle' },
          6: { 'pointShape': 'triangle' },
          7: { 'pointShape': 'square' },
          8: { 'pointShape': 'diamond' },
          9: { 'pointShape': 'star' }
        },
        'colors': ['#007329', '#007329', '#007329', '#007329', '#007329', '#AB0D06', '#AB0D06', '#AB0D06', '#AB0D06', '#AB0D06']
        /*
        'trendlines': {
          0: {'type': 'linear', color: '#007329', opacity: 0.6},
          1: {'type': 'linear', color: '#007329', opacity: 0.5},
          2: {'type': 'linear', color: '#007329', opacity: 0.4},
          3: {'type': 'linear', color: '#007329', opacity: 0.3},
          4: {'type': 'linear', color: '#007329', opacity: 0.2},
          5: {'type': 'linear', color: '#AB0D06', opacity: 0.6},
          6: {'type': 'linear', color: '#AB0D06', opacity: 0.5},
          7: {'type': 'linear', color: '#AB0D06', opacity: 0.4},
          8: {'type': 'linear', color: '#AB0D06', opacity: 0.3},
          9: {'type': 'linear', color: '#AB0D06', opacity: 0.2}
        }
        */
      }
    }
  },
  created () {
    const vm = this

    let p1 = axios.get('/static/data/heroes.json').then((reponse) => { return reponse.data })
    let p2 = axios.get('/static/data/hero_winrate_lane_duration.json').then((reponse) => { return reponse.data })
    Promise.all([p1, p2]).then((values) => {
      const heroes = values[0]
      const data = values[1]

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
.chart {
  min-height: 600px;
}
.dropable-target {
  min-height: 60px; 
  padding:10px;
}
</style>
