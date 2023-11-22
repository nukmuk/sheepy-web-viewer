import {Canvas} from "@react-three/fiber";
import {DragEvent, useState} from "react";
import {OrbitControls, PerspectiveCamera, Sphere} from "@react-three/drei";
import {AnimationParticle, getFrames} from "./FileLoader.tsx";


export default function Viewport() {
    const [currentFrame, setCurrentFrame] = useState<AnimationParticle[]>([]);

    async function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const frames = await getFrames(file);

        if (frames.length === 0) return setCurrentFrame([]);
        let counter = 0;
        const play = setInterval(() => {
            setCurrentFrame(frames[counter]);
            counter++;

            if(counter >= frames.length - 1) clearInterval(play);
        }, 1000 / 20);
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        return e.preventDefault();
    }

    function Particles() {
        return currentFrame.map(particle => {
            const [x, y, z, b, g, r, s] = particle;
            return <Sphere scale={s / 255 / 4} position={[x, y, z]}>
                <meshStandardMaterial color={[r / 255, g / 255, b / 255]}/>
            </Sphere>;
        })
    }


    return (
        <div className={"absolute inset-0 bg-neutral-950"} onDrop={handleDrop} onDragOver={handleDragOver}>
            <Canvas className={""}>
                <PerspectiveCamera makeDefault position={[5, 5, 5]}/>
                <OrbitControls rotateSpeed={.2} panSpeed={.5}/>
                {/*return <Circle position={[currentFrame[0], currentFrame[1], currentFrame[2]]}/>*/}

                <Particles/>
                <ambientLight/>
                <gridHelper/>
            </Canvas>
        </div>
    )
}
