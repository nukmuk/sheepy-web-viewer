"use client"

import {Canvas} from "@react-three/fiber";
import {DragEvent, useEffect, useRef, useState} from "react";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {AnimationParticle, getFrames} from "./FileLoader.tsx";
import {Perf} from "r3f-perf";
import {Slider} from "@/components/ui/slider.tsx";
import {Button} from "@/components/ui/button.tsx";

import {Pause, Play, Upload} from "lucide-react";
import {TextureLoader, NearestFilter} from "three";

const redstone = new TextureLoader().load("/assets/generic_7.png");
redstone.minFilter = NearestFilter;
redstone.magFilter = NearestFilter;

export default function Viewport() {
    // const [currentFrame, setCurrentFrame] = useState<AnimationParticle[]>([]);
    const [frame, setFrame] = useState<number>(0);
    const [frames, setFrames] = useState<AnimationParticle[][]>([]);
    const [playing, setPlaying] = useState(false);
    const [draggingFile, setDraggingFile] = useState<boolean>(false);
    const pointsMaterialRef = useRef(null);


    useEffect(() => {
        if (!playing) return;
        const interval = setInterval(() => {
            // console.log("interval");
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
        setFrames(tempframes);
        setFrame(0);
        setPlaying(true);
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDraggingFile(true);
    }

    function handleDragEnd() {
        setDraggingFile(false);
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
                    ref={pointsMaterialRef}
                    attach={"material"}
                    vertexColors={true}
                    size={0.2}
                    sizeAttenuation
                    transparent={false}
                    alphaTest={0.5}
                    opacity={1.0}
                    map={redstone}
                />
            </points>
        </>

    }

    function handlePlayClick() {
        setPlaying(prevState => !prevState);
    }

    async function loadExample(fileName: string) {
        const response = await fetch(`assets/${fileName}`);
        const blob = await response.blob();
        const file = new File([blob], fileName);
        // const tempFrames = await getFrames(file);
        setFrames(await getFrames(file));
        setFrame(0);
        setPlaying(true);
    }

    return (
        <>

            <div className={"absolute inset-0 h-screen w-screen bg-transparent"}>
                <Canvas onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragEnd}>
                    <PerspectiveCamera makeDefault position={[5, 5, 5]}/>
                    <OrbitControls rotateSpeed={.2} panSpeed={.5}/>
                    <Particles/>
                    <ambientLight/>
                    <gridHelper/>
                    <Perf minimal="true"/>
                </Canvas>
            </div>

            {frames.length == 0 ?
                <div
                    className={`flex h-screen w-screen absolute items-center justify-center select-none pointer-events-none`}>
                    <div
                        className={`flex flex-col items-center justify-center h-min border border-neutral-800 p-6 py-4 rounded-xl gap-2 backdrop-blur-sm ${draggingFile ? "text-neutral-400 bg-neutral-50 bg-opacity-5" : "text-neutral-500"}`}>
                        <Upload/>
                        <p>Drag and drop Shiny (.shny) file</p>
                        <div className="pointer-events-auto">
                            <Button variant="link" className="p-0 h-min"
                                    onClick={() => loadExample("len3.shny")}>or</Button>
                            {" "}
                            <Button variant="link" className="p-0 h-min"
                                    onClick={() => loadExample("req.shny")}>try</Button>
                            {" "}
                            <Button variant="link" className="p-0 h-min"
                                    onClick={() => loadExample("sheepy2.shny")}>example</Button>
                        </div>
                    </div>
                </div> : null}

            <div
                className="flex flex-col justify-start p-8 absolute w-screen h-screen text-foreground pointer-events-none gap-8 select-none">
                <div className="mb-auto">
                    {/*<button onClick={handlePlayClick} className={`text-5xl + {playing ? "text-green-500" : text-yellow-500}`}>{playing ? "Pause" : "Play"}</button>*/}
                    <p>Loaded {frames.length} frames</p>
                    <p>Frame: {frame}</p>
                    {/*<p>Playing: {playing.toString()}</p>*/}
                </div>
                <div className="flex justify-start gap-8">
                    <Button onClick={handlePlayClick} variant="secondary" size="icon"
                            className="w-12 h-12 pointer-events-auto"
                        //     className={`text-5xl pointer-events-auto ${(playing ? "text-yellow-500" : "text-green-500")}`}>
                        // {playing ? "Pause" : "Play"}
                    >
                        {playing ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8"/>}
                    </Button>
                    <Slider value={[frame]} className="cursor-pointer pointer-events-auto" min={0}
                            max={Math.max(frames.length - 1, 0)} step={1} onValueChange={v => setFrame(v[0])}/>
                </div>
            </div>


        </>
    )
}
