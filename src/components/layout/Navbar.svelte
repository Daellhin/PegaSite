<script lang="ts">
  import LoginModal from "$components/LoginModal.svelte"
  import UserAvatar from "$components/ProfileDropdown.svelte"
  import PegaIconWithText from "$components/icons/PegaIconWithText.svelte"
  import MenuHorizontal from "$components/layout/MenuHorizontal.svelte"
  import { faBars } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let drawerID: string
  export let loginModalID: string
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
        <Fa icon={faBars} class="text-xl" />
      </label>
    </div>
    <!-- Always shown -->
    <div class="flex-none">
      <UserAvatar />
    </div>
  </div>
</div>

<LoginModal {loginModalID} />
