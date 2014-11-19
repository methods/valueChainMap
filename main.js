

//define our global variables needed. svg is the canvas, cMS is the status of the pop-up right click
//data holds the x/y circle data, line data has line information (set to 0, 0 to start with no lines)
//gd is a reference to the circle that the context menu has been called on
var valueChainMap = function () {
var svg;
  var contextMenuShowing;
  var data;
  var linedata =[{
       'i1': 1,
       'i2': 2
     }];
  var gd;

  //reads data into program from selected file. the forEach converts string to number
  d3.csv("data.csv", function(error, csvdata) {
  data = csvdata;
  data.forEach(function(d) {
      d.dataYVal = +d.dataYVal;
      d.dataXVal = +d.dataXVal;
      d.radius = +d.radius;
  });
  //initializes graph.
  initGraph(data);
  });


  //margin between graph and canvas
  var margin = {top: 20, right: 40, bottom: 40, left: 40};

  //this function controls which colors are assigned to which categories
  function color(name) {
    if(name==="Build") return "#9FCD99";
    if(name==="Share") return "#FFDD71";
    if(name==="Consume") return "#F26C64";
  }

  //listing of types for the legend

  var types=["Build","Share","Consume"];


  //this fcn appends canvas and draws axes
    var initGraph = function(data) {
    var width = 960,
        height = 700;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg = d3.select("#outermapdiv")
        .append("div")
        .attr("id", "svg")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "gcanvas");

    //domain is hardcoded from 0 to 100 and does not change with data
    x.domain(d3.extent([0,100])).nice();
    y.domain(d3.extent([0,100])).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Evolution (most commodified here)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value chain (most visible here)");


    		   //popup menu starts here
     contextMenuShowing = false;

      d3.select("#svg").on('contextmenu',function (d,i) {
        if(contextMenuShowing) {
            d3.event.preventDefault();
            d3.select(".popup").remove();
            contextMenuShowing = false;
        } else {
            d3_target = d3.select(d3.event.target);
            if (d3_target.classed("dcircle")||d3_target.classed("dtext")) {
                d3.event.preventDefault();
                contextMenuShowing = true;
                d = d3_target.datum();
                gd = d3_target.datum();
                // Build the popup

                canvas = d3.select("#svg"); // ?change
                mousePosition = d3.mouse(canvas.node());

                //popup is drawn here

                popup = canvas.append("div")
                    .attr("class", "popup")
                    .style("left", mousePosition[0] + "px")
                    .style("top", mousePosition[1] + "px")
                    .attr("color", "#000000");
                popup.append("h4").text(d.description).attr("text-decoration","underline")
                popup.append("p").text(
                    "Currently " + d.dataType)
                popup.append("input").attr("type","text").attr("id","eDescr").attr("value",d.description)

                popup.append("input").attr("type","button").attr("class","cswatch1").attr("onclick","valueChainMap.makeGreen()")
                popup.append("input").attr("type","button").attr("class","cswatch3").attr("onclick","valueChainMap.makeYellow()")
                popup.append("input").attr("type","button").attr("class","cswatch2").attr("onclick","valueChainMap.makeRed()")
                popup.append("p")
                popup.append("input").attr("type","submit").attr("id","editGo").attr("onclick","valueChainMap.editData()")
                popup.append("input").attr("type","button").attr("value","Delete").attr("onclick","valueChainMap.delData()")
                popup.append("p").text("Doubleclick another label to create line")

                canvasSize = [
                    canvas.node().offsetWidth,
                    canvas.node().offsetHeight
                ];

                popupSize = [
                    popup.node().offsetWidth,
                    popup.node().offsetHeight
                ];

                if (popupSize[0] + mousePosition[0] > canvasSize[0]) {
                    popup.style("left","auto");
                    popup.style("right",0);
                }

                if (popupSize[1] + mousePosition[1] > canvasSize[1]) {
                    popup.style("top","auto");
                    popup.style("bottom",0);
                }
            }
        }
    });
    //end popup menu

    //legend is defined and appended here
    var legend = svg.selectAll(".legend")
        .data(types)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    //legend is fleshed out here and below
    legend.append("rect")
        .attr("x", width + 10)
        .attr("width", 18)
        .attr("height", 18)
        .attr("stroke", "black")
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width + 4)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });


    // fill graph with data
    updateGraph();

  };

  //adds a new data point with input boxes above graph
  valueChainMap.addData =function addData() {
    var xValue = Math.floor((Math.random() * 50) + 25);
    var yValue = Math.floor((Math.random() * 50) + 25);
    var desValue = document.getElementById('descrNew').value;
    var radius = parseInt(document.querySelector('input[name = "size-selectors"]:checked').value)
    var typeValue = "Share"; //defaults to this value
    var newData = {
      'dataXVal': xValue,
      'dataYVal': yValue,
      'dataType': typeValue,
      'description': desValue,
      'radius': radius
    };

    data.push(newData);
    document.getElementById('descrNew').value = "";

    updateGraph();
  }

  //adds a new line with i(passed in as dblclick) and ind2 (has contextclick)
  function addLine(d,i) {

    var ind2 = data.indexOf(gd);

    var newData = {
       'i1': i,
       'i2': ind2
     };

    //checks that both are valid indices of circles before pushing a new line
    if (typeof data[newData.i1]!=='undefined'&& typeof data[newData.i2]!=='undefined') {
    linedata.push(newData);
    updateGraph();
    }
  }

  //color circle to specified value by changing type. gd descends from contextMenu
  valueChainMap.makeGreen = function makeGreen() {
    var editIndex = data.indexOf(gd);
    data[editIndex].dataType = "Build";
    updateGraph();
  }

  valueChainMap.makeYellow = function makeYellow() {
    var editIndex = data.indexOf(gd);
    data[editIndex].dataType = "Share";
    updateGraph();
  }

  valueChainMap.makeRed = function makeRed() {
    var editIndex = data.indexOf(gd);
    data[editIndex].dataType = "Consume";
    updateGraph();
  }

  //updates description based on input in contextMenu
  valueChainMap.editData =function editData() {
    var editIndex = data.indexOf(gd);
    data[editIndex].description = document.getElementById('eDescr').value;
    d3.select(".popup").remove();
    contextMenuShowing = false;
    updateGraph();
  }

  //deletes a circle based on selection made by contextMenu
  valueChainMap.delData = function delData() {
    var editIndex = data.indexOf(gd);
    /*adjusts lines to track the new index positions of the points
     and removes ones attached to the deleted point*/
    for(i = 0; i<linedata.length; i++){
      if (linedata[i].i1 === editIndex || linedata[i].i2 === editIndex) {
        linedata.splice(i,1);
        i--;
      }
      else {
        if (linedata[i].i1> editIndex){
          linedata[i].i1--
        };
        if (linedata[i].i2> editIndex){
          linedata[i].i2--
        };
      };
    };

    data.splice(editIndex, 1);
    d3.select(".popup").remove();
    contextMenuShowing = false;
    updateGraph();
  }

  //redraws all elements on map
  function updateGraph() {

  var width = 960,
      height = 700;

  //maps data to canvas dx / dy
  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  x.domain(d3.extent([0,100])).nice();
  y.domain(d3.extent([0,100])).nice();

  //sets dragging behavior
  var drag = d3.behavior.drag()
              .on('drag', function(d) {
                //changes graph data
                dots.attr('cx', d3.event.x)
                    .attr('cy', d3.event.y);
                //changes data to reflect new location on graph
                d.dataXVal = (100-(width-d3.select(this).attr("cx"))/10);
                d.dataYVal = (((height-d3.select(this).attr("cy"))/height)*100);
                updateGraph();
                                              })

              .on('dragend', function(d) {
                updateGraph();
                });

    //must remove all instances of these two to ensure lines are beneath circles
    svg.selectAll(".dcircle").remove();
    svg.selectAll(".dtext").remove();

    var dots = svg.selectAll(".dcircle").data(data);
    var labels = svg.selectAll(".dtext").data(data);
    var lines = svg.selectAll(".dline").data(linedata);


    //draws lines first so they are at bottom
  	    lines.enter().append("line")
              .attr("x1", function(d) {

                return x(data[d.i1].dataXVal);
              })
              .attr("y1", function(d) {
                return y(data[d.i1].dataYVal);
              })
                .attr("x2", function(d) {
                return x(data[d.i2].dataXVal);
              })
              .attr("y2", function(d) {
                return y(data[d.i2].dataYVal);
              })
              .attr("stroke-width", 5)
              .attr("stroke", "black")
            .attr("class", "dline")
            .on("dblclick", function(d,i) {
            linedata.splice(i, 1);
            updateGraph();
          });


        lines
          .attr("x1", function(d) {
            return x(data[d.i1].dataXVal);
          })
          .attr("y1", function(d) {
            return y(data[d.i1].dataYVal);
          })
            .attr("x2", function(d) {
            return x(data[d.i2].dataXVal);
          })
          .attr("y2", function(d) {
            return y(data[d.i2].dataYVal);
          })
          .attr("stroke-width", 5)
          .attr("stroke", "black")
        .attr("class", "dline")
         .on("dblclick", function(d,i) {
            linedata.splice(i, 1);
            updateGraph();
          });

    //draws circles next so they are above lines and below labels
    dots.enter().append("circle")
      .attr("class", function(d) {
            return 'dot color-' + color(d.dataType).replace('#','');
          })
        .attr("r", function(d) { return d.radius })
        .attr("class", "dcircle")
        .call(drag)
        .attr("cx", function(d) { return x(d.dataXVal); })
        .attr("cy", function(d) { return y(d.dataYVal); })
        .attr("dot-color", function(d) { return color(d.dataType).replace('#',''); })
        .style("fill", function(d) { return color(d.dataType); });


     dots
        .attr("r", function(d) { return d.radius; })
        .attr("class", "dcircle")
        .attr("cx", function(d) { return x(d.dataXVal); })
        .attr("cy", function(d) { return y(d.dataYVal); })
        .attr("dot-color", function(d) { return color(d.dataType).replace('#',''); })
        .style("fill", function(d) { return color(d.dataType); });

      //draws labels last so they are on very top
  		svg.selectAll(".dtext")
  		   .data(data)
  		   .enter()
  		   .append("text")
  		   .text(function(d) {
  		      return d.description;
  		   })
  		   .attr("x", function(d) {
  		   		var ccount = d.description.length;
  		   		var adjust = 6 - ccount;
  		   		return x(d.dataXVal)-(adjust);
  		   })
  		   .attr("y", function(d) {
  		   		return y(d.dataYVal);
  		   })
  		   .attr("font-family", "'Museo 310','Helvetica Neue', Helvetica, sans-serif")
  		   .attr("font-size", "13px")
  		   .attr("fill", "black")
  		   .attr("text-anchor", "middle")
  		   .attr("class", "dtext")
  		   .on("dblclick", function(d,i) {
             addLine(d,i);
          });

     svg.selectAll(".dtext")
  		   .data(data)
  		   .text(function(d) {
  		      return d.description;
  		   })
  		   .attr("x", function(d) {
  		   		var ccount = d.description.length;
  		   		var adjust = 6 - ccount;
  		   		return x(d.dataXVal)-(adjust);
  		   })
  		   .attr("y", function(d) {
  		   		return y(d.dataYVal);
  		   })
  		   .attr("font-family", "'Museo 310','Helvetica Neue', Helvetica, sans-serif")
  		   .attr("font-size", "13px")
  		   .attr("text-anchor", "middle")
  		  .attr("fill", "black")
  		  .on("dblclick", function(d,i) {
             addLine(d,i);
          });

    dots.exit().remove();
    labels.exit().remove();
    lines.exit().remove();

  }

}
