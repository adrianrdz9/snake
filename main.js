var Directions;
(function (Directions) {
    Directions[Directions["Left"] = 37] = "Left";
    Directions[Directions["Up"] = 38] = "Up";
    Directions[Directions["Right"] = 39] = "Right";
    Directions[Directions["Down"] = 40] = "Down";
})(Directions || (Directions = {}));
var foods = [];
class Random {
    static get(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }
}
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
    }
    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    static generate(canvas) {
        return new Food(Random.get(0, canvas.width), Random.get(0, canvas.height));
    }
}
class Square {
    constructor(x, y, width, height, ctx, canvas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.canvas = canvas;
        this.back = null;
    }
    draw() {
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.hasBack()) {
            this.back.draw();
        }
    }
    add() {
        if (this.hasBack())
            return this.back.add();
        this.back = new Square(this.x, this.y, this.width, this.height, this.ctx, this.canvas);
    }
    hit(head, second = false) {
        if (this == head && !this.hasBack())
            return false;
        if (this == head)
            return this.back.hit(head, true);
        if (second && !this.hasBack())
            return false;
        if (second)
            return this.back.hit(head);
        if (this.hasBack()) {
            return squareHit(this, head) || this.back.hit(head);
        }
        return squareHit(this, head);
    }
    hitBorder() {
        return (this.x > this.canvas.width - this.width || this.x < 0 || this.y < 0 || this.y > this.canvas.height - this.height);
    }
    hasBack() {
        return this.back !== null;
    }
    copy() {
        if (this.hasBack()) {
            this.back.copy();
            this.back.x = this.x;
            this.back.y = this.y;
        }
    }
    right() {
        this.copy();
        this.x += 10;
    }
    left() {
        this.copy();
        this.x -= 10;
    }
    up() {
        this.copy();
        this.y -= 10;
    }
    down() {
        this.copy();
        this.y += 10;
    }
}
class Snake {
    constructor(canvasId = '#canvas') {
        this.direction = Random.get(40, 37);
        this.frameUpdate = setInterval(() => {
            this.move();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.head.draw();
            drawFood();
            if (this.dead()) {
                console.log("fin");
                clearInterval(this.frameUpdate);
            }
        }, 1000 / 2);
        this.foodUpdate = setInterval(() => {
            const food = Food.generate(this.canvas);
            foods.push(food);
            setTimeout(function () {
                removeFromFoods(food);
            }, 30000);
        }, 7000);
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        console.log(this.direction);
        this.head = new Square(Random.get(this.canvas.width - 80, 40), Random.get(this.canvas.height - 80, 40), 10, 10, this.ctx, this.canvas);
        for (let i = 0; i < 5; i++)
            this.head.add();
    }
    eat() {
        this.head.add();
    }
    right() {
        this.direction != Directions.Left ? this.direction = Directions.Right : false;
    }
    left() {
        this.direction != Directions.Right ? this.direction = Directions.Left : false;
    }
    up() {
        this.direction != Directions.Down ? this.direction = Directions.Up : false;
    }
    down() {
        this.direction != Directions.Up ? this.direction = Directions.Down : false;
    }
    move() {
        if (this.direction == Directions.Left)
            this.head.left();
        if (this.direction == Directions.Up)
            this.head.up();
        if (this.direction == Directions.Right)
            this.head.right();
        if (this.direction == Directions.Down)
            this.head.down();
    }
    dead() {
        return this.head.hit(this.head) || this.head.hitBorder();
    }
}
function drawFood() {
    foods.forEach((food) => {
        if (food !== undefined) {
            food.draw(document.querySelector('#canvas').getContext('2d'));
            if (hit(food, snake.head)) {
                removeFromFoods(food);
                snake.eat();
            }
        }
    });
}
function removeFromFoods(food) {
    foods = foods.filter(function (f) {
        return f != food;
    });
}
function squareHit(sqr1, sqr2) {
    return sqr1.x == sqr2.x && sqr1.y == sqr2.y;
}
function hit(a, b) {
    let hit = false;
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
        if (b.y + b.height >= a.y && b.y < a.y + a.height) {
            hit = true;
        }
    }
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
            hit = true;
        }
    }
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
            hit = true;
        }
    }
    return hit;
}
let snake = new Snake();
window.addEventListener('keydown', function (ev) {
    if (ev.keyCode == Directions.Left)
        return snake.left();
    if (ev.keyCode == Directions.Up)
        return snake.up();
    if (ev.keyCode == Directions.Right)
        return snake.right();
    if (ev.keyCode == Directions.Down)
        return snake.down();
});
//# sourceMappingURL=main.js.map