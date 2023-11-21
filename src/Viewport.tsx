import {Canvas} from "@react-three/fiber";
import {DragEvent} from "react";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {getFrames} from "./FileLoader.tsx";
import Box from "./TestBox.tsx";


async function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const frames = await getFrames(file);

    if (!frames) return;
    frames.forEach(frame => {

    })
}

function handleDragOver(e: DragEvent<HTMLDivElement>) {
    return e.preventDefault();
}

export default function Viewport() {


    return (
        <div className={"absolute inset-0 bg-neutral-950"} onDrop={handleDrop} onDragOver={handleDragOver}>
            <Canvas className={""}>
                <PerspectiveCamera makeDefault position={[5, 5, 5]}/>
                <OrbitControls rotateSpeed={.2} panSpeed={.5}/>
                <Box/>
                <ambientLight/>
                <gridHelper/>
            </Canvas>
        </div>
    )
}
