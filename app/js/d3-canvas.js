if(document.getElementById("my-canvas")) {

  let graphSettings = {
    nodeColor: "#fff",
    nodeBorder: "#000",
    nodeRadius: "50",
    linkColor: "#333"
  };


  // set canvas
  let width = +document.querySelector('section').offsetWidth;
  let height = +document.querySelector('section').offsetHeight;

  let radius = 10;
  let canvas = d3
    .select('#my-canvas')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'rgb(245, 255, 245)');


  let ctx = canvas.node().getContext('2d');
  let scaleColor = d3.scaleOrdinal(d3.schemeCategory10);
  let transform = d3.zoomIdentity;

  let graph = {
    nodes: [
      { country: "Canada" , radius: 10},
      { country: "Yemen" },
      { country: "Solomon Islands", radius: 30 },
      { country: "Vietnam", radius: 30 },
      { country: "Brazil", radius: 40, color: 'yellow' },
      { country: "Taiwan", radius: 20, color: 'red' },
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


  let drawNode = (node) => {
    ctx.beginPath();

    // Change color of node
    ctx.fillStyle = scaleColor(node.country);
    ctx.moveTo(node.x, node.y);
    // Draw circle
    ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  let drawLink = (link) => {
    ctx.moveTo(link.source.x, link.source.y);
    // Draw path
    ctx.lineTo(link.target.x, link.target.y);
  }
  let update = () => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    graph.links.forEach(function(d) {
      ctx.beginPath();
      ctx.moveTo(d.source.x, d.source.y);
      ctx.lineTo(d.target.x, d.target.y);
      ctx.stroke();
    });

      // Draw the nodes
    graph.nodes.forEach(function(d, i) {
      let width = ctx.measureText(d.country).width;
      let height = ctx.measureText("w").width;
      let nodeRadius = d.radius || graphSettings.nodeRadius;
      let radius = nodeRadius < width/2 ? width/2 + 10 : nodeRadius;
      // console.log(d.country, nodeRadius, width/2, radius);

      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = d.color ? d.color:"#fff"
      ctx.fill();
      ctx.strokeStyle = '#aaa';
      ctx.stroke();

      // add text
      ctx.font = "bold 12px serif";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";

      ctx.fillText(d.country, d.x ,d.y);
    });
    ctx.restore();
  };

  let simulation = d3
    .forceSimulation()
    .force('x', d3.forceX(width / 2))
    .force('y', d3.forceY(height / 2))
    // collide will prevent nodes from overlapping
    .force('collide', d3.forceCollide(radius + 5))
    // charge will instruct nodes to repulse each other
    .force('charge', d3
      .forceManyBody()
      .strength(-1000)
     )
    // Mapping array links and nodes
    .force('link', d3
      .forceLink()
      // Indicate which field in nodes is source mapping to
      .id(d => d.country)
    )
    .alphaTarget(0)
    .alphaDecay(0.05)
    .on('tick', function() {
      console.log(11111);
      update();
    });

  // Once simulation is executed, x, y, vy, vx will be added to nodes
  simulation
    .nodes(graph.nodes)
    // Passing data to the links network
    .force('link')
    .links(graph.links)
    .distance(dist)
    .strength(stren);

  function stren(d) {
    return d.value * 0.1 || 1;
  }

  function dist(d) {
    return d.distance+30;
  }

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
      let radius = node.radius || graphSettings.nodeRadius;
      if (dx * dx + dy * dy < radius * radius) {
        console.log(node)
        node.x =  transform.applyX(node.x);
        node.y = transform.applyY(node.y);
        console.log(node)

        return node;
      }
    }
  }


  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = transform.invertX(d3.event.x);
    d3.event.subject.fy = transform.invertY(d3.event.y);
  }

  function dragged() {
    console.log('transform.invertX(d3.event.x)', transform.invertX(d3.event.x))
    console.log('d3.event.x', d3.event.x)
    console.log('d3.event.subject', d3.event.subject.fx)
    d3.event.subject.fx = transform.invertX(d3.event.x);
    d3.event.subject.fy = transform.invertY(d3.event.y);

    console.log('d3.event.subject', d3.event.subject.fx)
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  canvas
    .call(d3.drag()
      // .container(canvas.node())
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .call(d3.zoom().scaleExtent([0.3, 8]).on("zoom", zoomed));

  // zoom

  function zoomed() {
      console.log("zooming")
      transform = d3.event.transform;
      update();
    }

}
