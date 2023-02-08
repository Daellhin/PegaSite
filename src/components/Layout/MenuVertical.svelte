<script lang="ts">
  import FaSignInAlt from "svelte-icons/fa/FaSignInAlt.svelte";
  import { combinedLinksFromJson, Link, LinkGroup } from "$lib/link";
  import { LINKS_JSON } from "../../data/linksJson";

  export let loginModalID: string;

  const links = combinedLinksFromJson(LINKS_JSON);

  // -- Vertical --
  function createVerticalListGroupOrItem(link: Link | LinkGroup) {
    if (link instanceof LinkGroup) {
      return /* html */ `
        <li class="menu-title text-base">
          <span>${link.name}</span>
        </li>
        <div class="font-bold ml-4 pl-2 border-l-2">
          ${link.links.map(createVerticalListItem).join("")}
        </div>
      `;
    } else {
      return createVerticalListItem(link);
    }
  }
  function createVerticalListItem(link: Link) {
    return /* html */ `<li class="font-bold"><a href="${link.url}">${link.name}</a></li>`;
  }
</script>

<ul class="menu p-4 w-80 bg-base-100">
  {@html links.map(createVerticalListGroupOrItem).join("")}
  <li class="font-bold">
    <label for={loginModalID}>
      <div class="w-5 h-5"><FaSignInAlt /></div>
      Inloggen
    </label>
  </li>
</ul>
