<script lang="ts">
  import IoMdSearch from "svelte-icons/io/IoIosSearch.svelte";

  export let value: string;
  export let placeholder = "Zoek";
</script>

<div class="relative">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3">
    <div class="w-5 h-5"><IoMdSearch /></div>
  </div>
  <input
    type="text"
    {placeholder}
    class="input input-bordered input-md border-2 max-w-sm mt-2 block w-full p-4 pl-9"
    bind:value
  />
</div>
