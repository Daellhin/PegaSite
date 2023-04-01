<script lang="ts">
  import { CalendarEvent } from "$lib/domain/CalendarEvent";
  import { calendarEventStore } from "$lib/stores/CalendarEventStore";
  import { toast } from "@zerodevx/svelte-toast";
  import Editor from "cl-editor";
  import dayjs from "dayjs";
  import CreatedToast from "$components/CreatedToast.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import { goto } from "$app/navigation";
  import FormControlDate from "$components/FormHelpers/FormControlDate.svelte";
  import FormControlText from "$components/FormHelpers/FormControlText.svelte";

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
  <FormControlText
    label="Titel van event:"
    placeholder="Titel"
    value={title}
    required
  />

  <FormControlDate value={date} label="Datum van event:" />

  <FormControlText
    label="Duur van event:"
    placeholder="00:00 - 00:00"
    value={duration}
    required
  />

  <FormControlText
    label="Locatie van event:"
    placeholder="Blauwenhoek 76, 1840 Londerzeel"
    value={location}
    required
  />

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
