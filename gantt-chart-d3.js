/**
 * @author Dimitry Kudrayvtsev, Roydon D'Souza
 * @version 3.0
 */

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";
    var CAMPAIGN_HEIGHT = 30;

    var CALENDAR_HEIGHT = 800;
     var CALENDAR_WIDTH = 1200;
    
    var margin = {
		top : 20,
		right : 40,
		bottom : 20,
		left : 150
    };
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = document.body.clientHeight - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;

    var tickFormat = "%d %b";
     

    var keyFunction = function(d) {
		return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
		return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
    var y = d3.scale.ordinal().domain(taskTypes).rangeBands([ 0, 500 ]);
    
    var xAxis = d3.svg.axis()
    	.scale(x).orient("top")
    	.tickFormat(d3.time.format(tickFormat))
	    .ticks(d3.time.days, 1)
	    .tickSize(height-margin.top,10)
	    .tickPadding(-15);

    var yAxis = d3.svg.axis().scale(y).orient("right").tickSize(0);

    var initTimeDomain = function(tasks) {
	if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
	    if (tasks === undefined || tasks.length < 1) {
			timeDomainStart = d3.time.day.offset(new Date(), -3);
			timeDomainEnd = d3.time.hour.offset(new Date(), +3);
			return;
	    }
	    tasks.sort(function(a, b) {
			return a.endDate - b.endDate;
	    });
	    timeDomainEnd = tasks[tasks.length - 1].endDate;
	    tasks.sort(function(a, b) {
			return a.startDate - b.startDate;
	    });
	    timeDomainStart = tasks[0].startDate;
	}
    };

    var initAxis = function() {
		x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
		y = d3.scale.ordinal().domain(taskTypes).rangeBands([ 0, 500 ]);

		xAxis = d3.svg.axis()
			.scale(x).orient("top")
			.tickFormat(d3.time.format(tickFormat))
			.ticks(d3.time.days, 1)
			.tickSize(height-margin.top,10)
			.tickPadding(-15); //modified from 8

		yAxis = d3.svg.axis().scale(y).orient("right").tickSize(0);
    };
    
    function gantt(tasks) {
	
	initTimeDomain(tasks);
	initAxis();
	
	var svg = d3.select("body")
	.append("svg")
	.attr("class", "chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("class", "gantt-chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	
      svg.selectAll("g")
	 .data(tasks, keyFunction).enter().append("g")
	 .append("rect")
	 .attr("rx", 0) //round borders
         .attr("ry", 0) //round borders
	 .attr("class", function(d){ //adding classname
	     if(taskStatus[d.status] == null){ return "bar";}
	     return taskStatus[d.status];
	     }) 
	 .attr("y", 0)
	 .attr("transform", rectTransform)
	 .attr("height", function(d) { return CAMPAIGN_HEIGHT;/*y.rangeBand();*/ })
	 .attr("width", function(d) { 
	     return (x(d.endDate) - x(d.startDate)); 
	     })
	 .on("click", function(){ alert('click captured'); });

	//EXTRA CUSTOM - TEXT ON RECTANGLE 
	 svg.selectAll("g")
		 .append('text').text(function(d){return d.name; })
	                .attr('x', 10)
	                .attr('y', function(d) { return /*y.rangeBand()*/CAMPAIGN_HEIGHT/2; })
	                .attr('fill', 'black') .attr("transform", rectTransform);
		 
	 
	 svg.append("g")
	 .attr("class", "x axis")
	 .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
	 .transition()
	 .call(xAxis)
	 .selectAll(".tick text").attr("style","font-family:sans-serif;font-size:15pt;font-weight:bold").attr("x", function(d){  return 10 });
	 
	 svg.append("g").attr("class", "y axis").transition().call(yAxis);
	 
	 return gantt;

    };
    
    gantt.redraw = function(tasks) {

	initTimeDomain(tasks);
	initAxis();
	
        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
 //        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);
        
 //        rect.enter()
 //         .insert("rect",":first-child")
 //         .attr("rx", 0) //border radius
 //         .attr("ry", 0) //border radius
	//  .attr("class", function(d){ 
	//      if(taskStatus[d.status] == null){ return "bar";}
	//      return taskStatus[d.status];
	//      }) 
	//  .transition()
	//  .attr("y", 0)
	//  .attr("transform", rectTransform)
	//  .attr("height", function(d) { return CAMPAIGN_HEIGHT;/*y.rangeBand();*/ })
	//  .attr("width", function(d) { 
	//      return (x(d.endDate) - x(d.startDate)); 
	//      });

	 
 //        rect.transition()
 //          .attr("transform", rectTransform)
	//  .attr("height", function(d) { return CAMPAIGN_HEIGHT; }) //y.rangeBand()
	//  .attr("width", function(d) { 
	//      return (x(d.endDate) - x(d.startDate)); 
	//      }); 

        
	// rect.exit().remove();

	var rectData = ganttChartGroup.selectAll("rect").data(tasks, keyFunction).enter();
	var rectGroup = rectData.append("g").attr("transform", rectTransform);


  	rectGroup.append("rect")
  		.attr("id",function(d,i){ return "campaign-"+i;})
  		.attr("class", function(d){ 
	     	if(taskStatus[d.status] == null){ return "bar";}
	     		return taskStatus[d.status];
	     	}) 
      	.attr("width", function(d) { 
	      	return (x(d.endDate) - x(d.startDate)); 
	      })
      	.attr("height", function(d) { return CAMPAIGN_HEIGHT })
      	.transition().duration(0)
      		.attr("transform", rectTransform)
      	;

//top bar 
	rectGroup.append("rect")
  		.attr("fill", "green") 
      	.attr("width", function(d) { 
	      	return (x(d.endDate) - x(d.startDate)); 
	      })
      	.attr("height", 3)
      	.transition().duration(0)
      		.attr("transform", rectTransform);

  	rectGroup.append("text")
      	.attr("x", 30)
      	.attr("y", CAMPAIGN_HEIGHT/2)
      	.attr("dy", ".35em")
      	.attr("style", function(d) {
        	if((x(d.endDate) - x(d.startDate))!=0){
        		return "";
        	} else {
        		return "display:none";
        	}
        })
      	.text(function(d) { return d.taskName; })
      	.transition().duration(0)
      		.attr("transform", rectTransform);

      rectGroup.append("image")
      .attr("x", CAMPAIGN_HEIGHT/3)
      .attr("y", CAMPAIGN_HEIGHT/5)
      .attr("height", CAMPAIGN_HEIGHT-10)
        .attr("width", function(d) {
        	if((x(d.endDate) - x(d.startDate))!=0){
        		return 15;
        	} else {
        		return 0;
        	}
        })
      .attr("xlink:href","https://qa-desk.collective.com/assets/statusWidget/active_icon-062230a04a602d1f17ea262b34a0198f.png")
      .transition().duration(0)
      		.attr("transform", rectTransform)
      	;

rectGroup.transition() .duration(0)
.each(function() { d3.select(this.parentNode)
      		.attr("transform", rectTransform)
      	
});


// ganttChartGroup.selectAll("g").data(tasks, keyFunction).append("g").transition()
// 	 //.each(function() { d3.select(this.parentNode)
// 	 	.attr("transform", rectTransform);
	 	//console.log(d3.select(this));
	// });
	 	//.attr("transform", rectTransform)
 		// .attr("height", function(d) { return CAMPAIGN_HEIGHT; }) //y.rangeBand()
 		// .attr("width", function(d) { 
   //    		return (x(d.endDate) - x(d.startDate)); 
   //    	}); 


//console.log(rectGroup.transition());
	//   ganttChartGroup.selectAll("g").data(tasks, keyFunction).transition()
	// //.each(function() { d3.select(this.parentNode)
	 	
	//  	.attr("transform", rectTransform)
 // 		.attr("height", function(d) { return CAMPAIGN_HEIGHT; }) //y.rangeBand()
 // 		.attr("width", function(d) { 
 //      		return (x(d.endDate) - x(d.startDate)); 
 //      //	}); 
	//   });
	//  ganttChartGroup.selectAll("rect").data(tasks, keyFunction).transition()
	
	//  	.attr("transform", rectTransform)
 // 		.attr("height", function(d) { return CAMPAIGN_HEIGHT; }) //y.rangeBand()
 // 		.attr("width", function(d) { 
 //      		return (x(d.endDate) - x(d.startDate)); 
 
	//   });
   //    	
   //  rect.transition()
   //    	.attr("transform", rectTransform)
 		// .attr("height", function(d) { return CAMPAIGN_HEIGHT; }) //y.rangeBand()
 		// .attr("width", function(d) { 
   //   		return (x(d.endDate) - x(d.startDate)); 
   //   	}); 

      ganttChartGroup.selectAll("rect").data(tasks, keyFunction).exit().each(function() { d3.select(this.parentNode).remove(); });
	//rectData.exit().each(function() { d3.select(this.parentNode).remove(); });



	svg.select(".x").transition().call(xAxis)
		.selectAll(".tick text").attr("style","font-family:sans-serif;font-size:15pt;font-weight:bold").attr("x", function(d){  return 10 });
	svg.select(".y").transition().call(yAxis);
	
	return gantt;
    };

    gantt.margin = function(value) {
	if (!arguments.length)
	    return margin;
	margin = value;
	return gantt;
    };

    gantt.timeDomain = function(value) {
	if (!arguments.length)
	    return [ timeDomainStart, timeDomainEnd ];
	timeDomainStart = +value[0], timeDomainEnd = +value[1];
	return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
	if (!arguments.length)
	    return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function(value) {
	if (!arguments.length)
	    return taskTypes;
	taskTypes = value;
	return gantt;
    };
    
    gantt.taskStatus = function(value) {
	if (!arguments.length)
	    return taskStatus;
	taskStatus = value;
	return gantt;
    };

    gantt.width = function(value) {
	if (!arguments.length)
	    return width;
	width = +value;
	return gantt;
    };

    gantt.height = function(value) {
	if (!arguments.length)
	    return height;
	height = +value;
	return gantt;
    };

    gantt.tickFormat = function(value) {
	if (!arguments.length)
	    return tickFormat;
	tickFormat = value;
	return gantt;
    };


    
    return gantt;
};
