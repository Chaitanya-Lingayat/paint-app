import React, { useEffect, useRef, useState } from 'react';
import './whiteboard.css';

const COLORS = ['#2f2f2f', '#f05f50', '#2ffa8f', '#5050ff', '#ffff80'];

const WhiteBoard = () => {
    const ref = useRef();
    const drawRef = useRef(false);
    const prevRef = useRef({ prevX: -1, prevY: -1 });
    const [color, setColor] = useState(COLORS[0])
    const [strokeWidth, setStrokeWidth] = useState(12)

    useEffect(() => {
        const canvas = ref.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', onResize)
    }, [])

    const onResize = (evt, data) => {
        console.log({ evt, data })
        const canvas = ref.current;
        // canvas.setWidth(window.innerWidth);
        // canvas.height = window.innerHeight;
    }

    const onMouseMove = ({ clientX, clientY }) => {
        if (drawRef.current) {
            const canvas = ref.current;
            let prevData = prevRef.current;
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            if (prevData.prevX !== -1 && prevData.prevY !== -1) {
                ctx.moveTo(prevData.prevX, prevData.prevY);
            } else {
                ctx.moveTo(clientX, clientY);
            }
            ctx.lineTo(clientX, clientY);
            ctx.stroke();
            prevRef.current = { prevX: clientX, prevY: clientY };
        }
    }

    const onMouseDown = () => {
        drawRef.current = true;
    }

    const onMouseUp = () => {
        drawRef.current = false;
        prevRef.current = { prevX: -1, prevY: -1 };
    }

    return <div className="canvas">
        <canvas ref={ref} onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            Your browser does not support the canvas element.
        </canvas>
        <div className="header">
            <div className="colors">
                {
                    COLORS.map((color) => (
                        <div className="color" style={{ backgroundColor: color }} onClick={() => setColor(color)} />
                    ))
                }
            </div>

        </div>
    </div>;
};

export default WhiteBoard;
