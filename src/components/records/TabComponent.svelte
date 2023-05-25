<script lang="ts">
    export let responsive = false;
    export let bg = "";
    export let classes = "";

    let showContent = "f-indoor";
</script>

<div>{$$slots["f-indoor"]}</div>

<div class="grid">
    <div class="tabs z-10 -mb-px">
        {#if showContent == "f-indoor"}
        <button
            on:click={() => (showContent = "f-indoor")}
            class={`tab tab-lifted ${
                showContent == "f-indoor"
                    ? "tab-active [--tab-bg:hsl(var(--b2))]"
                    : "[--tab-border-color:transparent]"
            }`}>Vrouwen indoor</button
        >
        {/if}
        <button
            on:click={() => (showContent = "m-indoor")}
            class={`tab tab-lifted ${
                showContent == "m-indoor"
                    ? "tab-active [--tab-bg:hsl(var(--b2))]"
                    : "[--tab-border-color:transparent]"
            }`}>Mannen indoor</button
        >
        <button
            on:click={() => (showContent = "f-outdoor")}
            class={`tab tab-lifted ${
                showContent == "f-outdoor"
                    ? "tab-active [--tab-bg:hsl(var(--b2))]"
                    : "[--tab-border-color:transparent]"
            }`}>Vrouwen outdoor</button
        >
        <button
            on:click={() => (showContent = "m-outdoor")}
            class={`tab tab-lifted ${
                showContent == "m-outdoor"
                    ? "tab-active [--tab-bg:hsl(var(--b2))]"
                    : "[--tab-border-color:transparent]"
            }`}>Mannen outdoor</button
        >
        <div class="tab tab-lifted mr-6 flex-1 cursor-default [--tab-border-color:transparent]" />
    </div>

    <!-- max-w-4xl -->
    <div class="bg-base-300 relative overflow-x-auto {showContent == 'f-indoor' ? 'rounded-b-box rounded-tr-box' : 'rounded-box'}">
        <div
            class="preview border-base-300 bg-base-200 rounded-tr-box flex min-h-[6rem] min-w-[18rem] flex-wrap gap-2 overflow-x-hidden border bg-cover bg-top p-4 
                {classes} {showContent == 'f-indoor' ? 'rounded-b-box rounded-tr-box' : 'rounded-box'}
            "
            style={bg ? `background-image: url(${bg})` : `background-size: 5px 5px`}
            class:resize-x={responsive}
        >
            {#if showContent == "f-indoor"}
                <slot name="f-indoor" />
            {:else if showContent == "m-indoor"}
                <slot name="m-indoor" />
            {:else if showContent == "f-outdoor"}
                <slot name="f-outdoor" />
            {:else if showContent == "m-outdoor"}
                <slot name="m-outdoor" />
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
