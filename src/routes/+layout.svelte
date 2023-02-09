<script>
  import "../app.css";
  // import NavBar from "../components/NavBar/NavBar.svelte";
  import EventCalendar from "../components/EventCalendar.svelte";
  import Footer from "../components/Layout/Footer.svelte";
  import MenuVertical from "../components/Layout/MenuVertical.svelte";
  import Navbar from "../components/Layout/Navbar.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";

  const drawerID = "layout-drawer";
  const loginModalID = "login-modal";
</script>

<div class="drawer">
  <input id={drawerID} type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col h-screen">
    <Navbar {drawerID} {loginModalID} />
    <!-- Page content here -->
    <section class="my-1 flex-grow">
      <div class="grid md:grid-cols-12 gap-5 p-4 m-2 h-full">
        <main class="md:col-span-9 h-full">
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
    <label for={drawerID} class="drawer-overlay" />
    <!-- Sidebar content here -->
    <MenuVertical {drawerID} {loginModalID} />
  </div>
</div>

<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

<style>
  :root {
    --toastBackground: transparent;
    --toastBarBackground: #5114b9;
    --toastPadding: 0;
    --toastMsgPadding: 0;
    --toastWidth: fit-content;

    --toastContainerTop: auto;
    --toastContainerRight: 2rem;
    --toastContainerBottom: 4rem;
  }
</style>