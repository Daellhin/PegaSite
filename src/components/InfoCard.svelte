<script lang="ts">
  import MdInfoOutline from "svelte-icons/md/MdInfoOutline.svelte";
</script>

<div class="alert shadow-md w-fit">
  <div class="text-info flex-shrink-0 w-6 h-6"><MdInfoOutline /></div>
  <span>
    <slot />
  </span>
</div>
