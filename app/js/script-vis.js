// create a network
const container = document.getElementById('mynetwork');
if (container) {
  // create an array with nodes
  let nodes = new vis.DataSet([
    {id: 1, value: 500, label: 'Node 1 one', description: 'Some text1'},
    {id: 2, label: 'Node 2', value: 500, description: 'Some text2'},
    {id: 3, label: 'Node 3', value: 500, description: 'Some text3'},
    {id: 4, label: 'Node 4', value: 500},
    {id: 5, label: 'Node 5', value: 500}
  ]);
  let nodesPosition = new vis.DataSet([
    {id: 1, label: 'x=200, y=200', x: 200, y: 200, description: 'Some text1'},
    {id: 2, label: 'node 2', x: 0, y: 0, description: 'Some text2'},
    {id: 3, label: 'node 3', x: 0, y: 400, description: 'Some text3'},
    {id: 4, label: 'node 4', x: 400, y: 400, description: 'Some text4'},
    {id: 5, label: 'node 5', x: 400, y: 0, description: 'Some text5'}
  ]);
  // create an array with edges
  let edges = new vis.DataSet([
    {from: 1, to: 3, arrows: 'to, from', color: { color: 'red'}},
    {from: 1, to: 2, width: 8, arrows: 'to'},
    {from: 2, to: 4, width: 5,  length:100, color: { color: '#66ffff'}},
    {from: 2, to: 5, width: 2, length:250}
  ]);

  // provide the data in the vis format
  let data = {
    // nodes: nodesPosition,
    nodes: nodes,
    edges: edges
  };
  let options = {
    edges: {
  // arrows: {
    //   from: {
      //     imageHeight: 20,
      //     imageWidth: 20,
      //     scaleFactor: 2,
      //     src: 'color.svg',
      //     type: "image"
      //   }
      // },
      arrowStrikethrough: false,
      smooth: {
        // enabled: false
      }
    },
    nodes: {
      shape: 'circle',
      scaling: {
        customScalingFunction: function (min,max,total,value) {
          return value/total;
        },
        min:5,
        max:400,
      },
      widthConstraint: 150,
      color: {
        border: "#000",
        background: "#fff",

      }
      // size: 25
    },
    physics:{
      barnesHut:{gravitationalConstant:-30000},
      stabilization: {iterations:2500}
    },
  };




  // initialize your network!
  const network = new vis.Network(container, data, options);
  network.on("doubleClick", function (params) {
    const node = nodes.get(params.nodes[0]);
    const description = node.description;
    if (description) {
      modal.style.display = "block";
      params.event = "[original event]";
      modalContent.innerHTML = '<h2>' + node.label + '</h2><p>' + node.description+ '</p>';
    }
  });

  document.getElementById("save").onclick = function(){
    console.log(network.getPositions());
    alert("nodes positions: " + JSON.stringify(network.getPositions()));
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
