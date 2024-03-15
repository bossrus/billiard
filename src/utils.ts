import Ball from './Ball';


const ATTENUATION_SIZE = 0.7

export const drawBalls = (context: CanvasRenderingContext2D, balls: Ball[]) => {
    balls.forEach(ball => {
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fillStyle = ball.color;
        context.fill();
        ball.move();
    });
};

export const handleWallCollisions = (canvas: HTMLCanvasElement, balls: Ball[]) => {
    balls.forEach(ball => {
        // Левая стена
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.velocityX = -ball.velocityX * ATTENUATION_SIZE;
            ball.velocityY *= ATTENUATION_SIZE;
        }
        // Правая стена
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.velocityX = -ball.velocityX * ATTENUATION_SIZE;
            ball.velocityY *= ATTENUATION_SIZE;
        }
        // Верхняя стена
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.velocityY = -ball.velocityY * ATTENUATION_SIZE;
            ball.velocityX *= ATTENUATION_SIZE;
        }
        // Нижняя стена
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.velocityY = -ball.velocityY * ATTENUATION_SIZE;
            ball.velocityX *= ATTENUATION_SIZE;
        }
    });
};
export const handleCollisions = (balls: Ball[]) => {

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const ball1 = balls[i];
            const ball2 = balls[j];

            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ball1.radius + ball2.radius) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                const ball1Mass = ball1.radius;
                const ball2Mass = ball2.radius;

                const ball1VelocityX = ball1.velocityX * cos + ball1.velocityY * sin;
                const ball1VelocityY = -ball1.velocityX * sin + ball1.velocityY * cos;
                const ball2VelocityX = ball2.velocityX * cos + ball2.velocityY * sin;
                const ball2VelocityY = -ball2.velocityX * sin + ball2.velocityY * cos;

                const newBall1VelocityX = (ball1VelocityX * (ball1Mass - ball2Mass) + 2 * ball2Mass * ball2VelocityX) / (ball1Mass + ball2Mass);
                const newBall2VelocityX = (ball2VelocityX * (ball2Mass - ball1Mass) + 2 * ball1Mass * ball1VelocityX) / (ball1Mass + ball2Mass);

                ball1.velocityX = (newBall1VelocityX * cos - ball1VelocityY * sin) * ATTENUATION_SIZE;
                ball1.velocityY = (newBall1VelocityX * sin + ball1VelocityY * cos) * ATTENUATION_SIZE;
                ball2.velocityX = (newBall2VelocityX * cos - ball2VelocityY * sin) * ATTENUATION_SIZE;
                ball2.velocityY = (newBall2VelocityX * sin + ball2VelocityY * cos) * ATTENUATION_SIZE;

                const correction = (ball1.radius + ball2.radius - distance) / 2;
                const correctionX = cos * correction;
                const correctionY = sin * correction;

                ball1.x -= correctionX;
                ball1.y -= correctionY;
                ball2.x += correctionX;
                ball2.y += correctionY;
            }
        }
    }
};