<script lang="ts">
  import Editor from "cl-editor/src/Editor.svelte";

  export let label: string;
  export let value: string;
  export let required = false;
  /**
   * Toolbar actions
   * - Empty array is all actions
   * - Reference: https://github.com/nenadpnc/cl-editor/blob/50706f3fb0cc7ed25d9cd2bd2ed05619fd501842/src/helpers/actions.js#L16
   */
  export let actions = [
    "viewHtml",
    "undo",
    "redo",
    "b",
    "i",
    "u",
    "strike",
    "sup",
    "sub",
    "h1",
    "h2",
    "p",
    "blockquote",
    "ol",
    "ul",
    "hr",
    "left",
    "right",
    "center",
    "justify",
    //"a",
    //"image",
    "forecolor",
    "backcolor",
    "removeFormat",
  ];
</script>

<div class="form-control">
  <label class="label" for="editor">
    <span class="label-text">
      {label}
      {#if required}
        <span class="text-red-500 font-bold">*</span>
      {/if}
    </span>
  </label>
  <Editor html={value} on:change={(evt) => (value = evt.detail)} {actions} />
</div>

<style lang="postcss">
  @import "../../css/cl-editor.postcss";
</style>
