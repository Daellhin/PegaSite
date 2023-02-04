<script lang="ts">
  import { combinedLinksFromJson, Link, LinkGroup } from "$lib/link";
  import { LINKS_JSON } from "../../data/linksJson";

  const links = combinedLinksFromJson(LINKS_JSON);

  function createHorizontalListGroupOrItem(link: Link | LinkGroup) {
    if (link instanceof LinkGroup) {
      return /* html */ `
          <li tabindex="0" class="z-10">
            <span>${link.name}</span>
            <ul class="rounded-box bg-base-100 p-2 shadow-2xl">
              ${link.links.map(createHorizontalListItem).join("")}
            </ul>
          </li>
        `;
    } else {
      return createHorizontalListItem(link);
    }
  }
  function createHorizontalListItem(link: Link) {
    return /* html */ `<li class=""><a href="${link.url}">${link.name}</a></li>`;
  }
</script>

<ul class="menu menu-horizontal rounded-box p-2 bg-base-200">
  {@html links.map(createHorizontalListGroupOrItem).join("")}
</ul>
