import React, { useEffect, useRef, useState } from 'react';
// import ColorPicker from '../ColorPicker/ColorPicker';
import './WhiteBoard.scss';

const COLORS = ['#2f2f2f', '#f05f50', '#2ffa8f', '#5050ff', '#ffff80'];
const STROKES = [2, 4, 8, 12, 14];
const SHAPE_TYPES = {
    LINE: 'line',
    RECTANGLE: 'rect'
}

const WhiteBoard = () => {
    const canvasRef = useRef();
    const ctxRef = useRef();
    const drawRef = useRef(false);
    const prevRef = useRef({ prevX: -1, prevY: -1 });
    const prefRefArray = useRef([]);
    const [drawDataList, setDrawDataList] = useState([]);
    const [color, setColor] = useState(COLORS[0])
    const [strokeWidth, setStrokeWidth] = useState(STROKES[1])
    const [shapeType, setShapeType] = useState(SHAPE_TYPES.LINE)

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctxRef.current = ctx;
    }, [color, strokeWidth])



    const onResize = (evt, data) => {
        console.log({ evt, data })
        // const canvas = canvasRef.current;
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
    }

    const setPreviousPosition = ({ clientX, clientY }) => {
        prevRef.current = { prevX: clientX, prevY: clientY };
        prefRefArray.current.push(prevRef.current);
    }

    // const drawLine = ({ clientX, clientY }) => {
    //     const ctx = ctxRef.current;
    //     ctx.beginPath();

    //     let prevData = prevRef.current;
    //     if (prevData.prevX !== -1 && prevData.prevY !== -1) {
    //         ctx.moveTo(prevData.prevX, prevData.prevY);
    //     } else {
    //         ctx.moveTo(clientX, clientY);
    //     }
    //     ctx.lineTo(clientX, clientY);
    //     ctx.stroke();
    // }

    const drawLine = (x1, y1, x2, y2, { color, strokeWidth }) => {
        const ctx = ctxRef.current;
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // const drawRect = ({ clientX, clientY }) => {
    //     const canvas = canvasRef.current;
    //     const ctx = ctxRef.current;
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     draw()
    //     // ctx.beginPath();

    //     let prevData = prevRef.current;
    //     if (prevData.prevX === -1 && prevData.prevY === -1) {
    //         setPreviousPosition({ clientX, clientY });
    //     }
    //     const rectWidth = clientX - prevRef.current.prevX;
    //     const rectHeight = clientY - prevRef.current.prevY

    //     ctx.rect(prevRef.current.prevX, prevRef.current.prevY, rectWidth, rectHeight);
    //     ctx.stroke();
    // }

    const drawRectangle = (x1, y1, x2, y2, { color, strokeWidth }) => {
        const ctx = ctxRef.current;
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        const rectWidth = x2 - x1;
        const rectHeight = y2 - y1;

        ctx.rect(x1, y1, rectWidth, rectHeight);
        ctx.stroke();
    }

    const draw = () => {
        const prevRef = prefRefArray.current;
        for (let index = 1; index < prevRef.length; index++) {
            const { prevX, prevY } = prevRef[index - 1];
            const { prevX: currX, prevY: currY } = prevRef[index];
            drawLine(prevX, prevY, currX, currY);
        }
    }

    const drawAllPrevShapes = () => {
        drawDataList.forEach(drawData => {
            const { posList, shapeType, style } = drawData;
            switch (shapeType) {
                case SHAPE_TYPES.LINE: {
                    for (let index = 1; index < posList.length; index++) {
                        const { prevX, prevY } = posList[index - 1];
                        const { prevX: currX, prevY: currY } = posList[index];
                        drawLine(prevX, prevY, currX, currY, style);
                    }
                    break;
                }
                case SHAPE_TYPES.RECTANGLE: {
                    const [{ prevX, prevY }, { prevX: currX, prevY: currY }] = posList;
                    drawRectangle(prevX, prevY, currX, currY, style);
                    break;
                }
                default:
                    break;
            }
        });
    }

    const drawShape = (event) => {
        const { clientX, clientY } = event?.touches?.[0] || event;
        if (drawRef.current) {
            console.log('drawing', { clientX, clientY });
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            let prevData = prevRef.current;
            const style = { color, strokeWidth };
            switch (shapeType) {
                case SHAPE_TYPES.LINE: {
                    const x2 = prevData.prevX === -1 ? clientX : prevData.prevX
                    const y2 = prevData.prevY === -1 ? clientY : prevData.prevY
                    drawLine(clientX, clientY, x2, y2, style);
                    setPreviousPosition({ clientX, clientY }, true);
                    break;
                }
                case SHAPE_TYPES.RECTANGLE:
                    if (prevData.prevX === -1 && prevData.prevY === -1) {
                        setPreviousPosition({ clientX, clientY });
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawAllPrevShapes();
                    drawRectangle(prevRef.current.prevX, prevRef.current.prevY, clientX, clientY, style);
                    break;
                default:
                    break;

            }
        }
    }

    const startDrawing = () => {
        drawRef.current = true;
        // ctxRef.current.beginPath();
        console.log('start drawing')
    }

    const stopDrawing = (event) => {
        const { clientX, clientY } = event?.changedTouches?.[0] || event;
        if (shapeType === SHAPE_TYPES.RECTANGLE) {
            setPreviousPosition({ clientX, clientY });
            console.log({ prevRef: prevRef.current })
        }
        drawRef.current = false;
        prevRef.current = { prevX: -1, prevY: -1 };
        ctxRef.current.closePath();
        const newDrawData = {
            posList: prefRefArray.current,
            shapeType,
            style: {
                color,
                strokeWidth
            }
        }
        setDrawDataList([...drawDataList, newDrawData])
        prefRefArray.current = [];
        console.log('stop drawing', newDrawData)
    }

    return <div className="canvas">
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={drawShape}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={drawShape}
            onTouchEnd={stopDrawing}
        >
            Your browser does not support the canvas element.
        </canvas>
        <div className="header">
            <div className="menu shapes">
                {
                    Object.keys(SHAPE_TYPES).map((shape) => (
                        <div className={`shape ${SHAPE_TYPES[shape]} ${shapeType === SHAPE_TYPES[shape] ? 'active' : ''}`} onClick={() => setShapeType(SHAPE_TYPES[shape])} />
                    ))
                }
            </div>
            <div className="menu colors">
                {
                    COLORS.map((colr) => (
                        <div className={`color ${color === colr ? 'active' : ''}`} style={{ backgroundColor: colr }} onClick={() => setColor(colr)} />
                    ))
                }
            </div>
            {/* <ColorPicker /> */}
            <div className="menu strokes">
                {
                    STROKES.map((stroke) => (
                        <div className={`stroke ${strokeWidth === stroke ? 'active' : ''}`} style={{ "--stroke-width": `${stroke}px` }} onClick={() => setStrokeWidth(stroke)} />
                    ))
                }
            </div>

        </div>
    </div>;
};

export default WhiteBoard;
