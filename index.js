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

        
        this.xAccel = 0.4;
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
        // console.log(this.currSpeedY);
        if (!this.touchingBottom()) {
            this.position.y += this.currSpeedY;
        }
        else {
            this.currSpeedY = 0;
        }
        this.draw();
    }

    move(dir) {
        switch(dir) {
            case "left":
                console.log("left");
                this.currSpeedX = this.slewRateX(this.currSpeedX);
                // console.log(this.currSpeedX);
                this.position.x -= this.currSpeedX;
                // console.log(this.getStats());
                break;
            case "right":
                console.log("right");
                this.currSpeedX = this.slewRateX(this.currSpeedX);
                // console.log(this.currSpeedX);
                this.position.x += this.currSpeedX;
                // console.log(this.getStats());
                break;
            case "up":
                this.position.y -= this.strength;
                console.log("up: " + this.position.y);
                break;
        }
    }

    moveSlip(dir) {
        switch(dir) {
            case "left":
                console.log("left release")
                this.currSpeedX = this.slewRateSlideX(this.currSpeedX);
                this.position.x -= this.currSpeedX;
            case "right":
                console.log("right release")
                this.currSpeedX = this.slewRateSlideX(this.currSpeedX);
                this.position.x += this.currSpeedX;

        }
    }
    slewRateX(speed) {
        return clamp(speed + this.xAccel, 1, this.vel.x); // horiz
    }

    slewRateY(speed) {
        return clamp(speed + this.yAccel, 1, this.vel.y); // horiz
    }

    slewRateSlideX(speed) {
        return clamp(speed - this.xAccel, 1, this.vel.y); // horiz
    }

    resetSpeedX() {
        this.currSpeedX = 0;
    }

    getStats() {
        console.log("x: " + this.position.x + " y: " + this.position.y);
    }

    touchingBottom() {
        if (this.position.y + this.h + this.currSpeedY < canvas.height) {
            return false;
        }
        this.position.y = canvas.height - this.h;
        this.currSpeed = 0;
        return true;
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const player = new Player();

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
function animate() {   
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height); // clear canvas.
    player.update();
    
}

animate();

addEventListener('keydown', (event) => {
    // console.log(code);
    // console.log(event);
    // console.log(event.code);

    if (player.touchingBottom()) {
        switch(event.code) {
            case "KeyA":
                keys.left.pressed = true;
                break;
            case "KeyD":
                keys.right.pressed = true;
                break;
            case "Space":
                break;
        }
        if(event.code == 'KeyA') { player.move("left"); }
        if(event.code == 'KeyD') { player.move("right"); }
        if(event.code == 'Space') { player.move("up"); }    
    }
    
})

addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'KeyA':
            // left (a)
            keys.left.pressed = false;
            player.moveSlip("left"); // implement this.
            console.log("released lol")
            
            player.resetSpeedX();
            break;
        case 'KeyD':
            player.moveSlip("right");
            console.log("released lol")
            
            player.resetSpeedX();
            break;
    }
})

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

