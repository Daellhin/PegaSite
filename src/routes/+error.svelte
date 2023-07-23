<script lang="ts">
  import { page } from "$app/stores"
</script>

<div id="error" class="h-full flex items-center">
  <div class="error mx-auto">
    <div class="error-status">
      <h3>{$page.error?.message} Error</h3>
      <h1 class="unselectable">
        {#each $page.status.toString().split("") as letter}
          <span>{letter}</span>
        {/each}
      </h1>
    </div>
    <h2 class="text-gray-600">De gevraagde pagina bevatte een probleem</h2>

    {#if $page.status === 404}
      <a href="/" class="btn btn-primary normal-case">Terug naar de homepagina</a>
    {:else}
      <p style="color: #ff9800; font-size: 1.3em">Probeer het later opnieuw</p>
    {/if}
  </div>
</div>
<!-- This templates was made by Colorlib (https://colorlib.com) -->

<!-- Source: https://colorlib.com/wp/free-404-error-page-templates/ -->
<style lang="postcss">
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: -1;
  }

  .error {
    max-width: 520px;
    width: 100%;
    line-height: 1.4;
    text-align: center;
  }

  .error .error-status {
    position: relative;
    height: 240px;
  }

  .error .error-status h1 {
    font-family: "Montserrat", sans-serif;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 252px;
    font-weight: 900;
    margin: 0px;
    color: #262626;
    text-transform: uppercase;
    letter-spacing: -0.15em;
    margin-left: -20px;
  }

  .error .error-status h1 > span {
    text-shadow: -8px 0px 0px #5c5c5c;
  }

  .error .error-status h3 {
    font-family: "Cabin", sans-serif;
    position: relative;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    color: #262626;
    margin: 0px;
    letter-spacing: 3px;
    padding-left: 6px;
  }

  .error h2 {
    font-family: "Cabin", sans-serif;
    font-size: 20px;
    font-weight: 400;
    color: #000;
    margin-top: 0px;
    margin-bottom: 25px;
  }

  @media only screen and (max-width: 767px) {
    .error .error-status {
      height: 200px;
    }
    .error .error-status h1 {
      font-size: 200px;
    }
  }

  @media only screen and (max-width: 480px) {
    .error .error-status {
      height: 162px;
    }
    .error .error-status h1 {
      font-size: 162px;
      height: 150px;
      line-height: 162px;
    }
    .error h2 {
      font-size: 16px;
    }
  }
</style>
