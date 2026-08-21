export type MemoryRecord = { id:string; namespace:string; key:string; value:unknown; createdAt:string; updatedAt:string };
const memory = new Map<string, MemoryRecord>();
export function memoryKey(namespace:string,key:string){return `${namespace}:${key}`}
export function writeMemory(namespace:string,key:string,value:unknown){const id=memoryKey(namespace,key),now=new Date().toISOString();const current=memory.get(id);const record={id,namespace,key,value,createdAt:current?.createdAt??now,updatedAt:now};memory.set(id,record);return record;}
export function readMemory(namespace:string,key:string){return memory.get(memoryKey(namespace,key))??null;}
export function clearMemory(namespace?:string){if(!namespace){memory.clear();return;}for(const [id,record] of memory)if(record.namespace===namespace)memory.delete(id);}
