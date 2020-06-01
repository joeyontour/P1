var base_color = '#223';
var active_color = "#05A"
var ready_color = "#0A5"

batch_height = 40;
batch_width = 160;

metric_height = 35;

batch_dict = {}
metric_dict = {}
	
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function draw_batches() {
	batches = data.batches
	if (isEmpty(batch_dict) == true) {
		batches.forEach(function(batch) {
			batch_dict[batch] = 'inactive';
		})
	}
	console.log(batch_dict);
	svg = d3.select("body").select("svg");

	svg.selectAll(".batches")
			.data(batches)
			.enter()
			.append("rect")
			.attr("class", "batches")
			.attr("id", function(d, i){ return d})
			.attr("height", function(d){return batch_height})
			.attr("width", function(d){return batch_width})
			.attr("x", function (d, i) { return 10 + i * (batch_width + 10)})
			.attr("y", 20)
			.style("fill", function (d, i) {if (batch_dict[d] == 'active'){return active_color} else{return base_color}})
			.on("mouseover", function(d, i) {return on_mouse_over(d);})
			.on("mouseout", function(d, i) {return on_mouse_out(d);})
			.on("click", function(d, i) {batch_selected(d)})
			
			
		svg.selectAll(".batches_text")
			.data(batches)
			.enter()
			.append("text")
			.attr("class", "batches_text")
			.attr("text-anchor", "middle")
			.attr("font-weight", "bold")
			.attr("height", function(d){return batch_height})
			.attr("width", function(d){return batch_width})
			.attr("x", function (d, i) { return 10 + (i+0.5) * (batch_width + 10)})
			.attr("y", 25 + batch_height / 2)
		//	.attr("fill", "#BBB")
			.on("mouseover", function(d, i) {return on_mouse_over(d);})
			.on("mouseout", function(d, i) {return on_mouse_out(d);})
			.on("click", function(d, i) {batch_selected(d)})
			.text(function(d) {return d})
			
			draw_metrics()

}

function draw_metrics() {
	metrics = data.metrics
	
	svg = d3.select("body").select("svg");
	var j = 0;
	data.batches.forEach(function(batch){
	if (isEmpty(metric_dict) == true) {	
		metrics.forEach(function(metric) {
			metric_dict[batch + '_' + metric] = 'inactive';
		})
	}
	svg.selectAll(".metrics_" + j)
			.data(metrics)
			.enter()
			.append("rect")
			.attr("class", "metrics_" + j)
			.attr("id", function(d, i){ return batch + '_' + d})
			.attr("height", function(d){return metric_height})
			.attr("width", function(d){return batch_width})
			.attr("x", 10 + j * (batch_width + 10))
			.attr("y", function (d, i) { return batch_height*2 + 10 + i * (metric_height + 10)})
			.style("fill", function (d, i) {if (metric_dict[batch + '_' + d] == 'active'){return active_color} else if (metric_dict[batch + '_' + d] == 'ready'){return ready_color} else{return base_color}})
			.on("mouseover", function(d, i) {return on_mouse_over(d);})
			.on("mouseout", function(d, i) {return on_mouse_out(d);})
			.on("click", function(d, i) {metric_selected([batch, d])})
			
			
		svg.selectAll(".metrics_text_" + j)
			.data(metrics)
			.enter()
			.append("text")
			.attr("class", "metrics_text_" + j)
			.attr("text-anchor", "middle")
			.attr("height", function(d){return metric_height})
			.attr("width", function(d){return batch_width})
			.attr("x", 10 + (j+0.5) * (batch_width + 10))
			.attr("y", function (d, i) { return batch_height*2 + 10 + (i+0.5) * (metric_height + 10)})
		//	.attr("fill", "#BBB")
			.attr("font-size", "0.9em")
			.on("mouseover", function(d, i) {return on_mouse_over(d);})
			.on("mouseout", function(d, i) {return on_mouse_out(d);})
			.on("click", function(d, i) {metric_selected([batch, d])})
			.text(function(d) {return d})
			
		j += 1;
	});
	
}

function batch_selected(batch) {
	if (batch_dict[batch] == 'active') {
		d3.select('#' + batch).style('fill', base_color);
		batch_dict[batch] = 'inactive';
	} else {
		d3.select('#' + batch).style('fill', active_color);
		batch_dict[batch] = 'active';
	}
}

function metric_selected(batch_metric) {
	var key = batch_metric[0] + '_' + batch_metric[1]

	if (metric_dict[key] == 'active' || metric_dict[key] == 'ready') {
		d3.select('#' + key).style('fill', base_color);
		metric_dict[key] = 'inactive';
	} else {
		d3.select('#' + key).style('fill', active_color);
		metric_dict[key] = 'active';
	}
	
}

function on_mouse_over(d) {
	d3.selectAll('rect').style("cursor", "pointer"); 
	d3.selectAll('text').style("cursor", "pointer"); 

	
}

function on_mouse_out(d) {
		d3.selectAll('rect').style("cursor", "default"); 
	d3.selectAll('text').style("cursor", "default"); 

}

function save() {
	$.ajax({
            type: "POST",
            cache: false,
            contentType: 'application/json',
			data : JSON.stringify({'batches':batch_dict, 'metrics':metric_dict}),
            url: '/save',
            dataType: "json",
            success: function(data) { 
                console.log(data);                    
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
}

function load() {
	$.ajax({
            type: "GET",
            cache: false,
            contentType: 'application/json',
            url: '/load',
            dataType: "json",
            success: function(data) { 
                console.log(data); 
				batch_dict = data.batches;
				metric_dict = data.metrics;
				draw_batches();
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
}

function init() {
	console.log(data.metrics.length)
	var y_save = batch_height*2 + 10 + data.metrics.length * (metric_height + 10) + 20
	console.log(y_save)
	svg = d3.select("body").append("svg");
	svg_width = parseInt(svg.style("width"), 10);
	batch_width = (svg_width - 10*(data.batches.length-1) -20) / data.batches.length
	if (batch_width < 160) {
		batch_width = 160;
	}
	save_button = svg.append("rect")
		.attr("height", 30)
		.attr("width", 80)
		.attr("x", svg_width / 2 - 40)
		.attr("y", y_save)
		.style("fill", '#083')
		.on("mouseover", function(d, i) {return on_mouse_over(d);})
		.on("mouseout", function(d, i) {return on_mouse_out(d);})
		.on("click", function(d, i) {save()})
		
	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("height", 30)
		.attr("width", 80)
		.attr("x", svg_width / 2)
		.attr("y", y_save + 20)
		.attr("font-size", "0.7em")
		.on("mouseover", function(d, i) {return on_mouse_over(d);})
		.on("mouseout", function(d, i) {return on_mouse_out(d);})
		.on("click", function(d, i) {save()})
		.text('Save')
	load();

	
	
}

init();