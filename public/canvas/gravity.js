var canvas = document.querySelector('#canvas');
var c = canvas.getContext('2d');

c.strokeStyle = 'blue'; //35dc78
c.fillStyle = 'black'; //45cf89
c.lineWidth = 1;

var circles = [];

var settings = {
    circles: 300,
    gravity: 0.7,
    friction: 0.76,
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
 * Circle-class
 * @constructor
 */
function Circle(x, y, rad, dx, dy) {
    var self = this;

    (function() {
        self.x = Math.round(x);
        self.y = Math.round(y);
        self.rad = rad;
        self.dx = dx;
        self.dy = dy;
        self.color = settings.color[rand(0, settings.color.length-1)];
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
        if (self.x + self.rad > canvas.width || self.x < self.rad) {
            self.dx = -self.dx;
        }

        // gravity
        if (self.y + self.rad + self.dy > canvas.height) {
            self.dy = -self.dy * settings.friction;
        } else {
            self.dy += settings.gravity;
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

    for (var i = 0; i < settings.circles; i++) {
        var rad = rand(4, 30);
        circles.push(new Circle(
            rand(rad, canvas.width - rad),
            rand(rad, canvas.height - rad),
            rad,
            rand(-2, 2),
            rand(-2, 2)
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


/**
 * Re-create circles on window-click
 */
window.addEventListener('click', function() {
    initCircles();
});

// START
initCircles();
animate();


