<script lang="ts">
  import DndHandle from "$components/DNDHandle.svelte"
    import { FLIP_DURATION } from "$lib/utils/Constants"
  import { dndzone, type DndEvent } from "svelte-dnd-action"
  import { flip } from "svelte/animate"

  let dragDisabled = true

  interface ListItem {
    id: number
    title: string
    description: string
    tags: string[]
  }

  let items: ListItem[] = [
    {
      id: 1,
      title: "Blog post 1",
      description: "Blog post 1 description :)",
      tags: ["Cooper Codes"],
    },
    {
      id: 2,
      title: "Blog post 2",
      description: "Blog post 2 description :)",
      tags: ["Development", "Coding"],
    },
    {
      id: 3,
      title: "Blog post 3",
      description: "Make sure to subscribe and like the video.",
      tags: ["Subscribe"],
    },
  ]

  function handleConsider(event: CustomEvent<DndEvent<ListItem>>) {
    items = event.detail.items
    dragDisabled = true
  }
  function handleFinalize(event: CustomEvent<DndEvent<ListItem>>) {
    items = event.detail.items
    dragDisabled = true
  }
</script>

{items.map(e=>e.id)}
<div class="container h-full mx-auto flex justify-center items-center">
  <section
    use:dndzone={{
      items: items,
      dragDisabled: dragDisabled,
      flipDurationMs: FLIP_DURATION,
      dropTargetStyle: {},
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
  >
    {#each items as item (item.id)}
      <div
        class="card card-hover w-96 my-4"
        animate:flip={{ duration: FLIP_DURATION }}
      >
        <header class="card-header bg-slate-200 rounded-md">
          <div class="card-body flex flex-row gap-4">
            <DndHandle bind:dragDisabled />
            <div>
              <h4 class="card-title">{item.title}</h4>
              {item.description}
              <footer class="card-footer inline-block">
                {#each item.tags as tag}
                  <span class="chip variant-filled-secondary">{tag}</span>
                {/each}
              </footer>
            </div>
          </div>
        </header>
      </div>
    {/each}
  </section>
</div>
