var svg;
var bar_left;
var scatter;
var bar_right;
var bar_bottom;
var active_index = 0;
var bar_color = '#226';
selected_points = [];
init();

function init() {

	svg = d3.select("body").append("div").attr("class", "container");
	bar_left = svg.append("svg").attr("class", "bar_left");
	bar_right = svg.append("svg").attr("class", "bar_right");
	scatter = svg.append("svg").attr("class", "scatter");
	bar_bottom = svg.append("svg").attr("class", "bar_bottom");
	info_bottom = svg.append("svg").attr("class", "info_bottom");
	
	draw_bar_charts();
	draw_scatter_plots(active_index);
	
}

function extract(array, key) {
	result = [];
	array.forEach(function(d){
		result.push(+d[key]);
	})
	return result;
}

function on_mouse_over(i) {
	var over_color = "#048"
	d3.selectAll(".bars").style("cursor", "pointer"); 
	d3.selectAll(".bars_text").style("cursor", "pointer"); 
	
	if (i != active_index) {
		d3.select("#bars_left_" + i).attr("fill", over_color)
		d3.select("#bars_right_" + i).attr("fill", over_color)
		d3.select("#bars_bottom_" + i).attr("fill", over_color)
	}
}

function on_mouse_out(i) {
	d3.select("#bars_left_" + i).style("cursor", "default"); 
	if (i != active_index) {

		d3.select("#bars_left_" + i).attr("fill", bar_color)
		d3.select("#bars_right_" + i).attr("fill", bar_color)
		d3.select("#bars_bottom_" + i).attr("fill", bar_color)
	}
}

