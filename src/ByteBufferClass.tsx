import {getFloat16} from "@petamoriken/float16";

export default class ByteBufferClass {
    private result: ReadableStreamReadResult<DataView>
    offset: number;

    constructor(result: ReadableStreamReadResult<DataView>) {
        this.result = result;
        this.offset = 0;
    }

    readFloat16(): number | null {
        if (this.result.value) {
            const value = getFloat16(this.result.value, this.offset, true);
            console.log("fp16: ", value, "offset: ", this.offset);
            this.offset += 2;
            return value;
        }
        return null;
    }

    readUint16(): number | null {
        if (this.result.value) {
            const value = this.result.value.getUint16(this.offset, true);
            console.log("uint16: ", value, "offset: ", this.offset);
            this.offset += 2;
            return value;
        }
        return null;
    }

    readUint8(): number | null {
        if (this.result.value) {
            const value = this.result.value.getUint8(this.offset);
            console.log("uint8: ", value, "offset: ", this.offset);
            this.offset += 1;
            return value;
        }
        return null;
    }

}