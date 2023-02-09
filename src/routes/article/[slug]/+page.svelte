<script lang="ts">
  import Article from "../../../components/Article/Article.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Article article={data.article} />
