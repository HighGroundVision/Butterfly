<template>
  <div id="app">
    <b-container> 
    <header class="top-spacing">
      <b-navbar toggleable="md"  type="dark" variant="secondary" class="rounded">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">[HGV] Team Coordinator</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav class="mr-auto">
            <!--
              <b-nav-item to="/">Team Synergies</b-nav-item>
              <b-nav-item to="/">Lane Optimizer</b-nav-item>
            -->
            <b-nav-item to="/TeamStrength">Team Strength</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    </b-container>
    <b-container class="top-spacing">
      <router-view></router-view>
      <hr class="highlighted" />
      <footer>
        <div class="text-center">
          <p>&copy; {{year}} - <a href="https://hgv-tango.azurewebsites.net/" target="_blank">High Ground Vision</a></p>
        </div>
      </footer>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      'year': new Date().getFullYear()
    }
  }
}
</script>

<style>
.top-spacing {
  padding-top: 10px;
}
</style>
