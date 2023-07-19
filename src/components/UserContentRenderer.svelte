<script lang="ts">
  import { linkifyText } from "$lib/utils/Utils";

  export let content: string;
  export let placeHolder = "Geen inhoud";
  export let showLinks = false;
  let classList = "";
  export { classList as class };
</script>

<div class={`usercontent ${classList}`}>
  {#if showLinks}
    {@html linkifyText(content) || placeHolder}
  {:else}
    {@html content || placeHolder}
  {/if}
</div>

<style lang="postcss">
  @import "../css/usercontent.postcss";
</style>
