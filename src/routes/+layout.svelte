<script lang="ts">
  import { articleStore } from "$lib/stores/firebase-article-store";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { setContext } from "svelte";
  import "../app.css";
  import EventCalendar from "$components/Events/EventCalendar.svelte";
  import Footer from "$components/Layout/Footer.svelte";
  import MenuVertical from "$components/Layout/MenuVertical.svelte";
  import Navbar from "$components/Layout/Navbar.svelte";

  const drawerID = "layout-drawer";
  const loginModalID = "login-modal";

  setContext("articleStore", articleStore);
</script>

<div class="drawer">
  <input id={drawerID} type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col h-screen">
    <Navbar {drawerID} {loginModalID} />
    <!-- Page content here -->
    <section class="my-1 flex-grow">
      <div class="grid lg:grid-cols-12 gap-4 lg:gap-4 p-2 xl:p-4 m-2 h-full">
        <main class="lg:col-span-8 xl:col-span-9 h-full">
          <slot />
        </main>
        <aside class="lg:col-span-4  xl:col-span-3 md:pt-0 py-0 p-2">
          <EventCalendar />
        </aside>
      </div>
    </section>
    <Footer />
  </div>
  <div class="drawer-side">
    <label for={drawerID} class="drawer-overlay" />
    <!-- Sidebar content here -->
    <MenuVertical />
  </div>
</div>

<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

<style>
  :root {
    /* Toast formatting */
    --toastBackground: transparent;
    --toastPadding: 0;
    --toastMsgPadding: 0;
    --toastWidth: fit-content;
    --toastBoxShadow: none;

    /* Toast layout */
    --toastContainerTop: auto;
    --toastContainerRight: 2rem;
    --toastContainerBottom: 2.5rem;
  }
</style>
