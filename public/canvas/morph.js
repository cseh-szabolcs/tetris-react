var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');
c.lineWidth = 1;

var circles = [];


/**
 * Circle-class
 * @constructor
 */
function Circle(x, y, rad, dx, dy) {
    var self = this;

    (function() {
        self.x = x;
        self.y = y;
        self.rad = rad;
        self.dx = dx;
        self.dy = dy;
        self.color = 'black';
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
        if ((self.x + self.rad) > window.innerWidth || self.x < self.rad)  {
            self.dx = -self.dx;
        }

        if ((self.y + self.rad) > window.innerHeight || self.y < self.rad) {
            self.dy = -self.dy;
        }

        self.x += self.dx;
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

    for (var i=0; i<800; i++) {
        var rad = rand(20, 60);
        circles.push(new Circle(
            Math.random() * (window.innerWidth - rad * 2) + rad,
            Math.random() * (window.innerHeight - rad * 2) + rad,
            rad,
            (Math.random() - 0.5) * rand(1, 3),
            (Math.random() - 0.5) * rand(1, 3)
        ).draw());
    }
}



/**
 * Start animation
 */
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (var i in circles) {
        circles[i].update();
    }
}


/**
 * Helper to get an random-number
 */
function rand(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


/**
 * Recreate circles on resize
 */
window.addEventListener('resize', function() {
    if (window.resizeTimeout !== undefined) {
        window.clearTimeout(window.resizeTimeout);
        window.resizeTimeout = undefined;
    }

    window.resizeTimeout = window.setTimeout(function() {
        window.resizeTimeout = undefined;
        initCircles();
    }, 120);
});


// START
initCircles();
animate();


