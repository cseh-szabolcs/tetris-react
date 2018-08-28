var canvas = document.querySelector('#canvas');
var print = document.querySelector('#print');
var c = canvas.getContext('2d');

c.strokeStyle = 'blue'; //35dc78
c.fillStyle = 'black'; //45cf89
c.lineWidth = 1;

var circles = [];

var settings = {
    circles: 1,
    colors: [
        ['#42253D', '#8C8419', '#EAAB06', '#F2CBA2', '#D70B31'],
        ['#FFFFC8', '#FF5D0F', '#EE4849', '#008265', '#1748FF'],
        ['#BF0C2B', '#02173E', '#09A38C', '#F5900E', '#F14C13'],
        ['#cccccc', '#666666', '#333333', '#e9e9e9', '#1f1f1f'],
        ['#590A27', '#2C0216', '#6A91B2', '#EFDFC8', '#D99F7E'],
        ['#401317', '#8C2742', '#1BF2DD', '#0C261A', '#736451'],
        ['#000000', '#CAFF00', '#2D2E30', '#B7BED4', '#0C0040']
    ]
};
settings.color = settings.colors[rand(0, settings.colors.length-1)];


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

        // gravity
        if (self.y + self.rad + self.dy >= canvas.height) {
            self.dy = -self.dy * self.friction;
        } else {
            self.dy += self.gravity;
        }

        self.y += self.dy;

        return self.draw();
    };
}


/**
 * Create circles
 */
function initCircles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    circles = [];

    circles.push(new Circle(
        200,
        100,
        60,
        1,
        0,
        4,
        0.45,
        'blue'
    ).draw());

    circles.push(new Circle(
        400,
        100,
        20,
        1,
        0,
        1,
        0.7,
        'red'
    ).draw());
}



/**
 * Start animation
 */
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    circles[0].update();
    circles[1].update();

    print.innerHTML = '<p>Ball1:<br />y: '+circles[0].y+'<br />dy: '+circles[0].dy+'<br />gravity: '+circles[0].gravity+'<br />friction: '+circles[0].friction+'</p>'
        + '<p>Ball2:<br />y: '+circles[1].y+'<br />dy: '+circles[1].dy+'<br />gravity: '+circles[1].gravity+'<br />friction: '+circles[1].friction+'</p>';

}


/**
 * Helper to get an random-number
 */
function rand(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


/**
 * Re-create circles when window resizes
 */
window.addEventListener('resize', function() {
    initCircles();
});

// START
initCircles();
animate();


