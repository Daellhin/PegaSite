<script lang="ts">
  import { combinedLinksFromJson, Link, LinkGroup } from "$lib/domain/Link";
  import { LINKS_JSON } from "../../data/LinksJson";

  const links = combinedLinksFromJson(LINKS_JSON);

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
</ul>
