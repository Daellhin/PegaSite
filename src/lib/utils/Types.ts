/*** 
 * Using wrapper interface tot fix problem with svelte-dnd-action.
 * Dndzone removes class methods when elements are dragged
 * */
export interface DragableItem<T> {
	id: string
	value: T
}