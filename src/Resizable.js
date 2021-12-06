import { useState } from "react"
import { Resizable as ReactResizable } from "react-resizable";

const Resizable = ({
    children,
    onResize,
    fRef,
}) => {
    const [state, setState] = useState(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
    }));

    const handleOnResize = (evt, data) => {
        const { size } = data;
        setState({
            width: size.width,
            height: size.height
        });
        onResize(evt, data);
    }

    return (
        <ReactResizable height={state.height} width={state.width} onResize={handleOnResize}>
            <canvas ref={fRef}>
                Your browser does not support the canvas element.
            </canvas>
        </ReactResizable>
    )
}

export default Resizable;