function draw_bar_charts() {

	d3.csv('qualities.csv').then(function(qualities) {

		var clustered_pts = extract(qualities, 'clustered_pts');
		
		var bar_width = parseInt(d3.select(".bar_left").style("width"), 10);
		var bar_height = parseInt(d3.select(".bar_left").style("height"), 10) - clustered_pts.length * 2 - 30;

		var max = d3.max(clustered_pts, function (d) {return Number(d);});

		bar_left.selectAll(".bars_left")
			.data(clustered_pts)
			.enter()
			.append("rect")
			.attr("class", "bars bars_left")
			.attr("id", function(d, i){ return "bars_left_" + i})
			.attr("height", function(d){return bar_height / clustered_pts.length})
			.attr("width", function(d){return bar_width * d / max})
			.attr("x", 0)
			.attr("y", function (d, i) { return i * bar_height / clustered_pts.length + i*2})
			.attr("fill", bar_color)
			.on("mouseover", function(d, i) {return on_mouse_over(i);})
			.on("mouseout", function(d, i) {return on_mouse_out(i);})
			.on("click", function(d, i) {set_info_bottom(i)})

		bar_left.selectAll(".bars_left_text")
			.data(clustered_pts)
			.enter()
			.append("text")
			.attr("class", "bars_text bars_left_text")
			.attr("text-anchor", "right")
			.attr("height", function(d){return bar_height / clustered_pts.length})
			.attr("width", function(d){return bar_width * d / max})
			.attr("x", 5)
			.attr("y", function (d, i) { return i * bar_height / clustered_pts.length + bar_height / clustered_pts.length / 2 + i*2 + 5})
			.style("font-size", "80%")
			.attr("fill", "#BBB")
			.on("mouseover", function(d, i) {return on_mouse_over(i);})
			.on("mouseout", function(d, i) {return on_mouse_out(i);})
			.on("click", function(d, i) {set_info_bottom(i)})
			.text(function(d) {return d})//{if (d < 10) {return '\xa0\xa0\xa0\xa0\xa0\xa0' + d} else if (d < 100) {return '\xa0\xa0\xa0\xa0' + d} else if (d < 1000) {return '\xa0\xa0' + d} else {return d}});


		bar_left.append("text").text("clustered_pts").attr("fill", "#BBB").attr("y", parseInt(d3.select(".bar_left").style("height"), 10) - 5);






		var clusters_found = extract(qualities, 'clusters_found');
		
		var bar_width = parseInt(d3.select(".bar_right").style("width"), 10);
		var bar_height = parseInt(d3.select(".bar_right").style("height"), 10) - clusters_found.length * 2 - 30;

		var max = d3.max(clusters_found, function (d) {return Number(d);});

		bar_right.selectAll(".bars_right")
			.data(clusters_found)
			.enter()
			.append("rect")
			.attr("class", "bars bars_right")
			.attr("id", function(d, i){ return "bars_right_" + i})
			.attr("height", function(d){return bar_height / clusters_found.length})
			.attr("width", function(d){return bar_width * d / max})
			.attr("x", function(d){return bar_width - bar_width * d / max})
			.attr("y", function (d, i) { return i * bar_height / clusters_found.length + i*2})
			.attr("fill", bar_color)
			.on("mouseover", function(d, i) {return on_mouse_over(i);})
			.on("mouseout", function(d, i) {return on_mouse_out(i);})
			.on("click", function(d, i) {set_info_bottom(i)})

		bar_right.selectAll(".bars_right_text")
			.data(clusters_found)
			.enter()
			.append("text")
			.attr("class", "bars_text bars_right_text")
			.attr("text-anchor", "right")
			.attr("height", function(d){return bar_height / clusters_found.length})
			.attr("width", function(d){return bar_width * d / max})
			.attr("x", function(d){return bar_width - 20})
			.attr("y", function (d, i) { return i * bar_height / clusters_found.length + bar_height / clusters_found.length / 2 + i*2 + 5})
			.style("font-size", "80%")
			.attr("fill", "#BBB")
			.on("mouseover", function(d, i) {return on_mouse_over(i);})
			.on("mouseout", function(d, i) {return on_mouse_out(i);})
			.on("click", function(d, i) {set_info_bottom(i)})
			.text(function(d) {if (d < 10) {return '\xa0\xa0' + d} else {return d}});

			bar_right.append("text").text("clusters_found").attr("fill", "#BBB").attr("x", bar_width / 1.8).attr("y", parseInt(d3.select(".bar_right").style("height"), 10) - 5);






			var chs = extract(qualities, 'chs');
		
			var bar_width = parseInt(d3.select(".bar_left").style("height"), 10) - chs.length * 2;
			var bar_height = parseInt(d3.select(".bar_bottom").style("height"), 10) - 50;

			var max = d3.max(chs, function (d) {return Number(d);});

			bar_bottom.selectAll(".bars_bottom")
				.data(chs)
				.enter()
				.append("rect")
				.attr("class", "bars bars_bottom")
				.attr("id", function(d, i){ return "bars_bottom_" + i})
				.attr("height", function(d){return bar_height * d / max})
				.attr("width", function(d){return bar_width / chs.length})
				.attr("y", function(d){return bar_height - bar_height * d / max + 50})
				.attr("x", function (d, i) { return i * bar_width / chs.length + i*2})
				.attr("fill", bar_color)
				.on("mouseover", function(d, i) {return on_mouse_over(i);})
				.on("mouseout", function(d, i) {return on_mouse_out(i);})
				.on("click", function(d, i) {set_info_bottom(i)})

			bar_bottom.selectAll(".bars_bottom_text")
				.data(chs)
				.enter()
				.append("text")
				.attr("class", "bars_text bars_bottom_text")
				.attr("text-anchor", "middle")
				.attr("height", function(d){return bar_height * d / max})
				.attr("width", function(d){return bar_width / chs.length})
				.attr("y", function(d){return bar_height -10 + 50})
				.attr("x", function (d, i) { return i * bar_width / chs.length + bar_width / chs.length / 2 + i*2})
				.style("font-size", "80%")
				.attr("fill", "#BBB")
				.on("mouseover", function(d, i) {return on_mouse_over(i);})
				.on("mouseout", function(d, i) {return on_mouse_out(i);})
				.on("click", function(d, i) {set_info_bottom(i)})
				.text(function(d) {if (d < 10) {return '\xa0\xa0' + d} else {return d}});

				bar_bottom.append("text").text("Calinski-Harabasz Index").attr("fill", "#BBB").attr("text-anchor", "middle").attr("x", bar_width / 1.9).attr("y", 35);

				set_info_bottom(active_index);
	})

}

function set_info_bottom(i) {

	selected_points = [];
	active_index = i;
	var active_color = "#05A"
	d3.selectAll(".bars_left").attr("fill", bar_color)
	d3.selectAll(".bars_right").attr("fill", bar_color)
	d3.selectAll(".bars_bottom").attr("fill", bar_color)

	d3.select("#bars_left_" + i).attr("fill", active_color)
	d3.select("#bars_right_" + i).attr("fill", active_color)
	d3.select("#bars_bottom_" + i).attr("fill", active_color)


	
	d3.csv('qualities.csv').then(function(qualities) {
		d3.selectAll(".info_text").remove();
		var offset = 130;

		info_bottom.append("text").attr("class", "info_text").text("Hyperparameters for clustering run " + i + ":")	
		.attr("y", offset);

	//	info_bottom.append("text").attr("class", "info_text").text("id: " + i)	
//		.attr("y", offset + 20);

		info_bottom.append("text").attr("class", "info_text").text("metric: " +qualities[i].metric)	
		.attr("y", offset + 30);

		info_bottom.append("text").attr("class", "info_text").text("min_samples: " + qualities[i].min_samples)		
		.attr("y", offset + 50);

		info_bottom.append("text").attr("class", "info_text").text("eps: " + qualities[i].eps)
		.attr("y", offset + 70);
	});

	draw_scatter_plots(i);
}


