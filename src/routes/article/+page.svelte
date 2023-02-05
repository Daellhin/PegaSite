<script lang="ts">
  import Time from "svelte-time";
  import FaRegCalendar from "svelte-icons/fa/FaRegCalendar.svelte";
  import FaUser from "svelte-icons/fa/FaUser.svelte";
</script>

<h1 class="text-5xl">Clubfeest 2023</h1>
<div class="flex flex-row gap-3 ml-1">
  <!-- Time -->
  <div class="flex flex-row gap-1 items-center">
    <div class="w-4 h-4">
      <FaRegCalendar />
    </div>
    <Time class="opacity-60 text-md" timestamp={new Date()} />
  </div>
  <!-- Author -->
  <div class="flex flex-row gap-1 items-center">
    <div class="w-4 h-4">
      <FaUser />
    </div>
    <span class="opacity-60 text-md">Lorin Speybrouck</span>
  </div>
</div>
<div class="flex flex-row gap-2 mt-2">
  <div class="badge badge-primary badge-lg">Belangrijk</div>
  <div class="badge badge-primary badge-lg">Algemeen</div>
</div>

<img
  src="images/shoe.jpg"
  alt="Shoes"
  class="mx-auto max-w-full h-auto max-h-80 my-3"
/>

<div class="text-xl">
    <p class="mb-1">Beste atleet, beste ouders</p>
    <p class="mb-1">Even wat informatie over 3 februari.</p>
    <br>
    <p class="mb-1">Die dag zal er geen training zijn.</p>
    <p class="mb-1">
      Aan de mensen die ingeschreven zijn voor het clubfeest, vragen we om cash geld
      te voorzien. De drankjes bij het eten moeten nog ter plaatse betaald worden.
    </p>
    <p class="mb-1">
      De aanwezige laureaten van het wedstrijds- en joggingscriterium zullen ter
      plaatse hun prijs ontvangen.
    </p>
    <br>
    <p class="mb-1">Vriendelijke groeten,</p>
    <p class="mb-1">Het Bestuur</p>
</div>

