<script lang="ts">
  import FaFacebookSquare from "svelte-icons/fa/FaFacebookSquare.svelte";
  import FaSlackHash from "svelte-icons/fa/FaSlackHash.svelte";
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
    <a class="underline" href="https://www.facebook.com/PegasusLonderzeel/">
      <div class="flex flex-row gap-1">
        <div class="w-5 h-5"><FaFacebookSquare /></div>
        <span class="md:hidden">Facebook</span>
      </div>
    </a>
  </div>
</footer>
