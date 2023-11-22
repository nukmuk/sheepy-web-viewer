import ByteBufferClass from "./ByteBufferClass.tsx";

export type AnimationParticle =
    [x: number, y: number, z: number, b: number, g: number, r: number, pscale: number];

async function getFrames(file: File) {

    const length = file.size;

    // console.log("length: ", length);
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const result = await file.stream().getReader({mode: "byob"}).read(view);
    const bb = new ByteBufferClass(result);
    if (bb === null) return console.log("invalid file");

    // console.log("bb:", bb)

    const frames: AnimationParticle[][] = [];

// read all frames
    while (bb.offset < length) {
        // console.log("offset:", bb.offset)

        const frameLength = bb.readUint16();
        if (frameLength === null) return;


        // read particles for single frame
        const frame: AnimationParticle[] = [];
        for (let i = 0; i < frameLength; i++) {
            const x = bb.readFloat16();
            const y = bb.readFloat16();
            const z = bb.readFloat16();
            const blue = bb.readUint8();
            const green = bb.readUint8();
            const red = bb.readUint8();
            const pscale = bb.readUint8();
            frame.push([x, y, z, blue, green, red, pscale]);
        }
        // console.log("flength: ", frameLength);
        frames.push(frame);
    }
    return frames;
}

export {getFrames};