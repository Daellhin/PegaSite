<script lang="ts">
  //   import FaChevronRight from "svelte-icons/fa/FaChevronRight.svelte";
  import FaChevronDown from "svelte-icons/fa/FaChevronDown.svelte";
</script>

<li><a>Item 1</a></li>
<div class="dropdown">
  <li tabindex="0"><a>Item 1</a></li>
  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
<li><a>Item 3</a></li>
