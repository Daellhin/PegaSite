<script lang="ts">
  import EditDropdown from "$components/EditDropdown.svelte";
  import FormControlSavableText from "$components/FormHelpers/FormControlSavableText.svelte";
  import { sleep } from "$lib/utils/Utils";

  let linkTitle: string = "Lid worden";
  $: linkUrl = `/${linkTitle.replace(/ /g, "-").toLowerCase()}`;

  async function saveLinkTitle() {
    await sleep(1000);
  }
</script>

<div class="ml-3 grid grid-cols-3 sm:grid-cols-5 gap-2 items-center">
  <div class="italic">{linkUrl}</div>
  <FormControlSavableText bind:value={linkTitle} placeholder="Titel" save={saveLinkTitle}/>
  <EditDropdown editUrl="/todo" deleteHandler={() => {}} />
</div>
