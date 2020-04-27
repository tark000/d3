if(document.getElementById("my-graf")) {
  let settings = {
    canvasId: '#my-graf',
    canvasWidth: +document.querySelector('.graf-wrapper').offsetWidth,
    canvasHeight: +document.querySelector('.graf-wrapper').offsetHeight,
    canvasBackground: 'rgb(245, 255, 245)',

    nodeColor: "#fff",
    nodeBorder: "#000",
    nodeRadius: "50",

    linkColor: "#333"
  }


  let graph = {
    nodes: [
      { country: "Canada" , radius: 10, x: 1000, y: 100},
      { country: "Yemen", x: 100, y: 0 },
      { country: "Solomon Islands", radius: 30 , x: 150, y: 100},
      { country: "Vietnam", radius: 30, x: 200, y: 500 },
      { country: "Brazil", radius: 40, color: 'yellow', x: 100, y: 250 },
      { country: "Taiwan", radius: 20, color: 'red', x: 1500, y: 400 },
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
    let radius = nodeRadius < width/2 ? width/2 + 10 : nodeRadius;
    // console.log(node.country, nodeRadius, width/2, radius);

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = node.color ? node.color:"#fff"
    ctx.fill();
    ctx.strokeStyle = '#aaa';
    ctx.stroke();

    // add text
    ctx.font = "bold 12px serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    ctx.fillText(node.country, node.x ,node.y);
  }

  let drawLink = (link, i) => {
    console.log(link);
    let source = getNode(link.source);
    let target = getNode(link.target);
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  }

  let getNode = (link) => graph.nodes.find(node=> node.country === link)

  update();

  canvas
    .call(d3.drag()
      // .container(canvas.node())
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .call(d3.zoom().scaleExtent([0.4, 8]).on("zoom", zoomed));

  // zoom

  function zoomed() {
      // console.log("zooming")
      transform = d3.event.transform;
      update();
    }

  // function dragsubject() {
  //   var i,
  //   x = transform.invertX(d3.event.x),
  //   y = transform.invertY(d3.event.y),
  //   dx,
  //   dy;
  //   for (i = graph.nodes.length - 1; i >= 0; --i) {
  //     node = graph.nodes[i];
  //     dx = x - node.x;
  //     dy = y - node.y;
  //     let radius = node.radius || settings.nodeRadius;
  //     if (dx * dx + dy * dy < radius * radius) {
  //       console.log(node)
  //       node.x =  transform.applyX(node.x);
  //       node.y = transform.applyY(node.y);
  //       // update();
  //       return node;
  //     }
  //   }
  // }

  function dragsubject() {
    var i,
    x = transform.invertX(d3.event.x),
    y = transform.invertY(d3.event.y),
    dx,
    dy;
    for (i = graph.nodes.length - 1; i >= 0; --i) {
      node = graph.nodes[i];
      dx = x - node.x;
      dy = y - node.y;
      let radius = node.radius || settings.nodeRadius;
      if (dx * dx + dy * dy < radius * radius) {

        node.x =  transform.applyX(node.x);
        node.y = transform.applyY(node.y);
        console.log(node);
        return node;
      }
    }
  }


  function dragstarted() {
    // if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.x = transform.invertX(d3.event.x);
    d3.event.subject.y = transform.invertY(d3.event.y);
  }

  function dragged() {
    // console.log('transform.invertX(d3.event.x)', transform.invertX(d3.event.x))
    // console.log('d3.event.x', d3.event.x)
    // console.log('d3.event.subject', d3.event.subject.fx)
    console.log('d3.event.subject', d3.event.subject)

    d3.event.subject.x = transform.invertX(d3.event.x);
    d3.event.subject.y = transform.invertY(d3.event.y);
    update();
  }

  function dragended() {
    // if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.active = false;
    // d3.event.subject.fx = null;
    // d3.event.subject.fy = null;
  }

}
