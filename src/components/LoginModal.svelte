<script lang="ts">
  import { authStore } from "$lib/stores/AuthStore";
  import { logFirebaseError } from "$lib/utils/Firebase";
  import type { FirebaseError } from "firebase/app";
  import PegaIcon from "./icons/PegaIcon.svelte";

  export let loginModalID: string;

  let username: string;
  let password: string;
  let loginError: string | undefined;

  let showModal = false;

  async function submitLogin() {
    try {
      loginError = undefined;
      await authStore.signIn(username, password);
      showModal = false;
      // TODO only for dev testing
      // username = "";
      // password = ""
    } catch (error) {
      if (error as FirebaseError) {
        const firebaseEror = error as FirebaseError;
        logFirebaseError(firebaseEror);
        if ((firebaseEror.customData as any)?.message.includes("NetworkError"))
          loginError = "Probleem met het netwerk";
        else loginError = "Ongeldige login gegevens";
      } else {
        console.error(error);
        loginError = "Ongekend probleem";
      }
    }
  }
</script>

<input
  type="checkbox"
  id={loginModalID}
  bind:checked={showModal}
  class="modal-toggle"
/>
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
        <form on:submit={submitLogin} class="mb-5 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Gebruikersnaam"
            bind:value={username}
            class="input input-bordered w-full"
            class:input-error={loginError}
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            bind:value={password}
            class="input input-bordered w-full"
            class:input-error={loginError}
          />
          <button class="btn btn-primary mt-2">Inloggen</button>
          {#if loginError}
            <div class="text-center text-error">{loginError}</div>
          {/if}
        </form>
        <div class="text-sm text-gray-400 mx-3 text-center">
          Om in te kunnen loggen moet een administrator een account aangemaakt
          hebben
        </div>
      </div>
    </div>
  </label>
</label>
