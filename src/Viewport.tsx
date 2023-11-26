import {Canvas} from "@react-three/fiber";
import {DragEvent, useState} from "react";
import {Instance, Instances, OrbitControls, PerspectiveCamera, PointsBuffer} from "@react-three/drei";
import {AnimationParticle, getFrames} from "./FileLoader.tsx";
import PlayButton from "./PlayButton.tsx";
import {Perf} from "r3f-perf";

export default function Viewport() {
    // const [currentFrame, setCurrentFrame] = useState<AnimationParticle[]>([]);
    const [frame, setFrame] = useState<number>(0);
    const [frames, setFrames] = useState<AnimationParticle[][]>([]);

    async function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const tempframes = await getFrames(file);
        // console.log("tempframes:", tempframes);
        setFrames(tempframes);


    }

    function play() {
        console.log("total frames:", frames.length);
        console.log("frames:", frames);

        const play = setInterval(() => {

            setFrame(prevState => {
                const n = prevState + 1;
                if (n >= frames.length) {
                    clearInterval(play);
                    console.log("stopping play");
                    return 0;
                }
                // console.log("n:", n);
                return n;
            });

        }, 1000 / 20);
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        return e.preventDefault();
    }

    // const instances: JSX.Element[] = [];
    //
    // useEffect(() => {
    //     console.log("FIRST TIME CREATION");
    //     instances.length = 0;
    //     for (let i = 0; i < 100; i++) {
    //         instances.push(<Instance position={[i,0,0]} color={[0,0,0]} scale={1} key={i}/>);
    //     }
    // }, []);

    function Particles() {
        if (frames.length === 0) return;
        if (frame === null) return

        const currFrame = frames[frame];

        const positions = new Float32Array(currFrame.length * 3);
        const colors = new Float32Array(currFrame.length * 3);

        for (let i = 0; i < currFrame.length; i++) {
            positions.set([currFrame[i][0], currFrame[i][1], currFrame[i][2], ], i*3);
        }
        // test.set([4,5,6], 1);

        console.log("test:", positions);

        return <points>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach={"attributes-position"}
                    array={positions}
                    count={positions.length / 3}
                    itemSize={3}/>
            </bufferGeometry>
            <pointsMaterial
                attach={"material"}
                color={0x00aaff}
                size={0.5}
                sizeAttenuation
                transparent={false}
                alphaTest={0.5}
                opacity={1.0}
            />
        </points>

        // return <Instances limit={16384}>
        //     <boxGeometry/>
        //     <meshStandardMaterial/>
        //     {frames[frame].map((p, index) => {
        //             const [x, y, z, b, g, r, s] = p;
        //
        //             // if (index % 100 != 0) return;
        //             return <Instance key={index} position={[x, y, z]} color={[r, g, b]} scale={s}/>;
        //
        //         }
        //     )};
        // </Instances>
    }


    return (
        <>
            <div className={"z-10 absolute text-white"}>
                <PlayButton handleClick={play}/>
                <p>Loaded {frames.length} frames</p>
                <p>Frame: {frame}</p>
            </div>
            <div className={"absolute inset-0 bg-neutral-950"} onDrop={handleDrop} onDragOver={handleDragOver}>
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
