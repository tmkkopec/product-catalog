'use strict';

var margin = {top: 20, right: 120, bottom: 20, left: 320},
    width = 1460 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root = null,
    parents = null,
    parentMap = new Map(),
    links = null,
    shownAssociations = {
		master: false,
		requirement: false,
		exclusion: false
	}

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var defs = svg.append("defs");

defs.append("marker")
.attr({
	"id":"arrow",
	"viewBox":"0 -20 40 40",
	"refX":40,
	"refY":0,
	"markerWidth":7,
	"markerHeight":7,
	"orient":"auto"
})
.append("path")
	.attr("d", "M0,-15L40,0L0,15")
	.attr("class","arrowHead");

// Parse node parents
d3.json("categoriesandassociations/parents", function(error, response) {
	  if (error) throw error;

	  parents = response;
	  for(var elem in parents) { 
		  parentMap.set(elem, parents[elem]);
	  }
	});

// Parse data structure and bind it to the tree
d3.json("categoriesandassociations/children", function(error, response) {
	  if (error) throw error;

	  root = response;
	  root.x0 = 0;
	  root.y0 = 0;
	  root.name="root";
	  
	  function collapse(d) {
	    if (d.children) {
	      d._children = d.children;
	      d._children.forEach(collapse);
	      d.children = null;
	    }
	  }

	  root.children.forEach(collapse);
	  update(root);
});
d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
  var nodesWithReps = tree.nodes(root).reverse();
  
  var nodes = [];
  var nodeMap = new Map();
  
  // Abandon the type nodes that would be shown more than one time on the graph
  nodesWithReps.forEach(function(d){
    if(d.typeId) {
        if(nodeMap.has('t'+d.typeId)) {
            if(nodeMap.get('t'+d.typeId).y>=d.y) return;
            else nodeMap.set('t'+d.typeId, d);
        }
        else nodeMap.set('t'+d.typeId, d);
    }
    else {
        if(!d.categoryId) nodeMap.set(d.id, d);
        else nodeMap.set('c'+d.categoryId, d);
    }
  });
  nodeMap.forEach(function(node){
	  nodes.push(node);
	  });
  // Make an array of links connecting the parents and their children
  links = tree.links(nodes);
  for(var ind in nodes) {
	  if(nodes[ind].typeId) {
		  var typeParents = parentMap.get(nodes[ind].typeId);
		  if(typeParents) {
			  if(typeParents.length>1) {
				  for(var catInd in typeParents) {
					  for(var connectionInd in links) {
						  if(links[connectionInd].source.categoryId && links[connectionInd].target.typeId) {
							  if(links[connectionInd].source.categoryId==typeParents[catInd] && links[connectionInd].target.typeId==nodes[ind].typeId) {
								  links[connectionInd].target = nodes[ind];
							  }
						  }
					  }
				  }
			  }
		  }
	  }
  }
  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180 - 250;});

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });
//        .data(nodes, function(d) { return (d.typeId==null)?((d.categoryId==null)?d.id=++i:d.id='c'+d.categoryId):d.id='t'+d.typeId;})

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", function(d) { return (d.typeId==null)?((d.categoryId==null)?"node root-node":"node category-node"):"node type-node";})
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .attr("identifier",function(d) { return (d.typeId==null)?((d.categoryId==null)?d.id:('c'+d.categoryId)):('t'+d.typeId);})
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

