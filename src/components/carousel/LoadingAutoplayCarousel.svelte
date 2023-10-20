<script lang="ts">
  import { faImage } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let loop = false
</script>

<div class="bg-base-200 rounded-lg p-2 pt-1 animate-pulse">
  <div class="box-content">
    <!-- Loop controls -->
    {#if loop}
      <div class="flex justify-between">
        <hr class="w-full mt-3 border-2 rounded-xl mr-1 border-gray-300 dark:border-gray-600" />
        <div
          class="h-5 my-1 bg-gray-300 rounded-full dark:bg-gray-600 w-36 mb-1 ml-1"
        />
      </div>
    {/if}
    <div
      class="flex items-center justify-center bg-base-300 w-full rounded-lg h-56 sm:h-96 lg:h-44 2xl:h-52"
    >
      <Fa icon={faImage} class="w-12 h-12" />
    </div>
  </div>
  <!-- Sponsor Info -->
  <div class="flex items-center justify-between mt-4 my-1">
    <div class="h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-40" />
    <div class="h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-16" />
  </div>
</div>
