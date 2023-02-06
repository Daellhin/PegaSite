<script lang="ts">
  // https://github.com/nenadpnc/cl-editor
  import Editor from "cl-editor/src/Editor.svelte";

  let html = "<h2>Hello</h2>";
  let editor;
</script>

<Editor {html} on:change={(evt) => (html = evt.detail)} />
<div class="usercontent">
  {@html html}
</div>

<style lang="postcss">
  @import "../../css/cl-editor.postcss";
  @import "../../css/usercontent.postcss";
</style>
