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
  /* Integrate CL editor with tailwind and dark mode */
  :global(.cl) {
    :global(.cl-button svg) {
      display: initial !important;
    }
    @media (prefers-color-scheme: light) {
      :global(.cl-button.active),
      :global(.cl-button:hover) {
        background-color: #dcdedf !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      :global(.cl-content) {
        @apply bg-base-100 !important;
      }
      :global(.cl-button.active),
      :global(.cl-button:hover) {
        background-color: #313641 !important;
      }
      :global(.cl-button path) {
        fill: #a6adbb !important;
      }
    }
    :global(.cl-actionbar) {
      @apply bg-base-200 !important;
    }
  }
  /* Add default styles for user typed content */
  :global(.cl),
  :global(.usercontent) {
    :global(h1) {
      @apply text-2xl !important;
      @apply font-semibold !important;
    }
    :global(h2) {
      @apply text-xl !important;
      @apply font-semibold !important;
    }
    :global(blockquote) {
      @apply p-4 my-4 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800 !important;
    }
    :global(ul) {
      @apply list-disc list-inside !important;
    }
    :global(ol) {
      @apply list-decimal list-inside !important;
    }
  }
</style>
