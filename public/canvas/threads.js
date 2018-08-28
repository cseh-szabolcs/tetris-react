var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');
var circles = [];

var settings = {
    circles: 460,
    speed: 4,
    size: [2, 12],
    colors: [
        ['#BF0C2B', '#02173E', '#09A38C', '#F5900E', '#F14C13'],
        ['#133046', '#15959F', '#F1E4B3', '#F4A090', '#F26144'],
        ['#324D5C', '#14B278', '#F0CA4D', '#E37B40', '#E37B40'],
        ['#BE6C84', '#665F79', '#355E7C', '#F0747F', '#F6B192'],
        ['#2A4E53', '#96664F', '#C07F83', '#CCC0AF', '#8CA098'],
        ['#FEDF00', '#FEB900', '#D67200', '#DE4600', '#DE1F00'],
        ['#E069FF', '#76B5FF', '#9EFFB8', '#60E8DE', '#CAC5E8'],
        ['#6E102B', '#B52350', '#7D1940', '#FFA023', '#FFA023'],
        ['#3628EF', '#FF5DEF', '#8747FE', '#088FFE', '#03A6CE'],
        ['#F78A15', '#01A0C6', '#F42434', '#6B3FA6', '#6B3FA6'],
        ['#5C008C', '#FB0058', '#B034FF', '#33A400', '#C9FF00']
    ]
};
settings.color = settings.colors[rand(0, settings.colors.length-1)];


/**
 * Contains all collision-algorithms
 */
var Collision = {

    /**
     * @returns {number}
     */
    getDistance: function(x1, y1, x2, y2) {
        var diffX = x1 - x2;
        var diffY = y1 - y2;

        return Math.floor(Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)));
    },

    /**
     * @returns {boolean}
     */
    isCollision: function (x1, y1, rad1, x2, y2, rad2) {
        return (this.getDistance(x1, y1, x2, y2) - rad1 - rad2 < 0);
    },

    /**
     * Rotates coordinate system for velocities
     * Takes velocities and alters them as if the coordinate system they're on was rotated
     *
     * @param  {Object} velocity    The velocity of an individual particle
     * @param  {number}  angle      The angle of collision between two objects in radians
     * @return {Object}             The altered x and y velocities after the coordinate system has been rotated
     */
    rotate: function(velocity, angle) {
        return {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };
    },

    /**
     * Swaps out two colliding circles' x and y velocities after running through
     * an elastic collision reaction equation
     *
     * @param  {Object}  circle           A circle object with x and y coordinates, plus velocity
     * @param  {Object}  otherCircle      A circle object with x and y coordinates, plus velocity
     */
    resolveCollision: function(circle, otherCircle) {
        var xVelocityDiff = circle.velocity.x - otherCircle.velocity.x;
        var yVelocityDiff = circle.velocity.y - otherCircle.velocity.y;

        var xDist = otherCircle.x - circle.x;
        var yDist = otherCircle.y - circle.y;

        // Prevent accidental overlap of circles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding circles
            var angle = -Math.atan2(otherCircle.y - circle.y, otherCircle.x - circle.x);

            // Store mass in var for better readability in collision equation
            var m1 = circle.mass;
            var m2 = otherCircle.mass;

            // Velocity before equation
            var u1 = this.rotate(circle.velocity, angle);
            var u2 = this.rotate(otherCircle.velocity, angle);

            // Velocity after 1d collision equation
            var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            var v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            // Final velocity after rotating axis back to original location
            var vFinal1 = this.rotate(v1, -angle);
            var vFinal2 = this.rotate(v2, -angle);

            // Swap circle velocities for realistic bounce effect
            circle.velocity.x = vFinal1.x;
            circle.velocity.y = vFinal1.y;

            otherCircle.velocity.x = vFinal2.x;
            otherCircle.velocity.y = vFinal2.y;
        }
    }

};




/**
 * Circle-class
 * @constructor
 */
function Circle(x, y, rad) {
    var self = this;

    (function() {
        self.x = Math.round(x);
        self.y = Math.round(y);
        self.rad = rad;
        self.minRad = rad;
        self.morphSpeed = rand(2, 6);
        self.color = settings.color[rand(0, settings.color.length-1)];
        self.opacity = 0.14;

        self.mass = 1;
        self.velocity = {
            x: (Math.random() - 0.5) * settings.speed,
            y: (Math.random() - 0.5) * settings.speed
        }
    })();

    this.draw = function() {
        c.fillStyle = self.color;
        c.beginPath();
        c.arc(self.x, self.y, self.rad, 0, Math.PI*2, false);
        c.restore();
        c.strokeStyle = self.color;
        c.lineWidth = 2;
        c.globalAlpha = self.opacity;
        c.fill();
        c.stroke();

        return self;
    };

    this.update = function(circles) {

        for (var i = 0; i < circles.length; i++) {
            if (circles[i] === self) continue;

            if (Collision.isCollision(self.x, self.y, self.rad, circles[i].x, circles[i].y, circles[i].rad)) {
                Collision.resolveCollision(self, circles[i]);
            }
        }

        if (self.x - self.rad <= 0 || self.x + self.rad >= canvas.width) {
            self.velocity.x = -self.velocity.x;
        }

        if (self.y - self.rad <= 0 || self.y + self.rad >= canvas.height) {
            self.velocity.y = -self.velocity.y;
        }

        self.x += self.velocity.x;
        self.y += self.velocity.y;

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

    var rad, x, y, a = 0;

    for (var i = 0; i < settings.circles; i++) {
        rad = rand(settings.size[0], settings.size[1]);
        x = rand(rad, canvas.width - rad);
        y = rand(rad, canvas.height - rad);

        for (var c = 0; c < circles.length; c++) {
            a++;
            if (Collision.isCollision(x, y, rad, circles[c].x, circles[c].y, circles[c].rad)) {
                x = rand(rad, canvas.width - rad);
                y = rand(rad, canvas.height - rad);

                c = -1
            }
            if (a > 30000) {
                console.warn("initCircles aborted to avoid endless-loop: There are to many circles for this window-size.");
                return;
            }
        }

        circles.push(new Circle(
            x,
            y,
            rad,
            (Math.random() - 0.5) * rand(1, 4),
            (Math.random() - 0.5) * rand(1, 4)
        ).draw());
    }
}



/**
 * Start animation
 */
function animate() {
    requestAnimationFrame(animate);

    for (var i in circles) {
        circles[i].update(circles);
    }
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


