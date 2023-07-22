<script lang="ts">
  import type { Sponser } from "$lib/domain/Sponser";
  import { faPen } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let index: number;
  export let sponser: Sponser;
</script>

<tr class="hover:bg-base-300 border-b border-base-200">
  <th>{index + 1}</th>
  <td>{sponser.name}</td>
  <td><a href={sponser.url} class="link">{sponser.url}</a></td>
  <td>
    <img src={sponser.imageUrl} alt="Logo" class="rounded-lg h-20" />
  </td>
  <td>
    <button class="btn btn-circle btn-ghost" title="edit" type="button">
      <Fa icon={faPen} class="text-xl" />
    </button>
  </td>
</tr>