//  nodeEnter.append("text")  
  nodeEnter.append("text")
  .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
  .attr("dy", ".35em")
  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
  .text(function(d) { return (d.name==null)?"":d.name;})
  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
  .attr("r", 4.5)
  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.source.id + "link" + d.target.id; });
  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });
  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove(); 
 
  var masters = [];
  var requirements = [];
  var exclusions = [];
  
  // Prepare the data for inserting the lines marking associations
  nodes.forEach(function(d) { 	
	  if(d.associations) {
		  for(var assocInd in d.associations) {
			  var lord = d;
			  var slave = null;
			  for(var ind in nodes) { 
				  if(d.associations[assocInd].substring(1)==((nodes[ind].typeId==null)?((nodes[ind].categoryId==null)?nodes[ind].id:('c'+nodes[ind].categoryId)):('t'+nodes[ind].typeId))) slave = nodes[ind];
			  }
			  if(!!lord && !!slave) { 
				  if(d.associations[assocInd].indexOf('M')==0 && shownAssociations.master) masters.push({source: lord, target: slave});
				  if(d.associations[assocInd].indexOf('R')==0 && shownAssociations.requirement) requirements.push({source: lord, target: slave});
				  if(d.associations[assocInd].indexOf('E')==0 && shownAssociations.exclusion) exclusions.push({source: lord, target: slave});
			  }
		  }
	  }
	});
  
  // Update the links…
  var master = svg.selectAll("line.master")
      .data(masters, function(d) { return d.source.id + d.target.id; });
  
  master.enter().insert("line")
  	.attr("class", "master")
  	.attr("marker-end", "url(#arrow)")
  	.attr("x1", function(d) { return d.source.y; })
  	.attr("y1", function(d) { return d.source.x; })
  	.attr("x2", function(d) { return d.source.y; })
  	.attr("y2", function(d) { return d.source.x; });
  
  // Transition master-slave association lines to their new position.
  master.transition()
    .duration(duration)
  	.attr("x1", function(d) { return d.source.y; })
  	.attr("y1", function(d) { return d.source.x; })
  	.attr("x2", function(d) { return d.target.y; })
  	.attr("y2", function(d) { return d.target.x; });

  master.exit().transition()
    .duration(duration)
    .attr("x2", function(d) { return d.source.y; })
  	.attr("y2", function(d) { return d.source.x; })
    .remove(); 
  
  // Update the links…
  var requirement = svg.selectAll("line.requirement")
      .data(requirements, function(d) { return d.source.id + d.target.id; });
  
  requirement.enter().append("line")
  	.attr("class", "requirement")
  	.attr("x1", function(d) { return d.source.y; })
  	.attr("y1", function(d) { return d.source.x; })
  	.attr("x2", function(d) { return d.source.y; })
  	.attr("y2", function(d) { return d.source.x; });
  
  // Transition requirement association lines to their new position.
  requirement.transition()
    .duration(duration)
  	.attr("x1", function(d) { return d.source.y; })
  	.attr("y1", function(d) { return d.source.x; })
  	.attr("x2", function(d) { return d.target.y; })
  	.attr("y2", function(d) { return d.target.x; });

  requirement.exit().transition()
    .duration(duration)
    .attr("x2", function(d) { return d.source.y; })
  	.attr("y2", function(d) { return d.source.x; })
    .remove(); 
 
  // Update the links…
  var exclusion = svg.selectAll("line.exclusion")
      .data(exclusions, function(d) { return d.source.id + d.target.id; });
  
  exclusion.enter().append("line")
  	.attr("class", "exclusion")
  	.attr("x1", function(d) { return d.source.y; })
  	.attr("y1", function(d) { return d.source.x; })
  	.attr("x2", function(d) { return d.source.y; })
  	.attr("y2", function(d) { return d.source.x; });
  
  // Transition exclusion association lines to their new position.
  exclusion.transition()
    .duration(duration)
  	.attr("x1", function(d) { return d.source.y; })
  	.attr("y1", function(d) { return d.source.x; })
  	.attr("x2", function(d) { return d.target.y; })
  	.attr("y2", function(d) { return d.target.x; });

  exclusion.exit().transition()
    .duration(duration)
    .attr("x2", function(d) { return d.source.y; })
  	.attr("y2", function(d) { return d.source.x; })
    .remove(); 
  
  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

//  generateContextMenus();
  if($('#categoryEditPanel').length) {
	  $("#graph g.category-node").contextMenu({
	      menuSelector: "#categoryMenu"
	  });

	  $("#graph g.type-node").contextMenu({
	      menuSelector: "#typeMenu"
	  });
	  
	  $("#graph g.root-node").contextMenu({
	      menuSelector: "#rootMenu"
	  });
  }
  
}

// Toggle children on click.
function click(d) {														
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	    // Alongside with the node whose children are being hidden, hide also all the nodes who are its children's co-parents
	    if(d._children) {
		    for(var childInd in d._children) {
		    	if(!!d._children[childInd].typeId) {
		    		for(var connectionInd = 0;connectionInd<links.length;connectionInd++) {
						  if(links[connectionInd].target.typeId==d._children[childInd].typeId) {
							  if(links[connectionInd].source.children) {
								  click(links[connectionInd].source);
							  }
						  }
					  }
		    	}
		    }
	    }
	  } else if (d._children) {
		var parentsToBeExpanded = [];
	    d.children = d._children;
	    d._children = null;
	    // Alongside with the node whose children are being shown, show also all the nodes who are its children's co-parents
	    if(d.children) {
		    for(var childInd in d.children) {
		    	if(!!d.children[childInd].typeId) {
		    		var typeParents = parentMap.get(d.children[childInd].typeId);
		    		if(!!typeParents) {
		    			var toAdd = true;
		    			for(var parentInd in typeParents) {
		    				for(var expInd in parentsToBeExpanded) {
		    					if(typeParents[parentInd] === parentsToBeExpanded[expInd]) {
		    						toAdd = false;
		    						break;
		    					}
		    				}
		    				if(toAdd) { 
		    					parentsToBeExpanded.push(typeParents[parentInd]);
		    				}
		    				toAdd=true;
		    			}
		    			for(var j=0; j<parentsToBeExpanded.length; j++) {
		    				svg.selectAll('g[identifier="c' + parentsToBeExpanded[j] + '"]').forEach(function(data) {
			    				  if(data[0]) {
			    					  if(d.categoryId!==data[0].__data__.categoryId) {
			    			    		  if (data[0].__data__._children) {
			    			    			  click(data[0].__data__);
			    			    		  }
				    				  }
			    				  }
				    		  });
		    			}
			    	}
		    	}
		    }
	    }
	  }
	  update(d);
	}