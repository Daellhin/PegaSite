<script lang="ts">
  import { authStore } from "$lib/stores/AuthStore";
  import FaFacebookSquare from "svelte-icons/fa/FaFacebookSquare.svelte";
  import FaSignInAlt from "svelte-icons/fa/FaSignInAlt.svelte";
  import FaSlackHash from "svelte-icons/fa/FaSlackHash.svelte";

  export let loginModalID: string;
</script>

<footer class="footer items-center p-4 bg-neutral text-neutral-content">
  <div class="items-center grid-flow-col">
    <div class="w-6 h-6"><FaSlackHash /></div>
    <p>
      Copyright © {new Date().getFullYear()} - AC Pegasus Londerzeel
      <br />
      <a href="/" class="link-hover">Versie: 0.1</a>,
      <a href="/" class="link-hover">Ontwerp: Lorin Speybrouck</a>
    </p>
  </div>
  <div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
    <div class="flex flex-col md:flex-row w-full">
      {#if !$authStore}
        <label
          for={loginModalID}
          class="flex gap-1 btn btn-sm btn-square btn-ghost w-full md:w-8"
        >
          <div class="w-5 h-5"><FaSignInAlt /></div>
          <span class="md:hidden">Inloggen</span>
        </label>
      {/if}
      <a
        class="flex gap-1 btn btn-sm btn-square btn-ghost w-full md:w-8"
        href="https://www.facebook.com/PegasusLonderzeel/"
      >
        <div class="w-5 h-5"><FaFacebookSquare /></div>
        <span class="md:hidden">Facebook</span>
      </a>
    </div>
  </div>
</footer>
