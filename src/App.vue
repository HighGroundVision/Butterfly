<template>
  <div id="app">
    <header>
      <b-navbar toggleable="md" type="dark" variant="dark">
        <b-container> 
          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
          <b-navbar-brand to="/">[HGV] Team Coordinator</b-navbar-brand>
          <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav class="mr-auto">
              <b-nav-item to="/draft/strength">Draft Strength</b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-container>
      </b-navbar>
    </header>
    <b-container>
      <router-view></router-view>
      <hr />
      <footer>
        <div class="text-center">
          <p>&copy; 2018 - High Ground Vision</p>
        </div>
      </footer>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
</style>
