<script>
  import "../app.css";
  // import NavBar from "../components/NavBar/NavBar.svelte";
  import FaBars from "svelte-icons/fa/FaBars.svelte";
  import PegaIcon from "../components/NavBar/PegaIcon.svelte";
  import MenuOptions from "../components/NavBar/MenuOptions.svelte";
</script>

<div class="drawer">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="w-full navbar">
      <div class="navbar-start">
        <!-- Always vissible -->
        <a class="btn btn-ghost normal-case h-auto">
          <PegaIcon />
        </a>
      </div>
      <div class="flex-none hidden lg:block">
        <ul class="menu menu-horizontal">
          <!-- Navbar menu content here -->
          <MenuOptions />
        </ul>
      </div>
      <div class="navbar-end">
        <div class="lg:hidden">
          <label for="my-drawer-3" class="btn btn-square btn-ghost">
            <div class="w-5 h-5">
              <FaBars />
            </div>
          </label>
        </div>
      </div>
    </div>
    <!-- Page content here -->
    <slot />
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" class="drawer-overlay" />
    <ul class="menu p-4 w-80 bg-base-100">
      <!-- Sidebar content here -->
      <MenuOptions />
    </ul>
  </div>
</div>
