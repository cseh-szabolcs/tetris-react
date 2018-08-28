var canvas = document.querySelector('#canvas');
var print = document.querySelector('#print');
var c = canvas.getContext('2d');

c.strokeStyle = 'blue'; //35dc78
c.fillStyle = 'black'; //45cf89
c.lineWidth = 1;

var circles = {};

var mouse = {
    x: null,
    y: null
};

/**
 * Calculates the distance between two pointy by using the phytagoars ...
 * @param {Circle} circle1
 * @param {Circle} circle2
 * @returns {number}
 */
function getDistance(circle1, circle2) {
    var diffX = Math.abs(circle1.x - circle2.x);
    var diffY = Math.abs(circle1.y - circle2.y);

    return Math.floor(Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)));
}


/**
 * Circle-class
 * @constructor
 */
function Circle(x, y, rad, dx, dy, gravity, friction, color) {
    var self = this;

    (function() {
        self.x = Math.round(x);
        self.y = Math.round(y);
        self.rad = rad;
        self.dx = dx;
        self.dy = dy;
        self.gravity = gravity;
        self.friction = friction;
        self.color = color;
    })();

    this.draw = function() {
        c.fillStyle = self.color;
        c.strokeStyle = self.color;
        c.beginPath();
        c.arc(self.x, self.y, self.rad, 0, Math.PI*2, false);
        c.stroke();
        c.fill();

        return self;
    };

    this.update = function() {


        return self.draw();
    };


    this.follow = function(otherCircle) {
        self.x = mouse.x;
        self.y = mouse.y;

        var distance = getDistance(otherCircle, self) - self.rad - otherCircle.rad;
        if (distance < 0) {
            if (distance < -(self.rad * 2)) {
                otherCircle.color = 'red';
            } else if (distance < -self.rad) {
                otherCircle.color = '#cc0000';
            } else {
                otherCircle.color = '#990000';
            }
        } else {
            otherCircle.color = 'blue';
        }

        print.innerText = 'a² + b² = c² : ' + distance;

        return self.draw();
    };

    this.drawHelperLines = function(otherCircle) {

        c.beginPath();
        c.strokeStyle = 'white';
        c.lineTo(self.x, self.y); // draw y-line
        c.lineTo(self.x, otherCircle.y);
        c.lineTo(otherCircle.x, otherCircle.y); // draw x-line
        c.stroke();
        c.beginPath();
        c.strokeStyle = 'lightgreen';
        c.lineTo(otherCircle.x, otherCircle.y); // draw line back
        c.lineTo(self.x, self.y);
        c.stroke();

        return self;
    };
}




/**
 * Create circles
 */
function initCircles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    circles = {};

    circles.big = new Circle(
        canvas.width/2,
        canvas.height/2,
        140,
        1,
        0,
        1,
        0.7,
        'blue'
    ).draw();

    circles.small = new Circle(
        200,
        100,
        40,
        1,
        0,
        4,
        0.45,
        'red'
    ).draw();
}



/**
 * Start animation
 */
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    circles.big.update();
    circles.small
        .update()
        .follow(circles.big)
        .drawHelperLines(circles.big);
}


/**
 * Helper to get an random-number
 */
function rand(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


/**
 * Track mouse on move
 */
window.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
});


/**
 * Re-create circles when window resizes
 */
window.addEventListener('resize', function() {
    initCircles();
});


// START
initCircles();
animate();


