if(document.getElementById("my-graf")) {
  let settings = {
    canvasId: '#my-graf',
    canvasWidth: +document.querySelector('.graf-wrapper').offsetWidth,
    canvasHeight: +document.querySelector('.graf-wrapper').offsetHeight,
    canvasBackground: 'rgb(245, 255, 245)',

    nodeColor: "#fff",
    nodeBorder: "#000",
    nodeRadius: "50",
    nodeBorderColor: "#aaa",
    nodeFont: "bold 12px serif",
    nodeFontColor: "black",

    linkColor: "#333"
  }


  let graph = {
    nodes: [
      { country: "Canada", description: "Long text Canada" , width: 100, height: 50, x: 1000, y: 100, type: "rectangle"},
      { country: "Yemen", description: "Long text Yemen", x: 100, y: 70 },
      { country: "Solomon Islands", description: "Long text Solomon Islands", radius: 30 , x: 300, y: 100},
      { country: "Vietnam", description: "Long text Vietnam", radius: 30, x: 200, y: 500 },
      { country: "Brazil", description: "Long text Brazil", radius: 40, color: 'yellow', x: 100, y: 250 },
      { country: "Taiwan", description: "Long text Taiwan", radius: 20, color: 'red', x: 1500, y: 400 },
    ],
    links: [
      { source: "Canada", target: "Yemen", distance: 190, value: 1 },
      { source: "Canada", target: "Solomon Islands", distance: 100, value: 1 },
      { source: "Yemen", target: "Vietnam", distance: 180, value: 1 },
      { source: "Yemen", target: "Brazil", distance: 160, value: 5 },
      { source: "Canada", target: "Brazil", distance: 130, value: 3, color: 'blue' },
      { source: "Vietnam", target: "Taiwan", distance: 100, value: 4, color: '#00ffff' },
      { source: "Brazil", target: "Taiwan", distance: 300, value: 3, color: 'red' },
    ],
  }

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

    // Draw the links
    graph.links.forEach(drawLink);
      // Draw the nodes
    graph.nodes.forEach(drawNode)
    ctx.restore();
  };

  let drawNode = (node, i) => {
    let width = ctx.measureText(node.country).width;
    let height = ctx.measureText("w").width;
    let nodeRadius = node.radius || settings.nodeRadius;
    node.radius = nodeRadius < width/2 ? (width/2 + 15) : nodeRadius;
    // console.log(node.country, nodeRadius, width/2, radius);
    if (node.type === 'rectangle') {
      ctx.beginPath();
      ctx.rect(node.x - node.width/2, node.y - node.height/2, node.width, node.height);
      ctx.fillStyle = node.color ? node.color : settings.nodeColor;
      ctx.fill();
      ctx.strokeStyle = settings.nodeBorderColor;
      ctx.stroke();
    } else {

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = node.color ? node.color:settings.nodeColor;
      ctx.fill();
      ctx.strokeStyle = settings.nodeBorderColor;
      ctx.stroke();
    }

    // add text
    ctx.font = settings.nodeFont;
    ctx.fillStyle = settings.nodeFontColor;
    ctx.textAlign = "center";

    ctx.fillText(node.country, node.x ,node.y);
  }

  let drawLink = (link, i) => {
    let source = getNode(link.source);
    let target = getNode(link.target);
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.lineWidth = link.value;
    if (link.color) ctx.strokeStyle = link.color;
    ctx.stroke();
    drawArrowhead(source, target, target.radius)

  }

  function drawArrowhead(from, to, radius, radius) {
  	var x_center = to.x;
  	var y_center = to.y;

  	var angle;
  	var x;
  	var y;

  	ctx.beginPath();

  	angle = Math.atan2(to.y - from.y, to.x - from.x)
  	x = radius * Math.cos(angle) + x_center;
  	y = radius * Math.sin(angle) + y_center;

  	ctx.moveTo(x, y);

  	angle += (1.0/3.0) * (2 * Math.PI)
  	x = radius * Math.cos(angle) + x_center;
  	y = radius * Math.sin(angle) + y_center;

  	ctx.lineTo(x, y);

  	angle += (1.0/3.0) * (2 * Math.PI)
  	x = radius *Math.cos(angle) + x_center;
  	y = radius *Math.sin(angle) + y_center;

  	ctx.lineTo(x, y);

  	ctx.closePath();

  	ctx.fill();
  }

  let getNode = (link) => graph.nodes.find(node=> node.country === link)

  update();

  canvas
    .call(d3.drag()
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .on("dblclick", dbclick)
    .call(d3.zoom().scaleExtent([0.4, 8]).on("zoom", zoomed))
    .on("dblclick.zoom", null);



  // zoom
  function zoomed() {
    transform = d3.event.transform;
    update();
  }

  function dbclick() {
    const node = getSubject ();
    if (!node) return;
    const description = node.description;
    if (description) {
      modal.style.display = "block";
      modalContent.innerHTML = '<h2>' + node.country + '</h2><p>' + node.description+ '</p>';
    }
  }

  function getSubject () {
    var i,
    x = transform.invertX(d3.event.x),
    y = transform.invertY(d3.event.y),
    dx,
    dy;
    for (i = graph.nodes.length - 1; i >= 0; --i) {
      node = graph.nodes[i];
      dx = x - node.x;
      dy = y - node.y;
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

  function dragsubject() {
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


  function dragstarted() {
    d3.event.subject.active = true;
    d3.event.subject.x = transform.invertX(d3.event.x);
    d3.event.subject.y = transform.invertY(d3.event.y);
  }

  function dragged() {
    d3.event.subject.x = transform.invertX(d3.event.x);
    d3.event.subject.y = transform.invertY(d3.event.y);
    update();
  }

  function dragended() {
    d3.event.subject.active = false;
  }



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
