"use client"

import {Canvas} from "@react-three/fiber";
import {DragEvent, useEffect, useState} from "react";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {AnimationParticle, getFrames} from "./FileLoader.tsx";
import {Perf} from "r3f-perf";
import {Slider} from "@/components/ui/slider.tsx";
import {Button} from "@/components/ui/button.tsx";

import {Pause, Play} from "lucide-react";

export default function Viewport() {
    // const [currentFrame, setCurrentFrame] = useState<AnimationParticle[]>([]);
    const [frame, setFrame] = useState<number>(0);
    const [frames, setFrames] = useState<AnimationParticle[][]>([]);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (!playing) return;
        const interval = setInterval(() => {
            console.log("interval");
            setFrame(prevState => {
                const n = prevState + 1;
                if (n >= frames.length) {
                    setPlaying(false);
                    return 0;
                }
                return n;
            })
        }, 1000 / 20);

        return () => clearInterval(interval);
    }, [frames.length, playing]);

    async function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const tempframes = await getFrames(file);
        // console.log("tempframes:", tempframes);
        setFrames(tempframes);
        setFrame(0);
        // setPlaying(false);
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        return e.preventDefault();
    }

    function Particles() {
        if (frames.length === 0) return;
        if (frame === null) return

        const currFrame = frames[frame];

        const positions = new Float32Array(currFrame.length * 3);
        const colors = new Float32Array(currFrame.length * 3);
        const sizes = new Float32Array(currFrame.length);

        for (let i = 0; i < currFrame.length; i++) {
            // const [x, y, z, b, g, r, s] = currFrame[i];
            positions.set([currFrame[i][0], currFrame[i][1], currFrame[i][2]], i * 3);
            colors.set([currFrame[i][5], currFrame[i][4], currFrame[i][3]], i * 3);
            sizes.set([currFrame[i][6] * 20], i);
        }
        // test.set([4,5,6], 1);

        // console.log("test:", positions);

        return <>
            <points>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach={"attributes-position"}
                        array={positions}
                        count={positions.length / 3}
                        itemSize={3}/>
                    <bufferAttribute
                        attach={"attributes-color"}
                        array={colors}
                        count={colors.length / 3}
                        itemSize={3}/>
                    <bufferAttribute
                        attach={"size"}
                        array={sizes}
                        count={sizes.length}
                        itemSize={1}/>
                </bufferGeometry>
                <pointsMaterial
                    attach={"material"}
                    vertexColors={true}
                    size={0.1}
                    sizeAttenuation
                    transparent={false}
                    alphaTest={0.5}
                    opacity={1.0}
                />
            </points>
        </>

    }

    function handlePlayClick() {
        setPlaying(prevState => !prevState);
    }

    return (
        <>
            <div
                className="flex flex-col justify-start p-4 pb-16 absolute w-screen h-screen text-foreground pointer-events-none gap-8 select-none">
                <div className="mb-auto">
                    {/*<button onClick={handlePlayClick} className={`text-5xl + {playing ? "text-green-500" : text-yellow-500}`}>{playing ? "Pause" : "Play"}</button>*/}
                    <p>Loaded {frames.length} frames</p>
                    <p>Frame: {frame}</p>
                    {/*<p>Playing: {playing.toString()}</p>*/}
                </div>
                <div className="flex justify-start gap-4">
                    <Button onClick={handlePlayClick} variant="secondary" size="icon" className="w-12 h-12 pointer-events-auto"
                        //     className={`text-5xl pointer-events-auto ${(playing ? "text-yellow-500" : "text-green-500")}`}>
                        // {playing ? "Pause" : "Play"}
                    >
                        {playing ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8"/>}
                    </Button>
                    <Slider value={[frame]} className="cursor-pointer pointer-events-auto" min={0} max={frames.length - 1} step={1} onValueChange={v => setFrame(v[0])}/>
                </div>
            </div>
            <div className={"absolute inset-0 bg-background -z-10"} onDrop={handleDrop} onDragOver={handleDragOver}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[5, 5, 5]}/>
                    <OrbitControls rotateSpeed={.2} panSpeed={.5}/>
                    <Particles/>
                    <ambientLight/>
                    <gridHelper/>
                    <Perf/>
                </Canvas>
            </div>
        </>
    )
}
