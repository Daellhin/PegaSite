<script lang="ts">
  import { linkifyText } from "$lib/utils/Utils";

  export let content: string;
  export let placeHolder = "Geen inhoud";
  export let showLinks = false;
  let classNames = "";
  export { classNames as class };
</script>

<div class={`usercontent ${classNames}`}>
  {#if showLinks}
    {@html linkifyText(content) || placeHolder}
  {:else}
    {@html content || placeHolder}
  {/if}
</div>

<style lang="postcss">
  @import "../css/usercontent.postcss";
</style>
