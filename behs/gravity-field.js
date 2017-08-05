import {Behavior} from "behaviors";
import P5Behavior from "p5beh";
import * as Sensor from "sensors";
import * as Display from "display";
import Floor from "floor";

var pb = new P5Behavior();
var dots = [];
pb.setup = function(p) {
  var gridSize = 10;
  for(var i = 0; i < gridSize; i++) {
    for(var j = 0; j < gridSize; j++) {
      dots.push({x: (i+0.5)*(576/gridSize), y: (j+0.5)*(576/gridSize), xVelocity: 0, yVelocity: 0});
    }
  }
}
var distance = function(element1, element2) {
  return Math.sqrt(Math.pow(element1.x - element2.x, 2) + Math.pow(element1.y - element2.y, 2));
};
pb.draw = function(floor, p) {
  this.clear();

  for(var user of floor.users) {
    pb.drawUser(user);
    for(var dot of dots) {
      dot.xVelocity -= 3*(dot.x-user.x)/Math.pow(distance(dot, user), 2);
      dot.yVelocity -= 3*(dot.y-user.y)/Math.pow(distance(dot, user), 2);
    }
  }

  this.drawingContext.fillStyle = "white";
  for(var dot of dots) {
    this.drawingContext.beginPath();
    this.drawingContext.arc(dot.x, dot.y, 5, 0, Math.PI*2);
    this.drawingContext.closePath();
    this.drawingContext.fill();
    dot.x += dot.xVelocity;
    dot.y += dot.yVelocity;
    dot.xVelocity *= 0.99;
    dot.yVelocity *= 0.99;
  }
}

export const behavior = {
  title: "Gravity Field Simulator",
  init: pb.init.bind(pb),
  frameRate: 30,
  numGhosts: 0,
  render: pb.render.bind(pb)
}
