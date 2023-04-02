<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte";

  let linkTitle: string = "Lid worden";
  $: linkUrl = `/${linkTitle.replace(/ /g, "-").toLowerCase()}`;
</script>

<div class="ml-3 grid grid-cols-3 sm:grid-cols-5 gap-2 items-center">
  <div class="italic">{linkUrl}</div>
  <input
    class="input input-bordered input-sm col-span-3"
    type="text"
    placeholder="Titel"
    bind:value={linkTitle}
  />
  <EditDropdown editUrl="/todo" deleteHandler={() => {}} size="sm" />
</div>
