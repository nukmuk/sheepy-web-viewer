import {getFloat16} from "@petamoriken/float16";

type ByteBuffer = {
    // buffer: ArrayBuffer,
    // view: DataView,
    result: ReadableStreamReadResult<DataView>,
    offset: number,
    readFloat16: () => number,
    readUint8: () => number,
    readUint16: () => number,
    resetOffset: () => void,
} | null

export default function createByteBuffer(result: ReadableStreamReadResult<DataView>): ByteBuffer {
    let offset = 0;
    const view = result.value;
    if (view === undefined) return null;

    return {
        result,
        offset,

        readUint8(): number {
            const value = view.getUint8(offset);
            offset += 1;
            return value;
        },

        readUint16(): number {
            const value = view.getUint16(offset, true);
            offset += 2;
            return value;
        },

        readFloat16(): number {
            const value = getFloat16(view, offset, true);
            offset += 2;
            return value;
        },


        resetOffset(): void {
            offset = 0;
        },
    };
}
