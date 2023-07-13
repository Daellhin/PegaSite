<script lang="ts">
  import type { DbUser } from "$lib/domain/DbUser";

  export let index: number;
  export let user: DbUser;
</script>

<tr class="hover:bg-base-300 border-b border-base-200">
  <th>{index + 1}</th>
  <td>{user.displayName}</td>
  <td>{user.email}</td>
  <td class="capitalize">{user.role}</td>
  <td>{user.creationTimestamp.format("DD/MM/YYYY")}</td>
</tr>
