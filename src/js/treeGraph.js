import * as d3 from "d3";


function main(root) {
  //Identify graph boundary
  root = genTreeLayout(root);
  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  //Setup svg
  const svg = d3
    .select("svg")
    .style("width", "100%")
    .style("height", x1 - x0 + root.dx * 2);
  
  //Graph root
  //svg -> g -> g.links and g.nodes
  let gr = svg
    .append("g")
    .classed("treeRoot", true)
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
  gr.append("g").classed("links", true);
  gr.append("g").classed("nodes", true);

  //Initial update
  updateTreeGraph(root);
}


function genTreeLayout(root) {
  root.dx = 30;
  root.dy = 500 / (root.height + 1);
  let treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
  treeLayout(root);

  return root;
}

function updateTreeGraph(root) {
  root = genTreeLayout(root);
  let rootElement = d3.select(".treeRoot");

  //Links (curvy)
  let linkPaths = rootElement
    .select("g.links")
    .selectAll("path.link")
    .data(root.links())
    
  linkPaths 
    .enter()
      .append("path")
      .classed("link", true)
      .attr("fill", "none")
      .attr("stroke", "#DBDBDB")
    .merge(linkPaths) //Both enter and update
      .attr("d", (d) => `
          M${d.target.y},${d.target.x}
          C${d.source.y + root.dy / 2},${d.target.x}
          ${d.source.y + root.dy / 2},${d.source.x}
          ${d.source.y},${d.source.x}
        `
      );

  //Nodes
  let nodeGs = rootElement
    .select("g.nodes")
    .selectAll("g.node")
    .data(root.descendants());
  
  let nodeGs_enter = nodeGs
    .enter()
      .append("g")
      .classed("node", true);
  
  nodeGs_enter
    .append("circle")
    .classed("node_circle", true)
    .attr("fill", "#4682B4");
    
  nodeGs_enter
    .append("text")
    .classed("node_text", true)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dy", "-10px");

  let nodeGs_enter8Update = nodeGs_enter
    .merge(nodeGs);
    
  nodeGs_enter8Update
    .attr("transform", (d) => `translate(${d.y}, ${d.x})`); //Swap x and y to make the graph horizontal
  
  nodeGs_enter8Update
    .select(".node_circle")
    .attr("r", (d) => (d.data.weight * 8) || 4);

  nodeGs_enter8Update
    .select(".node_text")
    .text((d) => {return d.data.name});
}


export { main as default, updateTreeGraph };
