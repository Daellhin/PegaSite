export function emailValidator(value: string) {
    const pattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g
    if (!value.match(pattern)) return "Email moet geldig zijn"
    return undefined
}
