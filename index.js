const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d'); // context
console.log(canvas)

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

const gravity = 10; // gravity not working rn bruh
class Player {
    constructor() {
        this.position = {
            x: 300,
            y: 300
        }

        this.vel = {
            x: 10, // max speed
            y: 10
        }

        this.w = 30;
        this.h = 30;
        
        this.currSpeedX = 0;
        this.currSpeedY = 0;

        
        this.xAccel = 0.35;
        this.yAccel = 0.1;
        this.strength = 50; // strength of jump
    }



    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.w, this.h); // top left point
    }

    update() {
        // implement slew rates for fall.
        this.currSpeedY = this.slewRateY(this.currSpeedY);
        console.log(this.currSpeedY);
        if (!this.touchingBottom()) {
            this.position.y += this.currSpeedY;
        }
        this.draw();
    }

    move(dir) {
        switch(dir) {
            case "left":
                console.log("left");
                this.currSpeedX = this.slewRateX(this.currSpeedX);
                console.log(this.currSpeedX);
                this.position.x -= this.currSpeedX;
                console.log(this.getStats());
                break;
            case "right":
                console.log("right");
                this.currSpeedX = this.slewRateX(this.currSpeedX);
                console.log(this.currSpeedX);
                this.position.x += this.currSpeedX;
                console.log(this.getStats());
                break;
            case "up":
                this.position.y -= this.strength;
                break;
        }
    }

    moveSlip(dir) {
        switch(dir) {
            case "left":
                while(this.currSpeedX < 0) {
                    this.currSpeedX -= this.xAccel;
                    this.position.x -= this.currSpeedX;
                    // await sleep(10);
                }
            case "right":
                while(this.currSpeedX > 0) {
                    this.currSpeedX -= this.xAccel;
                    this.position.x += this.currSpeedX;
                }

        }
    }
    slewRateX(speed) {
        return clamp(speed + this.xAccel, 1, this.vel.x); // horiz
    }

    slewRateY(speed) {
        return clamp(speed + this.yAccel, 1, this.vel.y); // horiz
    }

    resetSpeedX() {
        this.currSpeedX = 0;
    }

    getStats() {
        console.log("x: " + this.position.x + " y: " + this.position.y);
    }

    touchingBottom() {
        if (this.position.y + this.h <= canvas.height) {
            return false;
        }
        return true;
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const player = new Player();


function animate() {   
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height); // clear canvas.
    player.update();
    
}

animate();

addEventListener('keydown', (event) => {
    // console.log(code);
    console.log(event);
    console.log(event.code);

    if (player.touchingBottom()) {
        switch(event.code) {
            case 'KeyA':
                // left (a)
                player.move("left");
                break;
            case 'KeyD':
                player.move("right");
                break;
            case 'Space':
                player.move("up");
                break;
        }
    }
    
})

addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'KeyA':
            // left (a)
            // player.moveSlip("left"); // implement this.
            player.resetSpeedX();
            break;
        case 'KeyD':
            // player.moveSlip("right");
            player.resetSpeedX();
            break;
        case 'Space':
            // player.resetSpeed();
            break;
    }
})

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

