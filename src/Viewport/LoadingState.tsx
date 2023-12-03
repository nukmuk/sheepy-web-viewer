import { Progress } from "@/components/ui/progress.tsx";

export type LoadingStateProps = {
    text: string;
    progress?: number;
};

export default function LoadingState(props: LoadingStateProps): JSX.Element {
    return (
        <>
            <div className="flex flex-col gap-2 min-w-[15%] items-center">
                <p>{props.text}</p>
                <Progress
                    value={props.progress && props.progress * 100}
                    className={`${!props.progress && "invisible"}`}
                    max={0.1}
                />
            </div>
        </>
    );
}
