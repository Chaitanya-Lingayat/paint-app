import React, { useState } from 'react';
import { AlphaPicker, BlockPicker, GithubPicker } from 'react-color'

const ColorPicker = () => {
    const [color, setColor] = useState({});

    const onChange = (color) => {
        setColor({ color: color.rgb })
    };

    return (
        <div>
            <BlockPicker color={color} onChange={onChange} />
            <GithubPicker color={color} onChange={onChange} />
            <BlockPicker color={color} onChange={onChange} />
            <AlphaPicker color={color} onChange={onChange} />
        </div>
    );
};

export default ColorPicker;
