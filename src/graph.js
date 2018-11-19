import readXlsxFile from "read-excel-file";
import * as d3 from "d3";

function main() {
  const input = document.getElementById("input");

  input.addEventListener("change", () => {
    readXlsxFile(input.files[0]).then(rows => {
      const nRow = rows.length;
      const nCol = rows[0].length;
      function searchParent(i, j) {
        return j === 1 ? "root" : rows[i][j - 1] || searchParent(i - 1, j);
      }
      let data = [{ name: "root", parent: "" }];
      for (let i = 1; i < nRow; i++) {
        for (let j = nCol - 1; j > 0; j--) {
          if (rows[i][j]) {
            data.push({
              name: rows[i][j],
              parent: searchParent(i, j)
            });
          }
        }
      }
      let root = d3
        .stratify()
        .id(function(d) {
          return d.name;
        })
        .parentId(function(d) {
          return d.parent;
        })(data);
      console.log(root);

      //Identify graph boundary
      root.dx = 30;
      root.dy = 500 / (root.height + 1);
      let treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
      treeLayout(root);
      let x0 = Infinity;
      let x1 = -x0;
      root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });
      const svg = d3
        .select("svg")
        .style("width", "100%")
        .style("height", x1 - x0 + root.dx * 2);

      //Graph root
      let gr = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

      //Links (curvy)
      gr.append("g")
        .classed("links", true)
        .selectAll("line.link")
        .data(root.links())
        .enter()
        .append("path")
        .classed("link", true)
        .attr("fill", "none")
        .attr("stroke", "#DBDBDB")
        .attr(
          "d",
          d => `
            M${d.target.y},${d.target.x}
            C${d.source.y + root.dy / 2},${d.target.x}
            ${d.source.y + root.dy / 2},${d.source.x}
            ${d.source.y},${d.source.x}
          `
        );

      //Nodes
      let nodes = gr
        .append("g")
        .classed("nodes", true)
        .selectAll("circle.node")
        .data(root.descendants())
        .enter()
        .append("g")
        .classed("node", true)
        .attr("transform", d => `translate(${d.y}, ${d.x})`); //Swap x and y to make the graph horizontal
      nodes
        .append("circle")
        .attr("r", 4)
        .attr("fill", "#4682B4");
      nodes
        .append("text")
        .attr("fill", "black")
        .attr("dy", "-10px")
        .attr("text-anchor", "middle")
        .text(d => d.data.name);
    });
  });
}

export default main;
