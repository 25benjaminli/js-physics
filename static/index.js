const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // context
console.log(canvas);

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

const gravity = 10; // gravity not working rn bruh

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

class Object {
  constructor() {
    this.w = 30;
    this.h = 30;
    this.position = {
      x: 300,
      y: 300,
    };

    this.posBotLeft = {
      x: this.position.x,
      y: this.position.y - this.h,
    };

    this.vel = {
      x: 5, // max speed
      y: 500, // max strength of jump
    };

    this.currSpeedX = 0.5;
    this.currSpeedY = 0.8;

    this.xAccel = 0.5;
    this.yAccel = 0.4;
    this.shouldDraw = true;

    this.money = 1; 
    // get bottom left corner and top right corner
  }

  getMoney() {
    return this.money;
  }

  draw() {
    c.fillStyle = "black"; // edit later
    c.fillRect(this.position.x, this.position.y, this.w, this.h); // top left point
  }

  erase() {
    c.fillStyle = "white"; // edit later
    c.fillRect(this.position.x, this.position.y, this.w, this.h); // top left point
  }

  update() {
    // implement slew rates for fall.
    this.currSpeedY = this.slewRateY(this.currSpeedY);
    // console.log(this.currSpeedY);
    if (!this.touchingBottom()) {
      this.position.y += this.currSpeedY;
    } else {
      this.currSpeedY = 0;
    }
    if (this.shouldDraw) {
      this.draw();
    }
    // this.draw();
  }

  move(dir) {
    switch (dir) {
      case "left":
        this.currSpeedX = this.slewRateX(this.currSpeedX);
        console.log(this.currSpeedX);
        this.position.x -= this.currSpeedX;
        // console.log(this.getStats());
        break;
      case "right":
        this.currSpeedX = this.slewRateX(this.currSpeedX);
        // console.log(this.currSpeedX);
        this.position.x += this.currSpeedX;
        // console.log(this.getStats());
        break;
      case "up":
        this.currSpeedY = this.slewRateYJump(this.currSpeedY, 200);
        console.log("currSpeed: " + this.currSpeedY);
        this.position.y -= this.currSpeedY;
        console.log("posy: " + this.position.y);
        break;
      case "stopX":
        this.vel.x = 0;
      case "stopY":
        this.vel.y = 0;
    }
  }

  moveSlip(dir) {
    switch (dir) {
      case "left":
        console.log("left release");
        this.currSpeedX = this.slewRateSlideX(this.currSpeedX);
        this.position.x -= this.currSpeedX;
      case "right":
        console.log("right release");
        this.currSpeedX = this.slewRateSlideX(this.currSpeedX);
        this.position.x += this.currSpeedX;
    }
  }
  slewRateX(speed) {
    console.log("speed: " + speed);
    return clamp(speed + this.xAccel, 1, this.vel.x); // horiz
  }

  slewRateY(speed) {
    return clamp(speed + this.yAccel, 1, gravity); // horiz
  }

  slewRateYJump(speed, pos) {
    // pos is the height from the bottom.
    if (this.position.y - this.h > canvas.height - pos) {
      return clamp(speed + this.yAccel, 20, this.vel.y);
    } else {
      keys.space.pressed = false;
      return 0;
    }
  }

  slewRateSlideX(speed) {
    return clamp(speed - this.xAccel, 1, this.vel.x); // horiz, implement later
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
    this.currSpeedY = 0;
    return true;
  }

  hide() {
    this.shouldDraw = false;
  }

  getPos() {
    return { xPos: this.position.x, yPos: this.position.y };
  }

  isShown() {
    return this.shouldDraw;
  }

  // overlap between two objects
  isColliding(otherObj) {
    // console.log(this.position.x + this.w);
    // console.log(otherObj.position.x);
    const ax1 = this.position.x; // bottom left
    const ay1 = this.position.y + this.h; // bottom left
    const ax2 = this.position.x + this.w; // top 
    const ay2 = this.position.y;

    const bx1 = otherObj.position.x; // bottom left
    const by1 = otherObj.position.y + otherObj.h;
    const bx2 = otherObj.position.x + otherObj.w;
    const by2 = otherObj.position.y;


    if (
      ax1 < bx2 &&
      ax2 > bx1 &&
      ay1 <= by1 &&
      ay1 > by2
    ) {
      console.log("colliding");
      return true;
    }
    console.log("not colliding");

    return false;
  }

  isColliding2(otherObj) {
    const ax1 = this.position.x; // bottom left
    const ay1 = this.position.y + this.h; // bottom left
    const ax2 = this.position.x + this.w; // top 
    const ay2 = this.position.y;

    const bx1 = otherObj.position.x; // bottom left
    const by1 = otherObj.position.y + otherObj.h;
    const bx2 = otherObj.position.x + otherObj.w;
    const by2 = otherObj.position.y;

    // check for overlap
    if (
      ax1 < bx2 &&
      ax2 > bx1 &&
      ay1 < by2 &&
      ay2 > by1
    ) {
      console.log("collision");
      return true;
    } else {
      return false;
    }


    // const x_overlap = Math.max(0, (Math.min(bx2, ax2) - Math.max(bx1, ax1)));
    // let y_overlap = Math.max(0, Math.abs(Math.min(by2, ay2) - Math.max(by1, ay1)));
    // console.log("yovermin: " + (Math.min(by2, ay2)));
    // console.log("yovermax: " + (Math.max(by1, ay1)));

    // console.log("bottom left y 1: " + ay1 + " top right y 2: " + by2 + " bottom left y 2: " + by1);
    
    // // check for overlap
    // y_overlap = (ay1 <= by2 && ay1 >= by1) ? Math.abs(ay1 - by2) : 0; 
    
    // console.log("x over: " + x_overlap);
    // console.log("y over: " + y_overlap);
    


    // return x_overlap > 0 && y_overlap > 0;

  }
}

