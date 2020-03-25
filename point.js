class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.display();
    }
   display(){
       console.log('hello');
   }
    add (){
      this.x = this.x ? this.x : 1;
      this.y = this.y ? this.y : 2;
      return this.x + this.y;
    }
  }
  const PI = 3.1415926;
  exports.Point = Point;
  exports.PI = PI;