import {Behavior} from "behaviors";
import P5Behavior from "p5beh";
import * as Sensor from "sensors";
import * as Display from "display";
import Floor from "floor";

var pb = new P5Behavior();
pb.setup = function(p) {
  this.makeRandomFunction = function() {

  };
  this.functionToMatch = this.makeRandomFunction();

}
pb.draw = function(floor, p) {

  this.clear();

  floor.users = floor.users.sort(function(user1, user2) {
    return user1.x - user2.x;
  });
  for(var i = 1; i < floor.users.length; i++) {
    if(floor.users[i].x === floor.users[i-1].x) {
      floor.users[i].x++;
    }
  }

  // solving matrix equation: m2*m4=m1

  var m1 = [];
  var m2 = [];
  for(var user of floor.users) {
    m1.push(user.y);
    var m2Row = [];
    for(var i = 0; i < floor.users.length; i++) {
      m2Row.push(Math.pow(user.x, floor.users.length-i-1));
    }
    m2.push(m2Row);
  }

  // matrix invert code courtesy of http://blog.acipo.com/matrix-inversion-in-javascript/ and minified with https://jscompress.com/
  function matrix_invert(r){if(r.length===r[0].length){var f=0,n=0,t=0,e=r.length,o=0,i=[],g=[];for(f=0;f<e;f+=1)for(i[i.length]=[],g[g.length]=[],t=0;t<e;t+=1)i[f][t]=f==t?1:0,g[f][t]=r[f][t];for(f=0;f<e;f+=1){if(0==(o=g[f][f])){for(n=f+1;n<e;n+=1)if(0!=g[n][f]){for(t=0;t<e;t++)o=g[f][t],g[f][t]=g[n][t],g[n][t]=o,o=i[f][t],i[f][t]=i[n][t],i[n][t]=o;break}if(0==(o=g[f][f]))return}for(t=0;t<e;t++)g[f][t]=g[f][t]/o,i[f][t]=i[f][t]/o;for(n=0;n<e;n++)if(n!=f)for(o=g[n][f],t=0;t<e;t++)g[n][t]-=o*g[f][t],i[n][t]-=o*i[f][t]}return i}}
  var m3 = matrix_invert(m2);

  var m4 = [];
  for(var i = 0; i < floor.users.length; i++) {
    var rowSum = 0;
    for(var j = 0; j < floor.users.length; j++) {
      rowSum += m3[i][j] * m1[j];
    }
    m4.push(rowSum);
  }

  this.drawingContext.strokeStyle = "white";
  for(var i = 0; i < 576; i++) {
    var y = 0;
    for(var j = 0; j < m4.length; j++) {
      y += m4[j]*Math.pow(i, m4.length-j-1);
    }
    if(i == 0) {
      this.drawingContext.moveTo(i, y);
    } else {
      this.drawingContext.lineTo(i, y);
    }
  }
  this.strokeWeight(5);
  var colors = ["#c0392b","#d35400","#f39c12","#27ae60","#2980b9","#8e44ad","#e74c3c","#e67e22","#f1c40f","#2ecc71","#3498db","#9b59b6"]
  this.drawingContext.strokeStyle = colors[m4.length-2];
  this.drawingContext.stroke();

  var fontSize = 20;
  this.drawingContext.font = "bold" + fontSize + "px Courier New";
  this.textFont("Courier New", fontSize);
  this.textStyle(this.BOLD);
  this.drawingContext.fillStyle = "white";
  var equationString = "y = ";
  for(var i = 0; i < m4.length; i++) {
    equationString += String.fromCharCode(97+i) + (m4.length-i-1 !== 0 ? (m4.length-i-1 !== 1 ? ("x^" + (m4.length-i-1) + " + ") : "x + ") : "");
    this.drawingContext.fillText(String.fromCharCode(97+i) + ": " + m4[i].toExponential(1).replace(/e/, "*10^"), fontSize, 2*fontSize+fontSize*i);
  }
  this.drawingContext.fillText(equationString, fontSize, fontSize);

  for(var user of floor.users) {
    pb.drawUser(user);
  }

}

export const behavior = {
  title: "Line Fitter",
  init: pb.init.bind(pb),
  frameRate: 20,
  maxUsers: 12,
  numGhosts: 2,
  render: pb.render.bind(pb)
}
