import {getFloat16} from "@petamoriken/float16";

export type AnimationParticle =
    [x: number, y: number, z: number, b: number, g: number, r: number, pscale: number];

async function getFrames(file: File): Promise<AnimationParticle[][]> {

    // console.log("length:", length);
    const reader = file.stream().getReader()

    const buffer = new Uint8Array(file.size);
    const view = new DataView(buffer.buffer);

    let readOffset = 0;

    async function readData() {
        const {done, value} = await reader.read();

        if (done) {
            console.log("read complete");
            reader.releaseLock();
            return;
        }

        // console.log("read data:", value);
        buffer.set(value, readOffset);
        readOffset += value.byteLength;

        await readData();
    }

    await readData();

    console.log("done data:", buffer);

    const value = view;
    if (value === undefined) {
        console.log("invalid file");
        return [];
    }

    // console.log("bb:", view);

    const frames = [];
    let offset = 0;

    console.log("value.byteLength", value.byteLength);
    console.log("file.size", file.size);

    try {


        // read all frames
        while (offset < value.byteLength) {
            // console.log("offset:", offset, "length:", length, "bytelength:", value.byteLength, "byteoffset:", value.byteOffset);

            const frameLength = value.getUint16(offset, true);
            offset += 2;


            // read particles for single frame
            const frame: AnimationParticle[] = [];
            for (let i = 0; i < frameLength; i++) {
                const x = getFloat16(value, offset, true);
                offset += 2;
                const y = getFloat16(value, offset, true);
                offset += 2;
                const z = getFloat16(value, offset, true);
                offset += 2;
                const b = value.getUint8(offset) / 255;
                offset += 1;
                const g = value.getUint8(offset) / 255;
                offset += 1;
                const r = value.getUint8(offset) / 255;
                offset += 1;
                const s = value.getUint8(offset) / 255 / 4;
                offset += 1;
                if (x === null || y === null || z === null || b === null || g === null || r === null || s === null) return frames;
                frame.push([x, y, z, b, g, r, s]);
            }
            // console.log("flength:", frameLength);
            frames.push(frame);
        }

    } catch (e) {
        console.error("failed to read file:", e)
        return frames;
    }


    // console.log("frames:", frames);

    return frames;

}

export {getFrames};