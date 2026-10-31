export type ModelId = '38sx' | '38wx' | '40sx'

export interface ModelData {
    id: ModelId
    name: string
    type: string
    tag: string
    color: string
    image: string
}

export const modelData: ModelData[] = [
    { id: '38sx', name: '38SX', type: 'Nagy szériás', tag: 'Standard', color: 'brown', image: '/images/38SX_new.jpeg' },
    { id: '38wx', name: '38WX', type: 'Lazítókéses', tag: 'Hybrid', color: 'green', image: '/images/38WX_new.jpeg' },
    { id: '40sx', name: '40SX', type: 'Mélyásógép', tag: 'Deep', color: 'blue', image: '/images/40SX_new.jpeg' },
]
