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
    nodeBorderWidth: 2,
    nodeFont: "bold 12px serif",
    nodeFontColor: "black",

    linkColor: "#333",

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
      ctx.lineWidth = settings.nodeBorderWidth;
      ctx.strokeStyle = settings.nodeBorderColor;
      ctx.stroke();
    } else {

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = node.color ? node.color:settings.nodeColor;
      ctx.fill();
      ctx.lineWidth = settings.nodeBorderWidth;
      ctx.strokeStyle = settings.nodeBorderColor;
      ctx.stroke();
    }

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
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.lineWidth = link.value;
    if (link.color) ctx.strokeStyle = link.color;
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
      showModal(node)
    }
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
