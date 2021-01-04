/*
  Up => 38
  Right => 39
  Down => 40
  Left => 37

*/
enum Directions{
  Left= 37,
  Up,
  Right,
  Down
}

var foods : Food[] = [];

class Random{
  static get(min : number, max : number){
    return Math.round(Math.random() * (max-min)) + min;
  }
}

class Food{
  width : number = 10;
  height : number = 10;
  constructor(public x : number, public y : number){
    
  }

  draw(ctx : CanvasRenderingContext2D){
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  static generate(canvas : HTMLCanvasElement){
    return new Food(Random.get(0, canvas.width), Random.get(0, canvas.height));
  }
}

class Square{
  private back : Square = null;

  constructor(public x : number, public y : number, public width : number, public height : number, private ctx : CanvasRenderingContext2D, private canvas : HTMLCanvasElement){
      
  }

  draw() : void{
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    if(this.hasBack()){
      this.back.draw();
    }
  }

  add() : any{
    if(this.hasBack())return this.back.add();
    this.back = new Square(this.x, this.y, this.width, this.height, this.ctx, this.canvas);
  }

  hit(head : Square, second : boolean = false) : boolean{
    if(this == head && !this.hasBack()) return false;

    if(this == head) return this.back.hit(head, true);

    if(second && !this.hasBack()) return false;
    
    if(second) return this.back.hit(head);

    if(this.hasBack()){
      return squareHit(this, head) || this.back.hit(head);
    }

    return squareHit(this, head);
  }

  hitBorder(){
    return (this.x > this.canvas.width-this.width || this.x < 0 || this.y < 0 || this.y > this.canvas.height-this.height)
  }

  hasBack(){
    return this.back !== null;
  }

  copy(){
    if(this.hasBack()){
      this.back.copy();
      this.back.x = this.x;
      this.back.y = this.y;
    }
  }

  right(){
    this.copy();
    this.x += 10;
  }

  left(){
    this.copy();
    this.x -= 10;
  }

  up(){
    this.copy();
    this.y -= 10;
  }

  down(){
    this.copy();
    this.y += 10;
  }
}




class Snake{

  private canvas : HTMLCanvasElement;
  private ctx : CanvasRenderingContext2D;
  public head : Square;
  private direction : number = Random.get(40, 37);
  
  private frameUpdate : number = setInterval(()=>{
    this.move();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.head.draw();
    drawFood();

    if(this.dead()){
      console.log("fin");
      clearInterval(this.frameUpdate);
    }
  }, 1000/2);

  private foodUpdate : number = setInterval(()=>{
    const food = Food.generate(this.canvas);
    foods.push(food)
    setTimeout(function(){
      removeFromFoods(food);
    }, 30000)
  }, 7000)

  constructor(canvasId = '#canvas'){
    this.canvas = <HTMLCanvasElement>document.querySelector(canvasId);
    this.ctx = this.canvas.getContext('2d');
    console.log(this.direction);
    this.head = new Square(
      Random.get(this.canvas.width - 80, 40),
      Random.get(this.canvas.height -80, 40),
      10, 10, this.ctx, this.canvas);
    for(let i = 0; i < 5; i++)
      this.head.add();

  }

  eat(){
    this.head.add();
  }

  right(){
    this.direction != Directions.Left ? this.direction = Directions.Right : false;
  }

  left(){
    this.direction != Directions.Right ? this.direction = Directions.Left : false;
  }

  up(){
    this.direction != Directions.Down ? this.direction = Directions.Up : false;
  }

  down(){
    this.direction != Directions.Up ? this.direction = Directions.Down : false;
  }

  move(){
    if(this.direction == Directions.Left) this.head.left();
    if(this.direction == Directions.Up) this.head.up();
    if(this.direction == Directions.Right) this.head.right();
    if(this.direction == Directions.Down) this.head.down();
  }

  dead(){
    return this.head.hit(this.head) || this.head.hitBorder();
  }


}


function drawFood(){
  foods.forEach((food)=>{
    if(food !== undefined){
      food.draw((<HTMLCanvasElement>document.querySelector('#canvas')).getContext('2d'));
    
      if(hit(food, snake.head)){
        removeFromFoods(food);
        snake.eat();
      }
    }

  })
}

function removeFromFoods(food : Food){
  foods = foods.filter(function(f){
    return f != food;
  })
}

function squareHit(sqr1 : Square, sqr2 : Square){
  return sqr1.x == sqr2.x && sqr1.y == sqr2.y;
}

function hit(a : {x : number, y : number, width : number, height : number}, b : {x : number, y : number, width : number, height : number}){
  let hit : boolean = false;
  if(b.x + b.width >= a.x && b.x < a.x + a.width){
    if(b.y + b.height >= a.y && b.y < a.y + a.height){
      hit = true;
    }
  }

  if(b.x <= a.x && b.x + b.width >= a.x + a.width){
    if(b.y <= a.y && b.y + b.height >= a.y + a.height){
      hit = true;
    }
  }  

  if(a.x <= b.x && a.x + a.width >= b.x + b.width){
    if(a.y <= b.y && a.y + a.height >= b.y + b.height){
      hit = true;
    }
  }

  return hit;
}


let snake = new Snake();

window.addEventListener('keydown', function(ev){
  if(ev.keyCode == Directions.Left) return snake.left();
  if(ev.keyCode == Directions.Up) return snake.up();
  if(ev.keyCode == Directions.Right) return snake.right();
  if(ev.keyCode == Directions.Down) return snake.down();
})

