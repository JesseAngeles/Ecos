export interface Npc {
    name: string,
    mood: number,
    context: string,
    flow: Array<[boolean, string]>
}