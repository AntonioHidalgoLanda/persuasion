/*global d3*/

var showMap = function (jsonmap, divIdTarget) {
    var width = 500,
        height = 300;
    
    var svg = d3.select("#" + divIdTarget).append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .gravity(.05)
        .distance(100)
        .charge(-100)
        .size([width, height]);

    force
        .nodes(jsonmap.nodes)
        .links(jsonmap.links)
        .start();

    
    var link = svg.selectAll(".link")
        .data(jsonmap.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) { return Math.sqrt(d.weight); });

    var node = svg.selectAll(".node")
        .data(jsonmap.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);
    
    node.append("circle")
        .attr("r", function (d) {return 3 + (d.occupants);})
        .style("fill", function(d) { return (d.current) ? "#ed4030" : "#999999"; });

    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) { return d.name; });
    
    force.on("tick", function () {
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
    
};
