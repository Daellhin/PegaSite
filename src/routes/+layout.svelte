<script lang="ts">
  import EventsAside from "$components/events/aside/EventsAside.svelte"
  import Footer from "$components/layout/Footer.svelte"
  import MenuVertical from "$components/layout/MenuVertical.svelte"
  import Navbar from "$components/layout/Navbar.svelte"
  import SponsorsAside from "$components/sponsors/aside/SponsorsAside.svelte"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { SvelteToast } from "@zerodevx/svelte-toast"
  import "../app.css"

  const drawerID = "layout-drawer"
  const loginModalID = "login-modal"
</script>

<svelte:head>
  <title>{$pageHeadStore.getFullTitle()}</title>
</svelte:head>

<div class="drawer">
  <input id={drawerID} type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col h-screen">
    <Navbar {drawerID} {loginModalID} />
    <!-- Page content here -->
    <section class="mt-1 mb-10 flex-grow">
      <div
        class="grid lg:grid-cols-12 gap-4 lg:gap-4 py-0 px-2 xl:px-4 mx-2 h-full"
      >
        <main class="lg:col-span-8 xl:col-span-9 h-full">
          <slot />
        </main>
        <hr class="mt-auto lg:hidden" />
        <aside class="lg:col-span-4 xl:col-span-3 md:pt-0 py-0 p-2">
          <div class="flex flex-col gap-3">
            <EventsAside />
            <SponsorsAside />
          </div>
        </aside>
      </div>
    </section>
    <Footer {loginModalID} />
  </div>
  <div class="drawer-side">
    <label for={drawerID} class="drawer-overlay" />
    <!-- Sidebar content here -->
    <MenuVertical {drawerID} />
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
