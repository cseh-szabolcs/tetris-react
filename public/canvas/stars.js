var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

var stars = [];
var fragments = [];
var fakes = [];
var ticker = 0;

var settings = {
    starSize: [6, 22],
    colors: ['255,254,220', '196,255,244'],
    background: ['#09111E', '#142D42', null],
    tickerRate: [30, 120, 400],
    ground: [100, '#09111E'],
    fakeStars: 60
};



/**
 * Star-class
 * @constructor
 */
function Star(x, y, rad, opacity, color) {
    var self = this;

    (function() {
        self.x = Math.round(x);
        self.y = Math.round(y);
        self.rad = rad;
        self.color = color || settings.colors[0];
        self.opacity = opacity || 1;

        self.gravity = 1;
        self.friction = 0.8;

        self.velocity = {
            x: (Math.random() - 0.5) * 10,
            y: 3
        }
    })();

    this.draw = function() {
        if (self.rad <= 0) return self;

        c.save();
        c.beginPath();
        c.fillStyle = 'rgba('+self.color+','+self.opacity+')';
        c.shadowColor = 'rgba('+self.color+')';
        c.shadowBlur = 20;
        c.arc(self.x, self.y, self.rad, 0, Math.PI*2, false);
        c.fill();
        c.closePath();
        c.restore();

        return self;
    };

    this.update = function() {
        // collision on window-side
        if (self.x + self.rad > canvas.width || self.x < self.rad) {
            self.velocity.x = -self.velocity.x;
            self.onCollision();
        }

        // collision on the ground
        if (self.y + self.rad + self.velocity.y >= canvas.height - settings.ground[0]) {
            self.velocity.y = -self.velocity.y * self.friction;
            self.onCollision();
        } else {
            self.velocity.y += self.gravity;
        }

        self.x += self.velocity.x;
        self.y += self.velocity.y;

        return self.draw();
    };


    this.onCollision = function() {
        var diff = Math.max(Math.round(self.rad / 2), 2);
        var count = Math.max(Math.round(diff * diff / 4), 4);

        for (var i = 0; i < count; i++) {
            fragments.push(new Fragment(self.x, self.y, self));
        }

        self.rad = (diff > 2) ? diff : 0;
    };
}


/**
 * Fragment-class which is falling from an star
 * @constructor
 */
function Fragment(x, y, Star) {
    var self = this;

    (function() {
        var big = rand(0, 1);

        self.x = Math.round(x);
        self.y = Math.round(y);
        self.rad = big ? 2 : 1;
        self.color = settings.colors[1];
        self.ttl = 140;
        self.$ttl = self.ttl;

        self.gravity = big ? 0.2 : 0.1;
        self.friction = 0.9;

        if (Star.rad > 15) {
            increaseDimensions();
        }
        if (Star.rad > 20) {
            increaseDimensions();
        }

        self.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 20
        }
    })();

    this.draw = function() {
        if (self.ttl === 0) return self;
        var opacity = self.ttl / self.$ttl;

        c.save();
        c.beginPath();
        c.fillStyle = 'rgba('+self.color+','+opacity+')';
        c.shadowColor = 'rgba('+self.color+')';
        c.shadowBlur = 20;
        c.arc(self.x, self.y, self.rad, 0, Math.PI*2, false);
        c.fill();
        c.closePath();
        c.restore();

        return self;
    };

    this.update = function() {
        self.ttl--;

        // collision on the ground
        if (self.y + self.rad + self.velocity.y >= canvas.height - settings.ground[0]) {
            self.velocity.y = -self.velocity.y * self.friction;
        } else {
            self.velocity.y += self.gravity;
        }

        self.x += self.velocity.x;
        self.y += self.velocity.y;

        return self.draw();
    };

    function increaseDimensions() {
        self.rad += 1;
        self.gravity += 0.1;
        self.ttl += 30;
    }
}



function drawMountain(amount, height, color) {
    height = Math.round(height);

    for (var i = 0; i < amount; i++) {
        var width = canvas.width / amount;
        var bottom = canvas.height - settings.ground[0];
        c.beginPath();
        c.moveTo(i * width, bottom);
        c.lineTo(i * width + width + 60, bottom);
        c.lineTo(i * width + width / 2, bottom - height);
        c.lineTo(i * width - 60, bottom);
        c.fillStyle = color;
        c.fill();
        c.closePath();
    }
}



/**
 * Create stars
 */
function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // create ground
    settings.ground[0] = Math.max(Math.round(canvas.height / 10), 4);

    // reset elements
    stars = [];
    fragments = [];
    fakes = [];

    // create gradient-background
    settings.background[2] = c.createLinearGradient(0, 0, 0, canvas.height - settings.ground[0]);
    settings.background[2].addColorStop(0, settings.background[0]);
    settings.background[2].addColorStop(1, settings.background[1]);

    // create fake-stars
    for (var i = 0; i < settings.fakeStars; i++) {
        fakes.push(new Star(
            Math.random() * canvas.width,
            rand(0, Math.round(canvas.height / 2)) ,
            rand(1, 2),
            0.3,
            '255,255,255'
        ));
    }
}



/**
 * Start animation
 */
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = settings.background[2];
    c.fillRect(0, 0, canvas.width, canvas.height);
    var i;

    // draw fakes-stars
    for (i in fakes) {
        fakes[i].draw();
    }

    // draw mountains
    drawMountain(1, canvas.height / 3, '#152f45');
    drawMountain(3, canvas.height / 4, '#132b40');
    drawMountain(Math.round(canvas.width / 20), canvas.height / 20, '#0c1c29');

    // draw the ground
    c.fillStyle = settings.ground[1];
    c.fillRect(0, canvas.height - settings.ground[0], canvas.width, settings.ground[0]);

    // CORE 1: update stars-draw
    for (i = stars.length-1; i >= 0; --i) {
        if (stars[i].rad === 0) stars.splice(i, 1); // remove
        else stars[i].update(); // draw
    }

    // CORE 2: update star-frictions-draw
    for (i = fragments.length-1; i >= 0; --i) {
        if (fragments[i].ttl === 0) fragments.splice(i, 1); // remove
        else fragments[i].update(); // draw
    }

    // CORE: create a new star!
    ticker++;
    if (ticker % settings.tickerRate[0] === 0) {
        var rad = rand(settings.starSize[0], settings.starSize[1]);
        stars.push(new Star(
            rand(rad, canvas.width - rad),
            -100,
            rad
        ));

        settings.tickerRate[0] = rand(settings.tickerRate[1], settings.tickerRate[2]);
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


// START
initStars();
animate();
