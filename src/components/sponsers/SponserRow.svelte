<script lang="ts">
  import type { DbUser } from "$lib/domain/DbUser";
  import { userStore } from "$lib/stores/UserStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import { faPen } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let index: number;
  //export let user: DbUser;
</script>

<tr class="hover:bg-base-300 border-b border-base-200">
  <th>{index + 1}</th>
  <td>{"Sponsernaam"}</td>
  <td>{"Sponser link"}</td>
  <td>
    <img class="rounded-lg h-20" src="https://images.unsplash.com/photo-1467541473380-93479a5a3ffa?ixid=M3wxMTI1OHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4OTc2MTA4Mnw" alt="">
  </td>
  <td>
    <button class="btn btn-circle btn-ghost" title="edit" type="button">
      <Fa icon={faPen} class="text-xl" />
    </button>
  </td>
</tr>
