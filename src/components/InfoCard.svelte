<script lang="ts">
  import MdInfoOutline from "svelte-icons/md/MdInfoOutline.svelte";

  let className = "";
  export { className as class };
</script>

<div class={"alert shadow-md w-fit " + className}>
  <div class="text-info flex-shrink-0 w-6 h-6"><MdInfoOutline /></div>
  <span>
    <slot />
  </span>
</div>
