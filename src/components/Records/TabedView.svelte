<script lang="ts">
    export let tabs: string[] = [];
    export let bg = "";

    let showContent = 0;

    // this component is limited by the inability of svelte to not use dynamic named slots
    // thus the max amount of tabs is 4 (add more if needed)
</script>

<div class="grid">
    <div class="tabs z-10 -mb-px">
        {#each tabs as tab, index}
            <button
                on:click={() => (showContent = index)}
                class={`tab tab-lifted ${
                    showContent == index
                        ? "tab-active [--tab-bg:hsl(var(--b2))]"
                        : "[--tab-border-color:transparent]"
                }`}>{tab}</button
            >
        {/each}
        <div class="tab tab-lifted mr-6 flex-1 cursor-default [--tab-border-color:transparent]" />
    </div>

    <!-- max-w-4xl -->
    <div
        class="bg-base-300 relative overflow-x-auto {showContent == 0
            ? 'rounded-b-box rounded-tr-box'
            : 'rounded-box'}"
    >
        <div
            class="preview border-base-300 bg-base-200 rounded-tr-box flex min-h-[6rem] min-w-[18rem] flex-wrap gap-2 overflow-x-hidden border bg-cover bg-top p-4 
                 {showContent == 0 ? 'rounded-b-box rounded-tr-box' : 'rounded-box'}
            "
            style={bg ? `background-image: url(${bg})` : `background-size: 5px 5px`}
        >
            {#if showContent == 0}
                <slot name="0" />
            {:else if showContent == 1}
                <slot name="1" />
            {:else if showContent == 2}
                <slot name="2" />
            {:else if showContent == 3}
                <slot name="3" />
            {/if}
        </div>
    </div>
</div>

<style global lang="postcss">
    .prose .component-preview pre[class*="language-"] {
        width: 100%;
        max-width: 100%;
        font-size: 14px;
        padding-right: 2.5rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-top-right-radius: 0.75rem;
        border-top-left-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
        border-bottom-left-radius: 0.75rem;
        margin: 0;
        min-height: 6rem;
    }
    .prose .component-preview pre[class*="language-"] .token.comment {
        color: hsla(var(--nc) / 0.4);
    }
    .prose .component-preview .preview {
        background-image: radial-gradient(hsla(var(--bc) / 0.2) 0.5px, hsla(var(--b2) / 1) 0.5px);
    }
</style>
