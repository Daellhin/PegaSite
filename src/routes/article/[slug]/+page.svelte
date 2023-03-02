<script lang="ts">
  import type { Article as ArticleType } from "$lib/article";
  import Article from "../../../components/Article/Article.svelte";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { PageData } from "./$types";

  export let data: PageData;
  const articles: Writable<ArticleType[]> = getContext("articleStore");
</script>

<Article articler={$articles[data.id]} />
