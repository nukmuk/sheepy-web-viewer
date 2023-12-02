type ButtonProps = {
    text: string;
    handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function PlayButton(props: ButtonProps) {
    return (
        <>
            <button onClick={props.handleClick} className={"text-5xl text-green-500"}>
                {props.text}
            </button>
        </>
    );
}
