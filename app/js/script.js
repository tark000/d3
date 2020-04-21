if(document.getElementById("svg")) {
  var svg = d3.select("#svg"),
      width = +document.querySelector('section').offsetWidth,
      height = +document.querySelector('section').offsetHeight;

  var simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-200))
      .force("link", d3.forceLink().id(function(d) { return d.country; }).distance(dist).strength(stren))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .on("tick", ticked);

  function stren(d) {
    return d.value * 0.1 || 1;
  }

  function dist(d) {
    return d.distance+30;
  }

  var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");

  let graph = {
    nodes: [
      { country: "Canada" , radius: 75, color: 'red'},
      { country: "Yemen", radius: 75, color: 'blue'},
      { country: "Solomon Islands", radius: 75 },
      { country: "Vietnam", radius: 75 },
      { country: "Brazil", radius: 75 },
      { country: "Taiwan", radius: 75 },
    ],
    links: [
      { source: "Canada", target: "Yemen", distance: 300, value: 1 },
      { source: "Canada", target: "Solomon Islands", distance: 600, value: 1 },
      { source: "Yemen", target: "Vietnam", distance: 400, value: 1 },
      { source: "Yemen", target: "Brazil", distance: 400, value: 5 },
      { source: "Canada", target: "Brazil", distance: 400, value: 3, color: 'blue' },
      { source: "Vietnam", target: "Taiwan", distance: 500, value: 4, color: '#00ffff' },
      { source: "Brazil", target: "Taiwan", distance: 300, value: 3, color: 'red' },
    ],
  }


  simulation.nodes(graph.nodes);
  simulation.force("link")
    .links(graph.links)
    // .distance(dist)
    // .strength(stren);

  var link = link
    .data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  var node = node
    .data(graph.nodes)
    .enter()
    .append("g")


  var circle =   node.append("circle")
    .attr("class", "node")
    .attr("r", function(d){ return d.radius; })
    .style("fill", function(d) { return d.color ? d.color : '#fff'; });

  var text = node
    .append("text")
    .classed('circleText', true)
    .attr('dy', '0.35em')
    .attr('dx', -25)
    .text(d => d.country);

  function ticked() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // node.attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });
    node.attr("transform", function(d){return "translate("+d.x+"," + d.y + ")"});
    circle;
    text;
  }

  // canvas drag and drop

  // let width = +document.querySelector('section').offsetWidth;
  // let height = +document.querySelector('section').offsetHeight;
  // // let width = 800;
  // // let height = 600
  // let radius = 10;
  // let canvas = d3
  //   .select('#my-canvas')
  //   .attr('width', width)
  //   .attr('height', height)
  //   .style('background', 'rgb(245, 255, 245)');
  // let ctx = canvas.node().getContext('2d');
  // let scaleColor = d3.scaleOrdinal(d3.schemeCategory10);
  //
  // let graph = {
  //   nodes: [
  //     { country: "Canada" , radius: 10},
  //     { country: "Yemen", radius: 20 },
  //     { country: "Solomon Islands", radius: 30 },
  //     { country: "Vietnam", radius: 30 },
  //     { country: "Brazil", radius: 40 },
  //     { country: "Taiwan", radius: 20 },
  //   ],
  //   links: [
  //     { source: "Canada", target: "Yemen", distance: 190, value: 1 },
  //     { source: "Canada", target: "Solomon Islands", distance: 100, value: 1 },
  //     { source: "Yemen", target: "Vietnam", distance: 180, value: 1 },
  //     { source: "Yemen", target: "Brazil", distance: 160, value: 5 },
  //     { source: "Canada", target: "Brazil", distance: 130, value: 3, color: 'blue' },
  //     { source: "Vietnam", target: "Taiwan", distance: 100, value: 4, color: '#00ffff' },
  //     { source: "Brazil", target: "Taiwan", distance: 300, value: 3, color: 'red' },
  //   ],
  // }
  //
  // let drawNode = (node) => {
  //   ctx.beginPath();
  //   // Change color of node
  //   ctx.fillStyle = scaleColor(node.country);
  //   ctx.moveTo(node.x, node.y);
  //   // Draw circle
  //   ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
  //   ctx.fill();
  // }
  // let drawLink = (link) => {
  //   ctx.moveTo(link.source.x, link.source.y);
  //   // Draw path
  //   ctx.lineTo(link.target.x, link.target.y);
  // }
  // let update = () => {
  //   ctx.clearRect(0, 0, width, height);
  //
  //   ctx.globalAlpha = 1;
  //   graph.nodes.forEach(drawNode);
  //
  //   ctx.beginPath();
  //   ctx.globalAlpha = 0.3;
  //   ctx.strokeStyle = '#aaa';
  //   graph.links.forEach(drawLink);
  //   ctx.stroke();
  // };
  //
  // let simulation = d3
  //   .forceSimulation()
  //   .force('x', d3.forceX(width / 2))
  //   .force('y', d3.forceY(height / 2))
  //   // collide will prevent nodes from overlapping
  //   .force('collide', d3.forceCollide(radius + 5))
  //   // charge will instruct nodes to repulse each other
  //   .force('charge', d3
  //     .forceManyBody()
  //     .strength(-1000)
  //    )
  //   // Mapping array links and nodes
  //   .force('link', d3
  //     .forceLink()
  //     // Indicate which field in nodes is source mapping to
  //     .id(d => d.country)
  //   )
  //   .on('tick', update);
  //
  // // Once simulation is executed, x, y, vy, vx will be added to nodes
  // simulation
  //   .nodes(graph.nodes)
  //   // Passing data to the links network
  //   .force('link')
  //   .links(graph.links)
  //   .distance(dist)
  //   .strength(stren);
  //
  // function stren(d) {
  //   return d.value * 0.1 || 1;
  // }
  //
  // function dist(d) {
  //   return d.distance+30;
  // }
  //
  // // Make node draggable
  // // Ref: https://github.com/d3/d3-force
  // // Ref: https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
  // // Ref: https://www.youtube.com/watch?v=gda35eYXBJc
  // let dragsubject = () => simulation.find(d3.event.x, d3.event.y);
  // let dragstarted = () => {
  //   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //   d3.event.subject.fx = d3.event.subject.x;
  //   d3.event.subject.fy = d3.event.subject.y;
  //   console.log(d3.event.subject);
  // }
  // let dragged = () => {
  //   d3.event.subject.fx = d3.event.x;
  //   d3.event.subject.fy = d3.event.y;
  // }
  // let dragended = () => {
  //   if (!d3.event.active) simulation.alphaTarget(0);
  //   d3.event.subject.fx = null;
  //   d3.event.subject.fy = null;
  // }
  //
  // canvas
  //   .call(d3.drag()
  //     .container(canvas.node())
  //     .subject(dragsubject)
  //     .on("start", dragstarted)
  //     .on("drag", dragged)
  //     .on("end", dragended));
}
