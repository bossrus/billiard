//App.tsx

import React, {useEffect, useRef, useState} from 'react';
import Ball from './Ball';
import {drawBalls, handleCollisions, handleWallCollisions} from './utils';
import ColorPicker from "./ColorPicker.tsx";

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [balls, setBalls] = useState<Ball[]>([
        new Ball(100, 100, 20, '#ff0000'),
        new Ball(200, 200, 30, '#11ff00'),
        new Ball(300, 100, 15, '#0011ff')
    ]);
    const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
    const [colorPickerPosition, setColorPickerPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBalls(context, balls);
            handleWallCollisions(canvas, balls);
            handleCollisions(balls);
            requestAnimationFrame(animate);
        };

        animate();
    }, [balls]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        setSelectedBall(null);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const isLeftClick = e.button === 0;
        const isRightClick = e.button === 2;

        if (isLeftClick) {
            const clickedBall = balls.find(ball => ball.containsPoint(x, y));
            if (clickedBall) {
                setSelectedBall(clickedBall);
                setColorPickerPosition({x: e.clientX, y: e.clientY}); // Установка позиции ColorPicker
            } else {
                const closestBall = balls.reduce((prev, curr) =>
                        prev === null || getDistance(x, y, curr.x, curr.y) < getDistance(x, y, prev.x, prev.y)
                            ? curr
                            : prev
                    , balls[0] || new Ball(0, 0, 0, 'black'));

                if (closestBall) {
                    const angle = Math.atan2(y - closestBall.y, x - closestBall.x);
                    closestBall.velocityX = Math.cos(angle) * 10;
                    closestBall.velocityY = Math.sin(angle) * 10;
                }
            }
        } else if (isRightClick) {
            const newBall = new Ball(x, y, 20, 'black');
            setBalls([...balls, newBall]);
        }
    };
    const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleColorAndRadiusChange = (color: string, radius: number) => {
        if (selectedBall) {
            selectedBall.color = color;
            selectedBall.radius = radius;
            setSelectedBall(null);
            setColorPickerPosition(null);
        }
    };

    const handleColorPickerClose = () => {
        setSelectedBall(null);
        setColorPickerPosition(null); // Сбрасываем позицию ColorPicker при закрытии
    };

    return (
        <div>
            <p>
                При клике <strong>левой кнопкой мыши по пустому месту на поле</strong>, находится ближайший центр шара,
                и этот шар начинает лететь в сторону места, где был проделан клик.
            </p>
            <p>
                При клике <strong>правой кнопкой мыши по полю</strong> создаётся новый шар. Даже если клик приходится на
                другой шар.
            </p>
            <p>
                При клике <strong>левой кнопкой мыши по шару</strong> появляется окошко для смены его цвета и радиуса.
            </p>
            <p>
                При столкновении шаров их радиус принимается за их массу.
            </p>
            <canvas
                style={{backgroundColor: 'lightgreen'}}
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={handleMouseDown}
            />
            {selectedBall && (
                <ColorPicker
                    onColorChange={handleColorAndRadiusChange}
                    onClose={handleColorPickerClose}
                    position={colorPickerPosition}
                    initialColor={selectedBall.color}
                    initialRadius={selectedBall.radius}
                />
            )}
        </div>
    );
};

export default App;