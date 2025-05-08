"use strict"
// Setting up canvas
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundImage = "url('../images/background.png')";
let color = ['red', 'green', 'blue'];
let platforms = [];


let offset = 0;
let slide = 0;
let face = 'right';

//const backgroundImg = new Image();
//backgroundImg.src = '../images/background.png'

const backgroundImg2 = new Image();
backgroundImg2.src = '../images/hills.png'
//Start animation after backGround image load



const PlatformImg = new Image();
PlatformImg.src = "../images/platform.png";
PlatformImg.onload = function () {

    playerAnimation();
}


// Gravity
let gravity = 0.5;

// Making platform
class Platform {
    constructor(x, y, width, height, img) {
        this.platform = { x: x, y: y, width: width, height: height };
        this.img = img

    }

    draw() {

        context.drawImage(PlatformImg, this.platform.x, this.platform.y, this.platform.width, this.platform.height);

    }
}

// Making player
class Player {
    constructor() {
        this.position = { x: 200, y: 200 };
        this.velocity = { x: 0, y: 2 };
        this.onGround = 0; // onGround = 1 player is on the ground, onGround = 0 player is mid-air
        this.height = 80;
        this.width = 45;
        this.frames = 1;
        this.dead = false;



    }

    draw() {
        // context.fillStyle = "black";
        //context.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Check player's movement state and select appropriate sprite
        if (this.velocity.x == 0 && this.velocity.y == 0 && face == 'right') {
            // Standing still, facing right
            context.drawImage(playerStandRight, 177 * this.frames, 0, 177, 400, this.position.x, this.position.y, this.width, this.height);
        } else if (this.velocity.x == 0 && this.velocity.y == 0 && face == 'left') {
            // Standing still, facing left
            context.drawImage(playerStandLeft, 177 * this.frames, 0, 177, 400, this.position.x, this.position.y, this.width, this.height);
        }
        else if (this.velocity.x > 0) {
            // Moving to the right
            context.drawImage(playerRunRight, 340 * this.frames, 0, 368, 390, this.position.x, this.position.y, 100, this.height);
            face = 'right';
        } else if (this.velocity.x < 0) {
            // Moving to the left
            context.drawImage(playerRunLeft, 340 * this.frames, 0, 368, 390, this.position.x, this.position.y, 100, this.height);
            face = 'left';
        }





    }

    playerMovement() {

        this.frames++;
        if (this.frames == 24) { this.frames = 1; }












        /*/if ((this.position.y + this.height) > canvas.height) {
          this.position.y = canvas.height - this.height;
          this.velocity.y = 0; // Reset velocity when hitting the ground
          this.onGround = 1; // Set player as grounded
        }*/
        if ((this.position.y + this.height) >= canvas.height) {
            this.dead = true; //  Trigger death
            return; // Stop further processing
        }




        else {
            this.velocity.y += gravity; // Gravity continues if not grounded
            this.onGround = 0; // Player is mid-air
        }

        for (let i = 0; i < platforms.length; i++) {
            if (
                (this.position.x + this.width > platforms[i].platform.x) &&
                (this.position.x < platforms[i].platform.x + platforms[i].platform.width) &&
                (this.position.y + this.height <= platforms[i].platform.y) && // Check if player is above the platform
                (this.position.y + this.height + this.velocity.y >= platforms[i].platform.y) // Check if falling onto the platform
            ) {
                this.velocity.y = 0; // Stop vertical movement when landing on the platform
                this.onGround = 1; // Set player as grounded
                this.position.y = platforms[i].platform.y - this.height; // Place player on top of the platform
            }

            // stop player after collision with platform
            if (this.velocity.x > 0 &&
                (this.position.x + this.width + 2 > platforms[i].platform.x) &&
                (this.position.x + this.width < platforms[i].platform.x + platforms[i].platform.width) &&
                (this.position.y + this.height > platforms[i].platform.y) &&
                (this.position.y < platforms[i].platform.y + platforms[i].platform.height)) {
                this.velocity.x = 0

            }

            platforms[i].platform.x += offset;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;





        this.draw();



    }



}







class Fireball {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y + 20; // Adjust height to mouth
        this.width = 30;
        this.height = 20;
        this.speed = 4;
        this.direction = direction;
    }