class Mob extends Object {
  constructor(x, y) {
    super();
    this.position.x = x;
    this.position.y = y;
    this.health = 100;
  }

  draw() {
    c.fillStyle = "green";
    c.fillRect(this.position.x, this.position.y, this.w, this.h); // top left point
  }

  attack() {
    console.log("attak");
  }

  displayHealth() {
    c.fillText(this.health, this.position.x + (this.w / 4), this.position.y - 50);
  }

  update() {
    super.update();
    this.displayHealth();
  }
}

class Treasure extends Object {
  constructor(xThing, yThing) {
    super();
    this.position = {
      x: xThing,
      y: yThing,
    };
    this.collected = false;
  }

  draw() {
    c.fillStyle = "yellow";
    c.fillRect(this.position.x, this.position.y, this.w, this.h); // top left point
  }

  collect() {
    console.log("SDKLFJKLDFSJLKSD: " + this.position.x);
    if (this.isShown()) {
      this.collected = true;
      this.displayCollected();
    }
    // setTimeout(this.deleteText, 1000); // why doesn't timeout work??

    this.deleteText();
    this.hide();
  }

  displayCollected() {
    if (this.collected) {
      c.fillText("collected!", this.position.x + (this.w / 4), this.position.y - 50);
    }
  }

  deleteText() {
    console.log("hi");
    const x = this.position.x; // fix this - why isn't position accessed here?
    const y = this.position.y;

    console.log("asdasdf" + x);
    console.log("adsfadsky" + y);

    console.log("clearing");

    c.fillStyle = 'white';
    c.fillRect(this.position.x + (this.w / 4), this.position.y - 50, 100, 100);
  }

  update() {
    super.update();
    this.displayCollected();
  }
}

class Player extends Object {
  constructor() {
    super();
    this.health = 100;
  }

  draw() {
    // override the other color to differentiate
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.w, this.h); // top left point
  }

  displayHealth() {
    c.fillText(this.health, this.position.x + (this.w / 4), this.position.y - 50);
  }

  update() {
    super.update();
    this.displayHealth();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const player = new Player();
const mob = new Mob(100, 200);
const treasure = new Treasure(200, 400);

var treasures = [];
var mobs = [];


treasures.push(treasure);
mobs.push(mob);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height); // clear canvas.
  if (keys.right.pressed) {
    console.log("right");
    player.move("right");
  }

  if (keys.left.pressed) {
    player.move("left");
    console.log("left");
  }

  if (keys.space.pressed) {
    player.move("up");
  }

  // mob.update();
  // treasure.update();

  treasures.forEach((t) => t.update());
  mobs.forEach((m) => m.update());

  treasures.forEach(dostuff);
  // console.log(player.getMoney());
  player.update();
}

function dostuff(treasure) {
  if (player.isColliding(treasure)) {
    // treasure.collect();
  }
}

addEventListener("keydown", (event) => {
  // console.log(code);
  // console.log(event);
  // console.log(event.code);

  // if (player.touchingBottom()) {
    switch (event.code) {
      case "KeyA":
        keys.left.pressed = true;
        break;
      case "KeyD":
        keys.right.pressed = true;
        break;
    }
    // if(event.code == 'KeyA') { player.move("left"); }
    // if(event.code == 'KeyD') { player.move("right"); }
    // if(event.code == 'Space') { player.move("up"); }
  // }
});

addEventListener("keypress", (event) => {
  if (player.touchingBottom()) {
    switch (event.code) {
      case "Space":
        keys.space.pressed = true; // jetpack right now
        break;
    }
    // if(event.code == 'KeyA') { player.move("left"); }
    // if(event.code == 'KeyD') { player.move("right"); }
    // if(event.code == 'Space') { player.move("up"); }
  }
});

addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      // left (a)
      keys.left.pressed = false;
      // player.moveSlip("left"); // implement this.
      console.log("released lol");
      player.resetSpeedX();
      break;
    case "KeyD":
      // player.moveSlip("right");
      console.log("released lol");
      keys.right.pressed = false;
      player.resetSpeedX();
      break;
  }
});

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function addTreasure() {
  const t = new Treasure(Math.random() * 1000, Math.random() * 500);
  treasures.push(t);
  console.log("added!");
}

function addEnemy() {
  const m = new Mob(Math.random() * 1000, Math.random() * 500);
  mobs.push(m);
  console.log("added!");
}


const btn = document.getElementById("test-button");
const data = document.getElementById("info");

const toSend = [
  { "what's up": "hi bro", "what's up x2": "hi bro x2" },
  { "what's upx3": "hi brox3", "what's up x4": "hi bro x4" },
  { "what's upx5": "hi brox5", "what's up x6": "hi bro x6" },
];

btn.onclick = function () {
  fetch("http://127.0.0.1:5000/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    // Strigify the payload into JSON:
    body: JSON.stringify(toSend),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        alert("something is google wrong");
      }
    })
    .then((jsonResponse) => {
      // Log the response data in the console
      console.log(jsonResponse);
      // render stuff
      jsonResponse.map(Main=> 
        Main.make) 
    })
    .catch((err) => console.error(err));
};

animate();
