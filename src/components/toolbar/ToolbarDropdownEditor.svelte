<script lang="ts">
  import ToolbarDropdownEditorRow from "./ToolbarDropdownEditorRow.svelte";
</script>

<div>
  <h2 class="text-2xl font-bold">De club</h2>
  <div class="flex flex-col gap-3">
    <ToolbarDropdownEditorRow />
    <ToolbarDropdownEditorRow />
    <ToolbarDropdownEditorRow />
  </div>
  <button class="btn btn-primary btn-sm mt-2 max-w-sm normal-case ml-3"
    >Link toevoegen</button
  >
</div>
