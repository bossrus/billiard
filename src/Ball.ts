export default class Ball {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocityX: number;
    velocityY: number;

    constructor(x: number, y: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    containsPoint(x: number, y: number): boolean {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy < this.radius * this.radius;
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}