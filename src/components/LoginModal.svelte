<script lang="ts">
  import PegaIcon from "./Icons/PegaIcon.svelte";

  export let loginModalID: string;
</script>

<input type="checkbox" id={loginModalID} class="modal-toggle" />
<label for={loginModalID} class="modal cursor-pointer">
  <label class="modal-box custom-width w-11/12 max-w-2xl" for="">
    <label
      for={loginModalID}
      class="btn btn-sm btn-circle absolute right-2 top-2 btn-ghost">✕</label
    >
    <div class="flex flex-row">
      <div class="w-96 my-auto hidden md:block">
        <PegaIcon />
      </div>
      <div class="w-full">
        <div class="mb-4">
          <h1 class="font-bold text-xl">Inloggen</h1>
          <h2 class="text-sm text-gray-400">Welkom terug</h2>
        </div>
        <div class="mb-5 flex flex-col gap-3 ">
          <input
            type="text"
            placeholder="Gebruikersnaam"
            class="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            class="input input-bordered w-full"
          />
          <button class="btn btn-primary mt-2"> Inloggen </button>
        </div>
        <div class="text-sm text-gray-400 mx-3 text-center">
          Om in te kunnen loggen moet een administrator een account aangemaakt
          hebben
        </div>
      </div>
    </div>
  </label>
</label>
