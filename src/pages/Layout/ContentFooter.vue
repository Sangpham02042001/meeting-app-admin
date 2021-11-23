<template>
  <footer class="footer">
    <div class="container">
      <nav>
        <ul>
          <li>
            <a href="#/users">Users</a>
          </li>
          <li>
            <a href="#/teams">Teams</a>
          </li>
          <li>
            <a href="#/meetings">Meetings</a>
          </li>
          <li>
            <a href="#/support">Support</a>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; {{ new Date().getFullYear() }}
        <a href="#" target="_blank"
          >Meeting App</a
        >, made with <i class="fa fa-heart heart"></i> for a better web
      </div>
    </div>
  </footer>
</template>
<script>
export default {};
</script>
<style></style>
