<script>
  import Card from "../components/Card.svelte";
</script>

<section class="my-1">
  <div class="grid md:grid-cols-12 gap-5 p-4 m-2">
    <main class="md:col-span-9">
      <div class="flex gap-4 flex-wrap">
        {#each Array(5) as i}
          <Card />
        {/each}
      </div>
    </main>
    <aside class="md:col-span-3 md:pt-0 p-2">
      <p>Aside</p>
    </aside>
  </div>
</section>
