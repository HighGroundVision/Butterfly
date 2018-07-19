<template>
  <section v-if="ready">
    <b-row>
      <b-col>
        <div class="text-center">
          <h1 class="text-warning">Team Strength</h1>
        </div>
      </b-col>
    </b-row>
    <div v-if="!full">
      <b-row>
        <b-col>
          <p>
            Team Strength analysis is a complex topic. 
            We tend to refer to this tool internaly as the <span title="H'FAW">"How Fucked Are We"</span>. 
            We will break down your team's strenght vs the enemy team over time and graphed the result.
            We will also do an interecption analysis on the data above to determine which team starts strong and which one finishes strong and when, also if, those trends intercept.
          </p>
          <p>
            You start by selecting the heroes. 
            You then order them (using Drag & Drop) into the lanes based on the start of match.
            After you hit that Calculate to view the results. 
            You can change up the lanes to match changes as the develop in the start of the match and recalculate to view the new results.
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-input v-model="filter" placeholder="Filter by Hero" />
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col>
          <draggable v-model="heroes" :options="{group:'heroes'}" >
            <template v-for="hero in pool">
              <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="select(hero)" />
            </template>
          </draggable>
        </b-col>
      </b-row>
    </div>
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
              <draggable v-model="teams.radiant.safe" :options="{group:'heroes'}" class="border border-success dropable-target text-center rounded">
                <template v-for="hero in teams.radiant.safe">
                  <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
                </template>
              </draggable>
            </b-col>
            <b-col>
              <div class="text-center">
                <h5>Mid</h5>
              </div>
              <draggable v-model="teams.radiant.mid" :options="{group:'heroes'}" class="border border-success dropable-target text-center rounded">
                <template v-for="hero in teams.radiant.mid">
                  <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
                </template>
              </draggable>
            </b-col>
            <b-col>
              <div class="text-center">
                <h5>Off</h5>
              </div>
              <draggable v-model="teams.radiant.off" :options="{group:'heroes'}" class="border border-success dropable-target text-center rounded">
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
              <draggable v-model="teams.dire.safe" :options="{group:'heroes'}" class="border border-danger dropable-target text-center rounded">
                <template v-for="hero in teams.dire.safe">
                  <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
                </template>
              </draggable>
            </b-col>
            <b-col>
              <div class="text-center">
                <h5>Mid</h5>
              </div>
              <draggable v-model="teams.dire.mid" :options="{group:'heroes'}" class="border border-danger dropable-target text-center rounded">
                <template v-for="hero in teams.dire.mid">
                  <b-img v-bind:key="hero.id" :src="hero.icon" :title="hero.name" @click="deselect(hero)" />
                </template>
              </draggable>
            </b-col>
            <b-col>
              <div class="text-center">
                <h5>Off</h5>
              </div>
              <draggable v-model="teams.dire.off" :options="{group:'heroes'}" class="border border-danger dropable-target text-center rounded">
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
            <b-btn @click="calculate" variant="primary">Calculate</b-btn>
            <b-btn @click="clear" variant="secondary">Clear</b-btn>
          </div>
        </b-col>
      </b-row>
      <br />
      <b-row v-if="calculated">
        <b-col>
          <div class="chart-section rounded">
            <GChart type="ScatterChart" :data="chartData" :options="chartOptions"  />
          </div>
        </b-col>
      </b-row>
      <br />
      <b-row v-if="calculated">
        <b-col>
          <h5>Insights: <small>So what dose this all mean?</small></h5>
          <p>
            <template v-if="sumary.start.delta < 3 && sumary.end.delta < 3">
              Both teams appear to be evenly matched, this match go could either way.
            </template>
            <template v-else>
              <ul>
              <li v-if="sumary.start.delta < 3">
                Near the start of the match both teams are approximately evenly matched.
              </li>
              <li v-else>
                Near the start of the match <span v-if="sumary.start.team === 1" class="text-success">Radiant</span><span v-if="sumary.start.team === 2" class="text-danger">Dire</span> will have a ~{{sumary.start.delta}}% advantage.
              </li>
              <li v-if="sumary.intersection.enabled">
                At ~{{sumary.intersection.time}} minutes the teams will be evenly match with <span class="text-success">Radiant</span> trending {{sumary.intersection.radiant}} and <span class="text-danger">Dire</span> trending {{sumary.intersection.dire}}. 
              </li>
              <li v-if="sumary.end.delta < 3">
                Near the end of the match both teams are approximately evenly matched.
              </li>
              <li v-else>
                Near the end of the match <span v-if="sumary.end.team === 1" class="text-success">Radiant</span><span v-if="sumary.end.team === 2" class="text-danger">Dire</span> will have a ~{{sumary.end.delta}}% advantage.
              </li>
              </ul>
            </template>
          </p>
        </b-col>
      </b-row>
  </section>
  <section v-else class="text-center">
    <hgv-loader :color="'#ffc107'"></hgv-loader>
  </section>
