<script lang="ts">
  import {
    AutocompleteResponse,
    type AutocompleteResponseWrapperJson,
  } from "$lib/domain/geoapify/AutocompleteResponse";
  import { debounce } from "ts-debounce";
  import FormControlSearchInput from "../FormControlSearchInput.svelte";

  const apiKey = import.meta.env.VITE_GEOAPIFY_APIKEY;
  const minAddressLength = 3;

  export let label: string;
  export let value: string;
  export let required = false;
  export let size: "md" | "sm" | "xs" = "md";

  export let placeholder = "Zoek een locatie";
  export let disabled = false;
  export let limit = 5;
  export let lang = "nl";
  export let debounceTime = 500;

  let results = Array<AutocompleteResponse>();

  async function fetchData() {
    const encodedValue = encodeURIComponent(value);
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodedValue}&apiKey=${apiKey}&lang=${lang}&limit=${limit}&format=json`;

    const response = await fetch(url);
    if (response.ok) {
      const jsonResponse =
        (await response.json()) as AutocompleteResponseWrapperJson;
      const fetchResults = jsonResponse.results.map(
        AutocompleteResponse.fromJson
      );
      results = fetchResults;
    } else {
      const jsonResponse = await response.json();
      console.error(jsonResponse);
    }
  }

  async function validateAndFetch() {
    if (value.length > minAddressLength) await fetchData();
    else results = [];
  }

  function handleDropdownSelect(
    result: AutocompleteResponse,
    event: MouseEvent
  ) {
    value = result.formatted;
    (event.target as HTMLElement).blur();
  }

  const onInput = debounce(validateAndFetch, debounceTime);
</script>

<div
  class="dropdown w-full"
  class:max-w-md={size === "md"}
  class:max-w-sm={size === "sm"}
  class:max-w-xs={size === "xs"}
>
  <FormControlSearchInput
    {label}
    bind:value
    {onInput}
    {required}
    {size}
    {placeholder}
    {disabled}
  />
  <ul
    tabindex="0"
    class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full"
    class:hidden={results.length === 0}
  >
    {#each results as result}
      <li>
        <button type="button" on:click={(e) => handleDropdownSelect(result, e)}>
          {result.formatted}
        </button>
      </li>
    {/each}
  </ul>
</div>
