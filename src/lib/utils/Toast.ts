import { toast } from "@zerodevx/svelte-toast"
import CreatedToast from "$components/CreatedToast.svelte"

export function pushCreatedToast(createdText: string, gotoUrl?: string) {
    toast.push({
        component: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            src: CreatedToast as any,
            props: {
                createdText: createdText,
                gotoUrl: gotoUrl,
            },
            sendIdTo: "toastId",
        },
        dismissable: false,
        initial: 0,
    })
}