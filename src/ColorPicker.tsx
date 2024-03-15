import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
    onColorChange: (color: string, radius: number) => void;
    onClose: () => void;
    position: { x: number; y: number } | null;
    initialColor: string;
    initialRadius: number;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange, onClose, position, initialColor, initialRadius }) => {
    const [color, setColor] = useState<string>('');
    const [radius, setRadius] = useState<number>(0);

    useEffect(() => {
        setColor(initialColor);
        setRadius(initialRadius);
    }, [initialColor, initialRadius]);

    useEffect(() => {
        if (color === '' && initialColor) {
            setColor(initialColor);
        }
        if (radius === 0 && initialRadius) {
            setRadius(initialRadius);
        }
    }, [color, radius, initialColor, initialRadius]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(parseInt(e.target.value));
    };

    const handleConfirm = () => {
        onColorChange(color, radius);
        onClose();
    };

    if (!position) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems:'center',
                flexDirection:'row',
                gap: '10px'
            }}
        >
            <input type="color" value={color} onChange={handleColorChange} />
            Диаметр: <input type="number" maxLength={150} value={radius} onChange={handleRadiusChange} />
            <button onClick={handleConfirm}>Confirm</button>
        </div>
    );
};

export default ColorPicker;