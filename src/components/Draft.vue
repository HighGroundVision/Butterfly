<template>
  <section v-if="ready">
    <b-row>
      <b-col>
        <h1>Drafting <small>Strength</small></h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>
          Drafting Strength analysis is a complex topic. 
          We at [HGV] tend to refer to this tool internaly as the "How Fucked Are We" (or HFAW for short). 
          To understand this we will explain how the tool works. 
          You start by selecting the heroes. 
          You then order them (using Drag & Drop) into the lanes based on the start of match.
          After you hit that Calculate button a few things will happen.
          We will break down your team's strenght vs the enemy team over time, we went one step farther and graphed the result.
          We will also do an interecption analysis on the data above to determine which team starts strong and which one finishes strong and when, also if, those trends intercept.
          We will be updating this page with more insights as they are developed.</p>
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
          <b-btn @click="clear" variant="danger">Clear</b-btn>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="calculated">
      <b-col>
        <GChart type="ScatterChart" :data="chartData" :options="chartOptions" />
      </b-col>
    </b-row>
    <b-row v-if="calculated">
      <b-col>
        <div class="text-center">
          <h5>Insights</h5>
        </div>
        <p>
          So what dose this all mean?
          <template v-if="sumary.start.delta < 3 && sumary.end.delta < 3">
            Both teams appear to be evenly matched, this match go could either way.
          </template>
          <template v-else>
            <template v-if="sumary.start.delta < 3">
              Near the start of the match both teams are approximately evenly matched.
            </template>
            <template v-else>
              Near the start of the match <span v-if="sumary.start.team === 1" class="text-success">Radiant</span><span v-if="sumary.start.team === 2" class="text-danger">Dire</span> will have a ~{{sumary.start.delta}}% advantage.
            </template>
            <template v-if="sumary.intersection.enabled">
              At ~{{sumary.intersection.time}} minutes the teams will be evenly match with <span class="text-success">Radiant</span> trending {{sumary.intersection.radiant}} and <span class="text-danger">Dire</span> trending {{sumary.intersection.dire}}. 
            </template>
            <template v-if="sumary.end.delta < 3">
              Near the end of the match both teams are approximately evenly matched.
            </template>
            <template v-else>
              Near the end of the match <span v-if="sumary.end.team === 1" class="text-success">Radiant</span><span v-if="sumary.end.team === 2" class="text-danger">Dire</span> will have a ~{{sumary.end.delta}}% advantage.
            </template>
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
import draggable from 'vuedraggable'
import { GChart } from 'vue-google-charts'
import lsq from 'least-squares' // https://github.com/jprichardson/least-squares
const intersect = require('line-intersect')

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
      'data': [],
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
          'ticks': [0, 15, 30, 45, 60, 75, 90]
        },
        'vAxis': {
          'title': 'Strength',
          'ticks': [30, 40, 45, 50, 55, 60, 70]
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
</style>