function draw_scatter_plots(i) {

	var axes = [['X', 'Y'], ['X', 'Z'], ['Z', 'Y'], ['Vx', 'Vy'], ['Vx', 'Vz'], ['Vz', 'Vy']]

	var scatter_width = parseInt(d3.select(".scatter").style("width"), 10) - 80;
	var scatter_height = parseInt(d3.select(".scatter").style("height"), 10) - 40;

	d3.csv('/X/X_' + i + '.csv').then(function(X) {
		scatter.selectAll(".dot_scatter").remove();
		scatter.selectAll(".container").remove();
		scatter.selectAll("g").remove();
		scatter.selectAll("text").remove();
		
		axes.forEach(function(entry, index) {
			var container = scatter.append('svg').attr("class", "container container_" + index)
			.attr('width', scatter_width / 3)
			.attr('height', scatter_height / 2)
			.attr('x', 20 + scatter_width / 3 * (index % 3) + 40 * (index % 3))
			.attr('y', 20 + scatter_height / 2 * parseInt(index / 3) + 40 * parseInt(index / 3))
			
			var axis_X_Y_labels = X.map(function(d, i) { return [+d[entry[0]], +d[entry[1]], +d['labels'], i] });
			
			var x_scatter = d3.scaleLinear()
			.range([40, scatter_width / 3 - 40])
			.domain([d3.min(axis_X_Y_labels, function (d) {return d[0];}), d3.max(axis_X_Y_labels, function (d) {return d[0];})]);

			var y_scatter = d3.scaleLinear()
			.range([20, scatter_height / 2 - 40])
			.domain([d3.min(axis_X_Y_labels, function (d) {return d[1];}), d3.max(axis_X_Y_labels, function (d) {return d[1];})]);

			container.selectAll(".dot_scatter_" + index)
			.data(axis_X_Y_labels)
			.enter().append("circle")
			.attr('class', 'dot_scatter dot_scatter_' + index)
		//	.attr("fill", function(d) { return d3.schemeCategory10[d[2]%10]})
			.attr("fill", function(d) { if(selected_points.length == 0) {return d3.schemeCategory10[d[2]%10]} else if (selected_points.includes(d[3])) {return "#F00"} else {return "#555"}})
			.attr("r",1.5)
			.attr("opacity", 1.0)
			.attr("cx", function(d) { return x_scatter(d[0]); })
			.attr("cy", function(d) { return y_scatter(d[1]); })
		//	.on("click",function(){d3.select(this).attr("class","dot clicked");});

			/*
			dots.call( d3.brush()                 
			.on("start", drag_start_scatter) 
			.on("end", drag_end_scatter))
			*/
			container.append("g")
			.attr("transform", "translate(40," + (0) + ")")
			.call(d3.axisLeft(y_scatter).ticks(5))
			.attr('color', "#BBB")
			.attr("font-size", "80%");

			container.append("g")
			.attr("transform", "translate(0," + (scatter_height / 2 - 40) + ")")
			.call(d3.axisBottom(x_scatter).ticks(5))
			.attr('color', "#BBB")
			.attr("font-size", "80%")
			
		// label for the x axis
		container.append("text")             
			.attr("transform","translate(" + (scatter_width/3 - 27) + ", " + (scatter_height / 2 - 35) + ")")
			.style("font-size", "100%")
			.style("text-anchor", "middle")
			.attr('fill', "#BBB")
			.text(entry[0]);

		// label for the y axis
		container.append("text")             
			.attr("transform","translate(" + 35 + ", " + (15) + ")")
			.style("font-size", "100%")
			.style("text-anchor", "middle")
			.attr('fill', "#BBB")
			.text(entry[1]);

			container.call( d3.brush()                 
			.on("start", drag_start) 
			.on("end", drag_end)); 


		})
	});
}


function drag_start() {

}


function drag_end() {
	var selection = d3.event.selection;
	var index = d3.select(this).attr("class").replace("container container_", "");
	selected_points = [];
	if (selection != null) {
		
		var min = selection[0]
		var max = selection[1]
		
		d3.selectAll(".dot_scatter_" + index).each(function(d){
		//	console.log(d3.select(this).attr("cx") + " - " + d3.select(this).attr("cy"));
			if (d3.select(this).attr("cx") >= min[0]) {
				if (d3.select(this).attr("cx") <= max[0]) {
					if (d3.select(this).attr("cy") <= max[1]) {
						if (d3.select(this).attr("cy") >= min[1] - d3.select(this).attr("height")) {
							selected_points.push(d[3]);
						}
					}
				}
			}
		})
	}
	console.log(selected_points);
	draw_scatter_plots(active_index);
}
