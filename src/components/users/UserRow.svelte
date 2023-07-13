<script lang="ts">
  import type { DbUser } from "$lib/domain/DbUser";
  import { userStore } from "$lib/stores/UserStore";
  import { pushCreatedToast } from "$lib/utils/Toast";

  export let index: number;
  export let user: DbUser;

  let role = user.role;

  function blurAfterSelected(event: Event) {
    (event.target as HTMLElement).parentElement?.blur();
  }
  async function updateRole() {
    try {
      await userStore.updateUserRole(user.uid, role);
      pushCreatedToast("Rol aangepast", { removeLast: true });
    } catch (error) {
      console.error(error);
    }
  }
</script>

<tr class="hover:bg-base-300 border-b border-base-200">
  <th>{index + 1}</th>
  <td>{user.displayName}</td>
  <td>{user.email}</td>
  <!-- <td class="capitalize">{user.role}</td> -->
  <td class="py-2 px-2">
    <select
      bind:value={role}
      on:change={updateRole}
      class="select select-bordered select-xs h-9"
    >
      <option value="admin" on:click={blurAfterSelected}>Admin</option>
      <option value="editor" on:click={blurAfterSelected}>Editor</option>
    </select>
  </td>
  <td>{user.creationTimestamp.format("DD/MM/YYYY")}</td>
</tr>
