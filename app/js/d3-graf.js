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

    // draw the line
    ctx.beginPath();
    ctx.moveTo(this.x1,this.y1);
    ctx.lineTo(this.x2,this.y2);
    ctx.stroke();
    var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
    console.log('startRadians', startRadians)
    var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
    console.log('endRadians', endRadians)

    if (direction === 'reverse') {
      this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
    } else if (direction === 'forward') {
      this.drawArrowhead(ctx,this.x2,this.y2,endRadians);
    } else if (direction === 'both') {
      // draw the starting arrowhead
      this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
      this.drawArrowhead(ctx,this.x2,this.y2, endRadians);
      // draw the ending arrowhead
    }
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

  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
  }

  let settings = {
    canvasId: '#my-graf',
    canvasWidth: +document.querySelector('.graf-wrapper').offsetWidth,
    canvasHeight: +document.querySelector('.graf-wrapper').offsetHeight,
    canvasBackground: 'rgb(245, 255, 245)',

    nodeColor: "#aaa",
    nodeBorder: "#000",
    nodeRadius: "50",
    nodeBorderColor: "#000",
    nodeBorderWidth: 3,
    nodeFont: "bold 14px Roboto",
    nodeFontColor: "black",
    rectangleRadius: 5,
    rectangleProportion: 0.75, // rectangle height = size * rectangleProportion

    edgeColor: "#333",
    edgeValue: 2,

    // more info block
    infoX: 0,
    infoY: 23,
    infoColor: '#909090',
    nodeinfoBorderWidth: 1,
    nodeinfoBackground: "#fff",

    modalWidth: 500,
    modalHeight: 200,

    size: {
      small: 80,
      medium: 140,
      large: 200
    },
    edgeWeight: {
      light: 1,
      standard: 2,
      heavy: 4,

    }
  }

  let getSize = (node, property) => {
    let value = settings.size[node.size];
    if (property === 'radius') {
      return value/2;
    } else if (property === 'width') {
      return value;
    } else if (property === 'height') {
      if (node.shape === 'rectangle') {
        return value * settings.rectangleProportion;
      } else {
        return value;
      }
    }
  }

  let graph = {
    nodes: [
      {id:1, title: "Canada", description: "Long text Canada <a href='/'>home page</a>" , position_x:1000, position_y:70, x: 1000, y: 70, shape: 'rectangle', size: 'medium'},
      {id:2, title: "Yemen", description: "Long text Yemen <h2>some text</h2>", position_x:1000, position_y:70, x: 242, y: 70, shape: 'circle', size: 'medium' },
      {id:3, title: "Solomon Islands", description: "Long text Solomon Islands <h2>some text</h2>", position_x:1000, position_y:70, x: 1345, y: 150, shape: 'circle', size: 'medium'},
      {id:4, title: "Vietnam", description: "Long text Vietnam <h2>some text</h2>", position_x:1000, position_y:70, x: 242, y: 424, shape: 'circle', size: 'medium' },
      {id:5, title: "Brazil", description: "Long text Brazil <h2>some text</h2>", position_x:1000, position_y:70, x: 600, y: 250, shape: 'circle', size: 'medium' },
      {id:6, title: "Taiwan", description: "Long text Taiwan <h2>some text</h2>", color: '#ccc', position_x:1000, position_y:70, x: 1500, y: 424, shape: 'circle', size: 'medium' },
    ],
    edges: [
      { from: 1, to: 2, direction: 'forward', weight: 'standard'},
      { from: 1, to: 3, direction: 'reverse', weight: 'standard'},
      { from: 2, to: 4, direction: 'both', weight: 'standard'},
      { from: 2, to: 5, direction: 'none', weight: 'standard'},
      { from: 1, to: 5, direction: 'none', weight: 'standard'},
      { from: 4, to: 6, direction: 'none', weight: 'standard'},
      { from: 5, to: 6, direction: 'none', weight: 'standard'},
    ],
  }
  console.log(getSize(graph.nodes[0], 'width'), getSize(graph.nodes[0], 'height'), getSize(graph.nodes[0], 'radius'));
  // node properties
  // title
  // description
  // width
  // height
  // radius
  // x
  // y
  // type
  // edge properties
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
    document.getElementById("nodesContent").innerHTML = '';
    ctx.save();

    ctx.clearRect(0, 0, settings.canvasWidth, settings.canvasHeight);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Draw the edges
    graph.edges.forEach(drawEdge);
    // Draw the nodes
    graph.nodes.forEach(drawNode)
    ctx.restore();
  };

  let addHtmlNodesContent = (node) => {
    let contentWidth = getSize(node, 'width');
    let x = transform.applyX(node.x);
    let y = transform.applyY(node.y);
    document.getElementById("nodesContent").innerHTML += '<div class="node-content" draggable="true" data-node="' + node.id + '" style="top: ' + y + 'px; left: ' + (x - contentWidth/2) + 'px; width: ' + contentWidth + 'px;"><span>' + node.title + '</span></div>';
  }
  let isMove = false;
  let addMouseListener = () => {
    // document.querySelectorAll('.node-content').forEach((element)=>{
    //   element.addEventListener('mousedown', function(event) {
    //     console.log('mousedown')
    //     let node = getNode(event.currentTarget.dataset.node);
    //     resetActiveNode();
    //     node.active = true;
    //     isMove = true;
    //     update();
    //   })
    //   element.addEventListener('mouseup', e => {
    //     if (isMove === true) {
    //       console.log('mouseup')
    //       isMove = false;
    //     }
    //   });
    //
    // })
  };
  // window.addEventListener('mousedown', e => {
  //   if (isMove === true) {
  //     console.log('mouseup')
  //     isMove = false;
  //   }
  // });
  // window.addEventListener('mousedown', function(e) {
  //   console.log('mousedown')
  //   if (e.target.closest('.node-content')) {
  //     let node = getNode(e.target.closest('.node-content').dataset.node);
  //     if (node) {
  //       resetActiveNode();
  //       node.active = true;
  //       isMove = true;
  //       update();
  //     }
  //   }
  // })
  // window.addEventListener('mousemove', e => {
  // // document.querySelector(settings.canvasId).addEventListener('mousemove', e => {
  //   // console.log(e.x,e.y, e)
  //   if (isMove === true) {
  //     let node = getActiveNode();
  //     if (node && e.target.id == "my-graf") {
  //       // console.log(e.offsetX,e.offsetY)
  //       node.x = transform.invertX(e.x);
  //       node.y = transform.invertY(e.y);
  //       update();
  //     }
  //   }
  // });
  // window.addEventListener('mouseup', e => {
  //   if (isMove === true) {
  //     console.log('mouseup')
  //     isMove = false;
  //   }
  // });


  let drawNode = (node, i) => {
    let width = ctx.measureText(node.title).width;
    let height = ctx.measureText("w").width;
    // console.log(node.title, nodeRadius, width/2, radius);
    ctx.beginPath();
    ctx.lineWidth = settings.nodeBorderWidth;
    ctx.fillStyle = node.color ? node.color : settings.nodeColor;
    if (node.type === 'rectangle') {
      // ctx.rect(node.x - getSize(node, 'radius'), node.y - getSize(node, 'height')/2, getSize(node, 'width'), getSize(node, 'height'));
      ctx.roundRect(node.x - getSize(node, 'radius'), node.y - getSize(node, 'height')/2, getSize(node, 'width'), getSize(node, 'height'), settings.rectangleRadius);
    } else {
      ctx.arc(node.x, node.y, getSize(node, 'radius'), 0, 2 * Math.PI, true);
    }
    ctx.strokeStyle = settings.nodeBorderColor;
    ctx.fill();
    if (node.active) ctx.stroke();

    // add text
    ctx.font = settings.nodeFont;
    ctx.fillStyle = settings.nodeFontColor;
    ctx.textAlign = "center";
    ctx.fillText(node.title, node.x ,node.y);
    // addHtmlNodesContent(node);
    // addMouseListener();

    // add more info
    ctx.beginPath();
    ctx.arc(node.x + settings.infoX , node.y + settings.infoY, 10, 0, 2 * Math.PI, true);
    ctx.fillStyle = settings.nodeinfoBackground;
    ctx.fill();
    ctx.lineWidth = settings.nodeinfoBorderWidth;
    ctx.strokeStyle = settings.infoColor;
    // ctx.stroke();

    ctx.font = settings.nodeFont;
    ctx.fillStyle = settings.infoColor;
    ctx.textAlign = "center";
    ctx.fillText('i', node.x + settings.infoX , node.y + settings.infoY + height/2);
  }

  let drawEdge = (edge, i) => {
    let source = getNode(edge.from);
    let target = getNode(edge.to);

    let pointCenter1 = new Vector(source.x, source.y)
    let pointCenter2 = new Vector(target.x, target.y)
    let point1 = findIntersect(pointCenter1, getSize(source, 'radius'), pointCenter2)
    let point2 = findIntersect(pointCenter2, getSize(target, 'radius'), pointCenter1)
    ctx.beginPath();
    // ctx.moveTo(point1.x, point1.y);
    // ctx.lineTo(point2.x, point2.y);
    let line=new Line(point1.x, point1.y,point2.x, point2.y);
    // draw the line
    ctx.lineWidth = settings.edgeWeight[edge.weight];
    if (edge.color) ctx.strokeStyle = edge.color;
    line.drawWithArrowheads(ctx, edge.direction);
    ctx.stroke();

  }

  let getNode = (value) => graph.nodes.find(node=> node.id === value)
  let getActiveNode = (value) => graph.nodes.find(node=> node.active === true)
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
    modalContent.innerHTML = '<h2>' + node.title + '</h2><p>' + node.description+ '</p>';
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
      if (node.shape == "rectangle") {
        if (dx * dx < getSize(node, 'radius') * getSize(node, 'radius') && dy * dy < getSize(node, 'height')/2 * getSize(node, 'height')/2 ) {
          return node;
        }
      }
      else  {
        if ((dx * dx + dy * dy < getSize(node, 'radius') * getSize(node, 'radius'))) {
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
  }

  update();

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
