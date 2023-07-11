<script lang="ts">
  export let content: string;
  export let placeHolder = "Geen inhoud";
  let classNames = "";
  export { className as class };
</script>

<div class={`usercontent ${classNames}`}>
  {@html content || placeHolder}
</div>

<style lang="postcss">
  @import "../css/usercontent.postcss";
</style>
