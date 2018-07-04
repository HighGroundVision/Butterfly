<template>
  <section v-if="ready">
    <b-row>
      <b-col>
        <h1>Drafting</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus accumsan mi at felis ornare, quis suscipit lacus facilisis. Sed eu cursus augue. Praesent faucibus erat sed finibus vulputate. Curabitur sollicitudin augue in sodales molestie. Aenean et nisl justo. Etiam varius ut dui at tempor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec a neque egestas, placerat ante eu, congue odio. Nunc at quam nisi.</p>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col class="team-divider">
        <b-row>
          <b-col>
            <div class="text-center">
              <h2 class="text-success">Radiant</h2>
            </div>
          </b-col>
        </b-row>
        <b-row class="text-center">
          <b-col cols="5">
            <h3>Safe</h3>
          </b-col>
          <b-col cols="2">
            <h3>Mid</h3>
          </b-col>
          <b-col cols="5">
            <h3>Off</h3>
          </b-col>
        </b-row>
        <b-row class="text-center">
          <b-col>
            <b-img @click="draft(1,1,1)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col>
            <b-img @click="draft(1,1,5)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col class="mid-divider">
            <b-img @click="draft(1,2,2)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col>
            <b-img @click="draft(1,3,4)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col >
            <b-img @click="draft(1,3,3)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <b-row>
          <b-col>
            <div class="text-center">
              <h2 class="text-danger">Dire</h2>
            </div>
          </b-col>
        </b-row>
        <b-row class="text-center">
          <b-col cols="5">
            <h3>Safe</h3>
          </b-col>
          <b-col cols="2">
            <h3>Mid</h3>
          </b-col>
          <b-col cols="5">
            <h3>Off</h3>
          </b-col>
        </b-row>
        <b-row class="text-center">
          <b-col>
            <b-img @click="draft(2,1,1)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col>
            <b-img @click="draft(2,1,5)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col class="mid-divider">
            <b-img @click="draft(2,2,2)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col>
            <b-img @click="draft(2,3,4)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
          <b-col >
            <b-img @click="draft(2,3,3)" rounded blank width="70" height="95" blank-color="#777" alt="img" class="m-1" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </section>
  <section v-else class="text-center">
    <hgv-loader :color="'#ffc107'"></hgv-loader>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Draft',
  methods: {
    draft (team, lane, pos) {
      console.log('Data', { 'team': team, 'lane': lane, 'pos': pos })
    }
  },
  data () {
    return {
      'ready': false,
      'radiant': [],
      'dire': [],
      'heroes': [],
      'data': []
    }
  },
  created () {
    const vm = this

    let p1 = axios.get('/static/data/heroes.json').then((reponse) => { return reponse.data })
    let p2 = axios.get('/static/data/hero_winrate_lane_duration.json').then((reponse) => { return reponse.data })
    Promise.all([p1, p2]).then((values) => {
      const heroes = values[0]
      const data = values[0]

      // TODO: DON'T NEED TO STRUCTURE AT THIS POINT; JUST GET THE HEROES; THEN STRUCTURE LANES + POSITIONS; THEN GRAPH THE RESULTS... 

      vm.data = data
      vm.heroes = heroes
      vm.ready = true
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.team-divider {
  border-right: 1px solid black;
}
.mid-divider {
  border-left: 1px solid black; 
  border-right: 1px solid black;
}
</style>
