var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

var stars = [];
var fragments = [];
var fakes = [];

var settings = {
    stars: 1,
    gravity: 0.7,
    friction: 0.76,
    colors: ['cyan', 'lightgreen']
};


/**
 * Star-class
 * @constructor
 */
function Star(x, y, rad) {
    var self = this;

    (function() {
        self.x = Math.round(x);
        self.y = Math.round(y);
        self.rad = rad;
        self.color = settings.colors[0];

        self.gravity = 1;
        self.friction = 0.8;

        self.velocity = {
            x: 1,
            y: 2
        }
    })();

    this.draw = function() {
        c.beginPath();
        c.fillStyle = self.color;
        c.arc(self.x, self.y, self.rad, 0, Math.PI*2, false);
        c.fill();

        return self;
    };

    this.update = function() {

        if (self.y + self.rad + self.velocity.y >= canvas.height) {
            self.velocity.y = -self.velocity.y * self.friction;
            self.onCollision();
        } else {
            self.velocity.y += self.gravity;
        }

        self.y += self.velocity.y;

        return self.draw();
    };


    this.onCollision = function() {
        for (var i = 0; i < 8; i++) {
            fragments.push(new Fragment(self.x, self.y, 2));
        }
    };
}


/**
 * Fragment-class which is falling from an star
 * @constructor
 */
function Fragment(x, y) {
    var self = this;

    (function() {
        var big = rand(0, 1);

        self.x = Math.round(x);
        self.y = Math.round(y);
        self.rad = big ? 2 : 1;
        self.color = settings.colors[1];
        self.ttl = 300;

        self.gravity = big ? 0.2 : 0.1;
        self.friction = 0.9;

        self.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 20
        }
    })();

    this.draw = function() {
        c.beginPath();
        c.fillStyle = self.color;
        c.arc(self.x, self.y, self.rad, 0, Math.PI*2, false);
        c.fill();

        return self;
    };

    this.update = function() {
        self.ttl--;

        if (self.y + self.rad + self.velocity.y >= canvas.height) {
            self.velocity.y = -self.velocity.y * self.friction;
        } else {
            self.velocity.y += self.gravity;
        }

        self.x += self.velocity.x;
        self.y += self.velocity.y;

        return self.draw();
    };
}



/**
 * Create stars
 */
function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = [];
    fragments = [];
    fakes = [];

    for (var i = 0; i < settings.stars; i++) {
        var rad = rand(30, 30);
        stars.push(new Star(canvas.width / 2, 90, rad).draw());
    }
}



/**
 * Start animation
 */
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    var i;

    for (i = 0; i < stars.length; i++) {
        stars[i].update();
    }

    for (i = fragments.length-1; i >= 0; --i) {
        if (fragments[i].ttl === 0) fragments.splice(i, 1); // remove
        else fragments[i].update(); // core: draw
    }
}


/**
 * Helper to get an random-number
 */
function rand(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


/**
 * Re-create stars when window resizes
 */
window.addEventListener('resize', function() {
    if (window.resizeTimeout !== undefined) {
        window.clearTimeout(window.resizeTimeout);
        window.resizeTimeout = undefined;
    }

    window.resizeTimeout = window.setTimeout(function() {
        window.resizeTimeout = undefined;
        initStars();
    }, 120);
});


/**
 * Re-create stars on window-click
 */
window.addEventListener('click', function() {
    initStars();
});

// START
initStars();
animate();


