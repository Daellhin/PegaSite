<script lang="ts">
  import ToolbarDropdownEditor from "$components/toolbar/ToolbarDropdownEditor.svelte";
</script>

<h1 class="text-2xl font-bold">Toolbar wijzigen</h1>

<div class="sm:ml-4 flex flex-col mt-4 gap-5">
  <ToolbarDropdownEditor />
  <ToolbarDropdownEditor />
  <ToolbarDropdownEditor />
</div>

<button class="btn btn-primary mt-8 max-w-sm" disabled={true}>
  Wijzigingen opslaan
</button>
