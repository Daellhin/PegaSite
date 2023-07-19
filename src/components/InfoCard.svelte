<script lang="ts">
  import MdInfoOutline from "svelte-icons/md/MdInfoOutline.svelte";

  let classList = "";
  export { classList as class };
</script>

<div class={"alert border border-base-300 w-fit " + classList}>
  <div class="text-info flex-shrink-0 w-6 h-6"><MdInfoOutline /></div>
  <span>
    <slot />
  </span>
</div>