</template>

<script>
import axios from 'axios'
// import {getRandomEndingOption} from '@/assets/main'
import draggable from 'vuedraggable'
import { GChart } from 'vue-google-charts'
import lsq from 'least-squares' // https://github.com/jprichardson/least-squares
const intersect = require('line-intersect')

export default {
  name: 'Draft',
  components: { draggable, GChart },
  methods: {
    select (item) {
      this.filter = null

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
      } else if (this.teams.dire.safe.includes(item)) {
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
    getRadaintWinRate () {
      let time = [900, 1800, 2700, 3600, 5400]
      let team = []

      for (let i = 0; i < this.teams.radiant.safe.length; i++) {
        const hero = this.teams.radiant.safe[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 1).map(i => Math.round((i.wins / i.games) * 100))
        team.push(data)
      }

      for (let i = 0; i < this.teams.radiant.mid.length; i++) {
        const hero = this.teams.radiant.mid[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 2).map(i => Math.round((i.wins / i.games) * 100))
        team.push(data)
      }

      for (let i = 0; i < this.teams.radiant.off.length; i++) {
        const hero = this.teams.radiant.off[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 3).map(i => Math.round((i.wins / i.games) * 100))
        team.push(data)
      }

      let data = []
      for (let i = 0; i < time.length; i++) {
        let value = team.reduce((acc, item) => acc + item[i], 0) / 5
        data.push(value)
      }

      return data
    },
    getDireWinRate () {
      let time = [900, 1800, 2700, 3600, 5400]
      let team = []

      for (let i = 0; i < this.teams.dire.safe.length; i++) {
        const hero = this.teams.dire.safe[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 1).map(i => Math.round((i.wins / i.games) * 100))
        team.push(data)
      }

      for (let i = 0; i < this.teams.dire.mid.length; i++) {
        const hero = this.teams.dire.mid[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 2).map(i => Math.round((i.wins / i.games) * 100))
        team.push(data)
      }

      for (let i = 0; i < this.teams.dire.off.length; i++) {
        const hero = this.teams.dire.off[i]
        let data = this.data.filter(i => i.hero_id === hero.id && i.lane_role === 3).map(i => Math.round((i.wins / i.games) * 100))
        team.push(data)
      }

      let data = []
      for (let i = 0; i < time.length; i++) {
        let value = team.reduce((acc, item) => acc + item[i], 0) / 5
        data.push(value)
      }

      return data
    },
    calculate () {
      this.filter = null

      let radaint = this.getRadaintWinRate()
      let dire = this.getDireWinRate()
      let time = [15, 30, 45, 60, 75]
      let axis = ['Time', 'Radiant', 'Dire']

      let data = []
      data.push(axis)
      for (let i = 0; i < time.length; i++) {
        const t = time[i]
        const r = radaint[i]
        const d = dire[i]
        data.push([t, r, d])
      }
      this.chartData = data

      let radaintTrend = {}
      let direTrend = {}
      let radaintFn = lsq(time, radaint, radaintTrend)
      let direFn = lsq(time, dire, direTrend)

      let startingDelta = radaintFn(15) - direFn(15)
      this.sumary.start.team = startingDelta > 0 ? 1 : 2
      this.sumary.start.delta = Math.round(Math.abs(startingDelta))

      let endingDelta = radaintFn(75) - direFn(75)
      this.sumary.end.team = endingDelta > 0 ? 1 : 2
      this.sumary.end.delta = Math.round(Math.abs(endingDelta))

      let result = intersect.checkIntersection(15, radaintFn(15), 75, radaintFn(75), 15, direFn(15), 75, direFn(75))
      if (result.type === 'intersecting') {
        this.sumary.intersection.enabled = true
        this.sumary.intersection.time = Math.round(result.point.x)
        this.sumary.intersection.value = Math.round(result.point.y)
        this.sumary.intersection.radiant = radaintTrend.m > 0 ? 'positively' : 'negatively'
        this.sumary.intersection.dire = direTrend.m > 0 ? 'positively' : 'negatively'
      } else {
        this.sumary.intersection.enabled = false
      }

      this.calculated = true
    },
    clear () {
      this.filter = null

      for (let i = 0; i < this.teams.radiant.safe.length; i++) {
        const hero = this.teams.radiant.safe[i]
        this.heroes.push(hero)
      }

      for (let i = 0; i < this.teams.radiant.mid.length; i++) {
        const hero = this.teams.radiant.mid[i]
        this.heroes.push(hero)
      }

      for (let i = 0; i < this.teams.radiant.off.length; i++) {
        const hero = this.teams.radiant.off[i]
        this.heroes.push(hero)
      }

      for (let i = 0; i < this.teams.dire.safe.length; i++) {
        const hero = this.teams.dire.safe[i]
        this.heroes.push(hero)
      }

      for (let i = 0; i < this.teams.dire.mid.length; i++) {
        const hero = this.teams.dire.mid[i]
        this.heroes.push(hero)
      }

      for (let i = 0; i < this.teams.dire.off.length; i++) {
        const hero = this.teams.dire.off[i]
        this.heroes.push(hero)
      }

      this.teams.radiant.safe = []
      this.teams.radiant.mid = []
      this.teams.radiant.off = []
      this.teams.dire.safe = []
      this.teams.dire.mid = []
      this.teams.dire.off = []

      this.calculated = false
    }
  },
  computed: {
    pool () {
      let heroes = this.heroes

      if (this.filter) {
        heroes = heroes.filter((h) => {
          return h.name.toLowerCase().includes(this.filter.toLowerCase())
        })
      }

      heroes.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name))
      return heroes
    },
    full () {
      var radiantCount = this.teams.radiant.safe.length + this.teams.radiant.mid.length + this.teams.radiant.off.length
      var direCount = this.teams.dire.safe.length + this.teams.dire.mid.length + this.teams.dire.off.length
      return radiantCount === 5 && direCount === 5
    }
  },
  data () {
    return {
      'ready': false,
      'calculated': false,
      'data': [],
      'heroes': [],
      'filter': null,
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
      'sumary': {
        'start': {
          'team': null,
          'delta': null
        },
        'end': {
          'team': null,
          'delta': null
        },
        'intersection': {
          'enabled': false,
          'time': null,
          'value': null,
          'radiant': null,
          'dire': null
        }
      },
      'chartData': [],
      'chartOptions': {
        'height': 300,
        'hAxis': {
          'title': 'Time',
          'titleTextStyle': {
            'fontSize': 20
          },
          'ticks': [
            {v: 0, f: ''},
            {v: 15, f: 'Laning [0-15]'},
            {v: 30, f: 'Early Game [15-30]'},
            {v: 45, f: 'Mid Game [30-45]'},
            {v: 60, f: 'Late Game [45-60]'},
            {v: 75, f: 'End Game [60+]'},
            {v: 90, f: ''}
          ]
        },
        'vAxis': {
          'title': 'Strength',
          'titleTextStyle': {
            'fontSize': 20
          },
          'ticks': [
            {v: 30, f: '30%'},
            {v: 40, f: '40%'},
            {v: 45, f: '45%'},
            {v: 50, f: '50%'},
            {v: 55, f: '55%'},
            {v: 60, f: '50%'},
            {v: 70, f: '70%'}
          ]
        },
        'colors': ['#007329', '#AB0D06'],
        'trendlines': {
          0: {'type': 'linear', 'color': '#007329', 'opacity': 0.6},
          1: {'type': 'linear', 'color': '#AB0D06', 'opacity': 0.6}
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
.dropable-target {
  min-height: 60px; 
  padding:10px;
}
.chart-section {
  background-color: white; 
  padding: 5px;
}
</style>
