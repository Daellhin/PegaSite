<script>
  import Card from "../components/Card.svelte";
</script>

<div class="flex gap-4 flex-wrap">
  {#each Array(5) as i}
    <Card />
  {/each}
</div>
