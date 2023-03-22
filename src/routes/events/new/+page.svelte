<script lang="ts">
  import { CalendarEvent } from "$lib/domain/CalendarEvent";
  import { calendarEventStore } from "$lib/stores/CalendarEventStore";
  import { toast } from "@zerodevx/svelte-toast";
  import Editor from "cl-editor";
  import dayjs from "dayjs";
  import CreatedToast from "$components/CreatedToast.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import { goto } from "$app/navigation";

  let title = "";
  let info = "";
  let date: Date;
  let duration = "";
  let location = "";

  async function saveEvent() {
    const newCalendarEvent = new CalendarEvent(
      "-1",
      dayjs(date),
      duration,
      location,
      title,
      info
    );
    await calendarEventStore.addCalendarEvent(newCalendarEvent);
    toast.push({
      component: {
        src: CreatedToast,
        props: {
          createdText: "Artikel aangemaakt",
          gotoUrl: `/events#${newCalendarEvent.id}`,
        },
        sendIdTo: "toastId",
      },
      dismissable: false,
      initial: 0,
    });
  }
  
  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
</script>

<h1 class="text-2xl font-bold">Nieuw event</h1>

<form class="flex flex-col gap-2" on:submit={saveEvent}>
  <div class="form-control w-full max-w-sm">
    <label class="label" for="title">
      <span class="label-text">Titel van event:</span>
    </label>
    <input
      id="title"
      type="text"
      placeholder="Titel"
      class="input input-bordered border-2"
      bind:value={title}
    />
  </div>

  <div class="form-control w-full max-w-sm">
    <label class="label" for="date">
      <span class="label-text">Datum van event:</span>
    </label>
    <input
      id="date"
      class="input input-bordered border-2"
      type="date"
      bind:value={date}
    />
  </div>

  <div class="form-control w-full max-w-sm">
    <label class="label" for="duration">
      <span class="label-text">Duur van event:</span>
    </label>
    <input
      id="duration"
      type="text"
      placeholder="00:00 - 00:00"
      class="input input-bordered border-2"
      bind:value={duration}
    />
  </div>

  <div class="form-control w-full max-w-sm">
    <label class="label" for="location">
      <span class="label-text">Locatie van event:</span>
    </label>
    <input
      id="location"
      type="text"
      placeholder="Blauwenhoek 76, 1840 Londerzeel"
      class="input input-bordered border-2"
      bind:value={location}
    />
  </div>

  <div class="form-control">
    <label class="label" for="editor">
      <span class="label-text">Info over event:</span>
    </label>
    <Editor html={info} on:change={(evt) => (info = evt.detail)} />
  </div>

  <button class="btn btn-primary btn-md mt-2 max-w-sm">Event aanmaken</button>
</form>

<style lang="postcss">
  @import "../../../css/cl-editor.postcss";
</style>
