<script lang="ts">
  import { faImage } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"
</script>

<div
  class="card w-80 h-full bg-base-100 shadow-xl transition-all duration-200 hover:-translate-y-1 animate-pulse"
>
  <div
    class="flex items-center justify-center w-full h-48 bg-base-300 rounded-t-lg"
  >
    <Fa icon={faImage} class="w-12 h-12" />
  </div>
  <div class="card-body p-5 gap-0">
    <div class="h-3 bg-base-300 rounded-full w-48 mb-2" />
    <div class="flex items-center w-full space-x-2 mb-3">
      <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
      <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
    </div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
  </div>
</div>
