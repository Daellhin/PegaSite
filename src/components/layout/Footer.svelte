<script lang="ts">
  import { authStore } from "$lib/stores/AuthStore";
  import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
  import { faFeather, faSignIn } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let loginModalID: string;
</script>

<footer
  class="footer flex flex-col gap-3 sm:flex-row sm:justify-between p-3 bg-neutral text-neutral-content"
>
  <div class="items-center grid-flow-col">
    <Fa icon={faFeather} class="text-2xl" flip="horizontal" />
    <p>
      Copyright © {new Date().getFullYear()} - AC Pegasus Londerzeel
      <br />
      <a href="/" class="link-hover">Versie: 0.1</a>,
      <a href="/" class="link-hover">Ontwerp: Lorin Speybrouck</a>
    </p>
  </div>
  <div class="flex gap-3 sm:gap-0">
    <a
      class="flex gap-1 btn btn-sm btn-square btn-ghost w-fit md:w-8 normal-case"
      href="https://www.facebook.com/PegasusLonderzeel/"
    >
      <Fa icon={faFacebookSquare} class="text-xl" />
      <span class="md:hidden">Facebook</span>
    </a>
    {#if !$authStore}
      <label
        for={loginModalID}
        class="flex gap-1 btn btn-sm btn-square btn-ghost w-fit md:w-8 normal-case"
      >
        <Fa icon={faSignIn} class="text-xl" />
        <span class="md:hidden">Inloggen</span>
      </label>
    {/if}
  </div>
</footer>
