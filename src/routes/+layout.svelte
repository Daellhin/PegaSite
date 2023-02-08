<script>
  import "../app.css";
  // import NavBar from "../components/NavBar/NavBar.svelte";
  import FaBars from "svelte-icons/fa/FaBars.svelte";
  import PegaIcon from "../components/Layout/PegaIconWithText.svelte";
  import MenuVertical from "../components/Layout/MenuVertical.svelte";
  import MenuHorizontal from "../components/Layout/MenuHorizontal.svelte";
  import Footer from "../components/Layout/Footer.svelte";
  import EventCalendar from "../components/EventCalendar.svelte";
  import Navbar from "../components/Layout/Navbar.svelte";

  const drawerName = "layout-drawer";
</script>

<div class="drawer">
  <input id={drawerName} type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <Navbar {drawerName} />
    <!-- Page content here -->
    <section class="my-1">
      <div class="grid md:grid-cols-12 gap-5 p-4 m-2">
        <main class="md:col-span-9">
          <slot />
        </main>
        <aside class="md:col-span-3 md:pt-0 p-2">
          <EventCalendar />
        </aside>
      </div>
    </section>
    <Footer />
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" class="drawer-overlay" />
    <!-- Sidebar content here -->
    <MenuVertical />
  </div>
</div>
