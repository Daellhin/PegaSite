<script lang="ts">
  export let name: string
  export let classNames = ""
  export { classNames as class }
</script>

<th class={"max-w-xs break-words " + classNames}>
  <div class="flex w-full gap-2.5">
    {name}
  </div>
</th>
