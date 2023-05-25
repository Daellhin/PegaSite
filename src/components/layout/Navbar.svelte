<script lang="ts">
  import FaBars from "svelte-icons/fa/FaBars.svelte";
  import PegaIconWithText from "../icons/PegaIconWithText.svelte";
  import MenuHorizontal from "./MenuHorizontal.svelte";
  import LoginModal from "../LoginModal.svelte";
  import UserAvatar from "../ProfileAndLoginButton.svelte";

  export let drawerID: string;
  export let loginModalID: string;
</script>

<div class="w-full navbar mt-2 h-10">
  <div class="navbar-start">
    <!-- Always shown -->
    <a class="btn btn-ghost normal-case h-auto" href="/">
      <PegaIconWithText />
    </a>
  </div>
  <div class="navbar-center">
    <!-- Desktop menu center -->
    <div class="flex-none hidden lg:block">
      <MenuHorizontal />
    </div>
  </div>
  <div class="navbar-end">
    <!-- Mobile menu end -->
    <div class="lg:hidden">
      <label for={drawerID} class="btn btn-square btn-ghost">
        <div class="w-5 h-5"><FaBars /></div>
      </label>
    </div>
    <!-- Always shown -->
    <div class="flex-none">
      <UserAvatar />
    </div>
  </div>
</div>

<LoginModal {loginModalID} />
