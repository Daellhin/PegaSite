<script lang="ts">
  export let style =
    "height:1em;vertical-align:-.125em;transform-origin:center;overflow:visible"
  let classNames = ""
  export { classNames as class }
</script>

<svg
  class={classNames}
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 16 10"
  {style}
>
  <path
    d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z"
  />
</svg>
