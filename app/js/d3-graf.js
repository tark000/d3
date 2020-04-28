if(document.getElementById("my-graf")) {
  function findIntersect (origin, radius, otherLineEndPoint) {
    var v = otherLineEndPoint.subtract(origin);
    var lineLength = v.length();
    if (lineLength === 0) throw new Error("Length has to be positive");
    v = v.normalize();
    return origin.add(v.multiplyScalar(radius));
  }

  function Vector (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Vector.prototype.add = function (vector) {
      return new Vector(this.x + vector.x, this.y + vector.y);
  };

  Vector.prototype.subtract = function (vector) {
      return new Vector(this.x - vector.x, this.y - vector.y);
  };

  Vector.prototype.multiply = function (vector) {
      return new Vector(this.x * vector.x, this.y * vector.y);
  };

  Vector.prototype.multiplyScalar = function (scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
  };

  Vector.prototype.divide = function (vector) {
      return new Vector(this.x / vector.x, this.y / vector.y);
  };

  Vector.prototype.divideScalar = function (scalar) {
      return new Vector(this.x / scalar, this.y / scalar);
  };

  Vector.prototype.length = function () {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  };

  Vector.prototype.normalize = function () {
      return this.divideScalar(this.length());
  };


  function Line(x1,y1,x2,y2){
        this.x1=x1;
        this.y1=y1;
        this.x2=x2;
        this.y2=y2;
    }
    Line.prototype.drawWithArrowheads=function(ctx, direction){

        // arbitrary styling
        // ctx.strokeStyle="blue";
        // ctx.fillStyle="blue";
        // ctx.lineWidth=1;

        // draw the line
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x2,this.y2);
        ctx.stroke();
        if (direction === 'from') {
          var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
          startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;

          this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
        } else if (direction === 'to') {
          var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
          endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
          this.drawArrowhead(ctx,this.x2,this.y2,endRadians);
        } else if (direction === 'from, to') {
          // draw the starting arrowhead
          var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
          startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
          this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
          // draw the ending arrowhead
          var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
          endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
          this.drawArrowhead(ctx,this.x2,this.y2, endRadians);
        } else {
        }

        // // draw the starting arrowhead
        // var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
        // startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
        // this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
        // // draw the ending arrowhead
        // var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
        // endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
        // this.drawArrowhead(ctx,this.x2,this.y2,endRadians);


    }
    Line.prototype.drawArrowhead=function(ctx,x,y,radians){
      radians = radians >= 3.14 ? 0.02 : radians;
      radians = radians == 0 ? 3.14 : radians;
      ctx.save();
      ctx.beginPath();
      ctx.translate(x,y);
      ctx.rotate(radians);
      ctx.moveTo(0,0);
      ctx.lineTo(5,20);
      ctx.lineTo(-5,20);
      ctx.closePath();
      ctx.restore();
      ctx.fill();
    }



  let settings = {
    canvasId: '#my-graf',
    canvasWidth: +document.querySelector('.graf-wrapper').offsetWidth,
    canvasHeight: +document.querySelector('.graf-wrapper').offsetHeight,
    canvasBackground: 'rgb(245, 255, 245)',

    nodeColor: "#888",
    nodeBorder: "#000",
    nodeRadius: "50",
    nodeBorderColor: "#000",
    nodeBorderWidth: 3,
    nodeFont: "bold 12px serif",
    nodeFontColor: "black",

    linkColor: "#333",
    linkValue: 3,

    // more info block
    infoX: 0,
    infoY: 20,
    infoColor: 'red',
    nodeinfoBorderWidth: 1,
    nodeinfoBackground: "#fff",

    modalWidth: 500,
    modalHeight: 200
  }


  let graph = {
    nodes: [
      { country: "Canada", description: "Long text Canada <a href='/'>home page</a>" , width: 100, height: 50, x: 1000, y: 100, type: "rectangle"},
      { country: "Yemen", description: "Long text Yemen <h2>some text</h2>", x: 100, y: 70 },
      { country: "Solomon Islands", description: "Long text Solomon Islands <h2>some text</h2>", radius: 30 , x: 300, y: 100},
      { country: "Vietnam", description: "Long text Vietnam <h2>some text</h2>", radius: 30, x: 200, y: 500 },
      { country: "Brazil", description: "Long text Brazil <h2>some text</h2>", radius: 40, color: 'yellow', x: 100, y: 250 },
      { country: "Taiwan", description: "Long text Taiwan <h2>some text</h2>", radius: 20, color: 'red', x: 1500, y: 400 },
    ],
    links: [
      { source: "Canada", target: "Yemen", direction: 'from' },
      { source: "Canada", target: "Solomon Islands", direction: 'to' },
      { source: "Yemen", target: "Vietnam", direction: 'from, to' },
      { source: "Yemen", target: "Brazil"},
      { source: "Canada", target: "Brazil"},
      { source: "Vietnam", target: "Taiwan", color: '#00ffff' },
      { source: "Brazil", target: "Taiwan", value: 5, color: 'red' },
    ],
  }
  // node properties
  // country
  // description
  // width
  // height
  // radius
  // x
  // y
  // type
  // link properties
  // source
  // target
  // direction
  // color
  // value

  let canvas = d3
    .select(settings.canvasId)
    .attr('width', settings.canvasWidth)
    .attr('height', settings.canvasHeight)
    .style('background', settings.canvasBackground);

  let ctx = canvas.node().getContext('2d');
  let scaleColor = d3.scaleOrdinal(d3.schemeCategory10);
  let transform = d3.zoomIdentity;


  let update = () => {
    // console.log('update');

    ctx.save();

    ctx.clearRect(0, 0, settings.canvasWidth, settings.canvasHeight);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    graph.nodes.forEach(setNodeSize);
    // Draw the links
    graph.links.forEach(drawLink);
    // Draw the nodes
    graph.nodes.forEach(drawNode)
    ctx.restore();
  };

  let setNodeSize = (node, i) => {
    let width = ctx.measureText(node.country).width;
    let height = ctx.measureText("w").width;
    let nodeRadius = node.radius || settings.nodeRadius;
    node.radius = nodeRadius < width/2 ? (width/2 + 15) : nodeRadius;
  }

  let drawNode = (node, i) => {
    let width = ctx.measureText(node.country).width;
    let height = ctx.measureText("w").width;
    // console.log(node.country, nodeRadius, width/2, radius);
    ctx.beginPath();
    ctx.lineWidth = settings.nodeBorderWidth;
    ctx.fillStyle = node.color ? node.color : settings.nodeColor;
    if (node.type === 'rectangle') {
      ctx.rect(node.x - node.width/2, node.y - node.height/2, node.width, node.height);
    } else {
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, true);
    }
    ctx.strokeStyle = settings.nodeBorderColor;
    ctx.fill();
    if (node.active) ctx.stroke();

    // add text
    ctx.font = settings.nodeFont;
    ctx.fillStyle = settings.nodeFontColor;
    ctx.textAlign = "center";
    ctx.fillText(node.country, node.x ,node.y);

    // add more info
    ctx.beginPath();
    ctx.arc(node.x + settings.infoX , node.y + settings.infoY, 10, 0, 2 * Math.PI, true);
    ctx.fillStyle = settings.nodeinfoBackground;
    ctx.fill();
    ctx.lineWidth = settings.nodeinfoBorderWidth;
    ctx.strokeStyle = settings.infoColor;
    ctx.stroke();

    ctx.font = settings.nodeFont;
    ctx.fillStyle = settings.infoColor;
    ctx.textAlign = "center";
    ctx.fillText('i', node.x + settings.infoX , node.y + settings.infoY + height/2);
  }

  let drawLink = (link, i) => {
    let source = getNode(link.source);
    let target = getNode(link.target);

    let pointCenter1 = new Vector(source.x, source.y)
    let pointCenter2 = new Vector(target.x, target.y)
    let point1 = findIntersect(pointCenter1, source.radius || source.width, pointCenter2)
    let point2 = findIntersect(pointCenter2, target.radius || target.width, pointCenter1)
    ctx.beginPath();
    // ctx.moveTo(point1.x, point1.y);
    // ctx.lineTo(point2.x, point2.y);
    let line=new Line(point1.x, point1.y,point2.x, point2.y);
    // draw the line
    ctx.lineWidth = link.value || settings.linkValue;
    if (link.color) ctx.strokeStyle = link.color;
    line.drawWithArrowheads(ctx, link.direction);

    // if (link.direction === 'from') {
    //   drawLineWithArrows(source.x,source.y,target.x,target.y,5,8,true,false);
    // } else if (link.direction === 'to') {
    //   drawLineWithArrows(source.x,source.y,target.x,target.y,5,8,false,true);
    // } else if (link.direction === 'from, to') {
    //   drawLineWithArrows(source.x,source.y,target.x,target.y,5,8,true,false);
    //
    // } else {
    // }
    ctx.stroke();

  }

  let getNode = (link) => graph.nodes.find(node=> node.country === link)
  // zoom
  let zoomed = () => {
    transform = d3.event.transform;
    update();
  }

  let dbclick = () => {
    const node = getSubject ();
    if (!node) return;
    if (node.description) {
      resetActiveNode();
      showModal(node)
    }
  }

  let oneClick = () => {
    resetActiveNode();
    const node = getSubject();
    if (node) {
      node.active = true;
    }
    update();
  }

  let resetActiveNode = () => {
    graph.nodes.forEach((node)=>node.active = false);
  }

  let showModal = (node) => {
    modal.style.display = "block";
    let x = transform.applyX(node.x);
    let y = transform.applyY(node.y);
    let left = x - settings.modalWidth/2 > 0 ? x - settings.modalWidth/2 : 0;
    let top = y - settings.modalHeight/2 > 0 ? y - settings.modalHeight/2 : 0;
    let content = document.querySelector('.modal-content');
    content.style.left = left + 'px';
    content.style.top = top + 'px';
    content.style.width = settings.modalWidth + 'px';
    content.style.height = settings.modalHeight + 'px';
    modalContent.innerHTML = '<h2>' + node.country + '</h2><p>' + node.description+ '</p>';
  }

  let getSubject = () => {
    var i,
    x = transform.invertX(d3.event.x),
    y = transform.invertY(d3.event.y),
    dx,
    dy;
    for (i = graph.nodes.length - 1; i >= 0; --i) {
      node = graph.nodes[i];
      dx = x - node.x;
      dy = y - node.y;
      ix = dx - settings.infoX;
      iy = dy - settings.infoY;
      if ((ix * ix + iy * iy < 100)) {
        showModal(node)
        return false;
      }
      if (node.type == "rectangle") {
        if (dx * dx < node.width/2 * node.width/2 && dy * dy < node.height/2 * node.height/2 ) {
          return node;
        }
      }
      else  {
        if ((dx * dx + dy * dy < node.radius * node.radius)) {
          return node;
        }
      }
    }
  }

  let dragsubject = ()=> {
    let node = getSubject ();
    if(node) {
      node.x =  transform.applyX(node.x);
      node.y = transform.applyY(node.y);
      return node;
    }
    // var i,
    // x = transform.invertX(d3.event.x),
    // y = transform.invertY(d3.event.y),
    // dx,
    // dy;
    // for (i = graph.nodes.length - 1; i >= 0; --i) {
    //   node = graph.nodes[i];
    //   dx = x - node.x;
    //   dy = y - node.y;
    //   let radius = node.radius || settings.nodeRadius;
    //   if (dx * dx + dy * dy < radius * radius) {
    //
    //     node.x =  transform.applyX(node.x);
    //     node.y = transform.applyY(node.y);
    //     return node;
    //   }
    // }
  }


  let  dragstarted = () => {
    resetActiveNode();
    d3.event.subject.active = true;
    d3.event.subject.x = transform.invertX(d3.event.x);
    d3.event.subject.y = transform.invertY(d3.event.y);
  }

  let  dragged = () => {
    d3.event.subject.x = transform.invertX(d3.event.x);
    d3.event.subject.y = transform.invertY(d3.event.y);
    update();
  }

  let dragended = () => {
    d3.event.subject.active = false;
    // update();
  }

  update();




  // x0,y0: the line's starting point
  // x1,y1: the line's ending point
  // width: the distance the arrowhead perpendicularly extends away from the line
  // height: the distance the arrowhead extends backward from the endpoint
  // arrowStart: true/false directing to draw arrowhead at the line's starting point
  // arrowEnd: true/false directing to draw arrowhead at the line's ending point

  // function drawLineWithArrows(x0,y0,x1,y1,aWidth,aLength,arrowStart,arrowEnd){
  //     var dx=x1-x0;
  //     var dy=y1-y0;
  //     var angle=Math.atan2(dy,dx);
  //     var length=Math.sqrt(dx*dx+dy*dy);
  //     //
  //     ctx.translate(x0,y0);
  //     ctx.rotate(angle);
  //     ctx.beginPath();
  //     ctx.moveTo(0,0);
  //     ctx.lineTo(length,0);
  //     if(arrowStart){
  //         ctx.moveTo(aLength,-aWidth);
  //         ctx.lineTo(0,0);
  //         ctx.lineTo(aLength,aWidth);
  //     }
  //     if(arrowEnd){
  //         ctx.moveTo(length-aLength,-aWidth);
  //         ctx.lineTo(length,0);
  //         ctx.lineTo(length-aLength,aWidth);
  //     }
  //     ctx.stroke();
  //     ctx.setTransform(1,0,0,1,0,0);
  // }


  canvas
    .call(d3.drag()
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .on("dblclick", dbclick)
      .on("click", oneClick)
    .call(d3.zoom().scaleExtent([0.4, 8]).on("zoom", zoomed))
    .on("dblclick.zoom", null);



  document.getElementById("savePosition").onclick = function(){
    alert("nodes positions: " + JSON.stringify(graph.nodes));
  }


  // modal
  // Get the modal
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    closeModal();
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal()
    }
  }
  function closeModal() {
    modalContent.innerHTML = '';
    modal.style.display = "none";
  }




}