    draw() {
        context.drawImage(fireballImg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.speed * (this.direction === 'right' ? 1 : -1);
        this.draw();
    }
}

let fireballs = [];
const fireballImg = new Image();
fireballImg.src = '../images/fireball.png';
fireballImg.onload = ImageLoded;

// Creating player
let player = new Player();

// Creating platforms
let platform1 = new Platform(0, canvas.height - PlatformImg.height, PlatformImg.width, 140, PlatformImg);
let platform2 = new Platform(500, canvas.height - PlatformImg.height, PlatformImg.width, 140, PlatformImg);
let platform3 = new Platform(1100, canvas.height - PlatformImg.height, PlatformImg.width, 140, PlatformImg);
let platform4 = new Platform(1900, 400, PlatformImg.width, 140, PlatformImg);
platforms.push(platform1, platform2, platform3, platform4);


//Player images
const playerStandRight = new Image();
playerStandRight.src = '../images/Right.png';
playerStandRight.onload = ImageLoded;

const playerStandLeft = new Image();
playerStandLeft.src = '../images/spriteStandLeft.png';
playerStandLeft.onload = ImageLoded;

const playerRunLeft = new Image();
playerRunLeft.src = '../images/spriteRunLeft.png';
playerRunLeft.onload = ImageLoded;

const playerRunRight = new Image();
playerRunRight.src = '../images/spriteRunRight.png';
playerRunRight.onload = ImageLoded;

function ImageLoded() {
    player.draw();
}








// Event listeners
addEventListener('keydown', function (e) {
    if (e.key === 'f') {
        fireballs.push(new Fireball(player.position.x + (face === 'right' ? player.width : -30), player.position.y, face));
    }

    if (e.key === 'ArrowRight') {
        player.velocity.x = 2;
        offset = -5;
    }
    if (e.key === 'ArrowLeft') {
        player.velocity.x = -2;
        offset = 5;
    }
    if (e.key === 'ArrowUp') { // Jump only if grounded

        player.velocity.y = -12; // Smooth jump effect
        player.onGround = 0; // Temporarily disable jump button

    }

    if (e.key === ' ') { // Jump only if grounded
        if (player.onGround) {
            player.velocity.y = -12; // Smooth jump effect
            player.onGround = 0; // Temporarily disable jump button
        }
    }
});

addEventListener('keyup', function (e) {
    if (e.key === 'ArrowRight') {
        player.velocity.x = 0;
        offset = 0;
    }
    if (e.key === 'ArrowLeft') {
        player.velocity.x = 0;
        offset = 0;
    }
    if (e.key === 'ArrowUp') { // Jump only if grounded

        player.velocity.y = 0; // Smooth jump effect
        player.onGround = 0; // Temporarily disable jump button

    }



}
);

addEventListener('keydown', function (e) {
    if (e.key === 'r' && player.dead) {
        location.reload(); // Reloads the page to restart game
    }
});


// Main animation loop
function playerAnimation() {

    if (player.dead) {
        context.fillStyle = 'green';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '48px sans-serif';
        context.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
        return; // Stop the loop if player is dead
    }

    requestAnimationFrame(playerAnimation);


    context.clearRect(0, 0, canvas.width, canvas.height);


    slide += offset;


    //context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
    context.drawImage(backgroundImg2, slide, 0, 5000, canvas.height);
    player.playerMovement();
    for (let i = 0; i < fireballs.length; i++) {
        fireballs[i].update();
    }

    // Remove fireballs off-screen
    fireballs = fireballs.filter(fb => fb.x >= 0 && fb.x <= canvas.width);





    for (let i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }

}
