var base_color = '#223';
var active_color = "#0A5"
var not_ready_color = "#A05"
var button_color = '#083'

batch_height = 40;
batch_width = 160;

metric_height = 35;

batch_dict = {};
metric_dict = {};
models = {};

current_metric = '';
check_interval = null;
	
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
			.style("fill", function (d, i) {if (metric_dict[batch + '_' + d] == 'active'){return active_color} else if (metric_dict[batch + '_' + d] != 'ready'){return not_ready_color} else{return base_color}})
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
	/*
	svg.selectAll(".generate")
			.data(metrics)
			.enter()
			.append("rect")
			.attr("class", "generate")
			.attr("id", function(d, i){ return 'generate_' + d})
			.attr("height", function(d){return metric_height})
			.attr("width", 100)
			.attr("rx", 18)
			.attr("ry", 18)
			.attr("x", 10 + j * (batch_width + 10))
			.attr("y", function (d, i) { return batch_height*2 + 10 + i * (metric_height + 10)})
			.style("fill", button_color)
			.on("mouseover", function(d, i) {return on_mouse_over(d);})
			.on("mouseout", function(d, i) {return on_mouse_out(d);})
			.on("click", function(d, i) {generate_data(d, 100)})
			
			
		svg.selectAll(".generate_text_")
			.data(metrics)
			.enter()
			.append("text")
			.attr("id", function(d){return "generate_text_" + d})
			.attr("text-anchor", "middle")
			.attr("height", function(d){return metric_height})
			.attr("width", 100)
			.attr("x", 10 + (j) * (batch_width + 10) + 50)
			.attr("y", function (d, i) { return batch_height*2 + 10 + (i+0.5) * (metric_height + 10)})
		//	.attr("fill", "#BBB")
			.attr("font-size", "0.9em")
			.on("mouseover", function(d, i) {return on_mouse_over(d);})
			.on("mouseout", function(d, i) {return on_mouse_out(d);})
			.on("click", function(d, i) {generate_data(d, 100)})
			.text('generate')
	*/
}

function update_metrics(data) {
	for (const [key, value] of Object.entries(data)) {
		d3.select('#' + key).style("fill", function() {if (value == 1 ){return base_color} else {return not_ready_color}});

		console.log(key, value);
	  }

}

function batch_selected(batch) {
	metrics = data.metrics
	console.log(metrics);
	if (batch_dict[batch] == 'active') {
		d3.select('#' + batch).style('fill', base_color);
		batch_dict[batch] = 'inactive';

		metrics.forEach(function(metric) {
			key = batch + '_' + metric
			if (models[key] == 1) {
				d3.select('#' + key).style('fill', base_color);
				metric_dict[key] = 'inactive';
			}
		})
	} else {
		d3.select('#' + batch).style('fill', active_color);
		batch_dict[batch] = 'active';
		metrics.forEach(function(metric) {
			key = batch + '_' + metric
			if (models[key] == 1) {
				d3.select('#' + key).style('fill', active_color);
				metric_dict[key] = 'active';
			}
		})
	}
}

function metric_selected(batch_metric) {
	var key = batch_metric[0] + '_' + batch_metric[1]
	if (models[key] == 1) {
		if (metric_dict[key] == 'active' || metric_dict[key] == 'ready') {
			d3.select('#' + key).style('fill', base_color);
			metric_dict[key] = 'inactive';
		} else {
			d3.select('#' + key).style('fill', active_color);
			metric_dict[key] = 'active';
		}
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

function check_state(metric) {
		$.ajax({
            type: "GET",
            cache: false,
            contentType: 'application/json',
            url: '/state',
            dataType: "json",
            success: function(data) { 
				for(var key in data) {
					var current_size = data[key];
					d3.select('#generate_text_' + key).text(current_size); 
				}
            },
            error: function(jqXHR) {
                alert("error: " + jqXHR.status);
                console.log(jqXHR);
            }
        })
}

function generate_data() {

	$.ajax({
            type: "POST",
            cache: false,
            contentType: 'application/json',
            url: '/generate',
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


function available_models() {
	$.ajax({
            type: "GET",
            cache: false,
            contentType: 'application/json',
            url: '/models',
            dataType: "json",
            success: function(data) { 
				models = data;
				update_metrics(data);
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
	batch_width = (svg_width - 10 *(data.batches.length-1) -20) / data.batches.length
	if (batch_width < 120) {
		batch_width = 120;
	}
	save_button = svg.append("rect")
		.attr("height", metric_height)
		.attr("width", 140)
		.attr("rx", 18)
		.attr("ry", 18)
		.attr("x", svg_width / 2 - 150)
		.attr("y", y_save)
		.style("fill", button_color)
		.on("mouseover", function(d, i) {return on_mouse_over(d);})
		.on("mouseout", function(d, i) {return on_mouse_out(d);})
		.on("click", function(d, i) {save()})
		
	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("height", metric_height)
		.attr("width", 140)
		.attr("x", svg_width / 2 - 80)
		.attr("y", y_save + 20)
		.attr("font-size", "0.9em")
		.on("mouseover", function(d, i) {return on_mouse_over(d);})
		.on("mouseout", function(d, i) {return on_mouse_out(d);})
		.on("click", function(d, i) {save()})
		.text('Save Config')


		save_button = svg.append("rect")
		.attr("height", metric_height)
		.attr("width", 140)
		.attr("rx", 18)
		.attr("ry", 18)
		.attr("x", svg_width / 2 + 10)
		.attr("y", y_save)
		.style("fill", button_color)
		.on("mouseover", function(d, i) {return on_mouse_over(d);})
		.on("mouseout", function(d, i) {return on_mouse_out(d);})
		.on("click", function(d, i) {generate_data()})
		
	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("height", metric_height)
		.attr("width", 140)
		.attr("x", svg_width / 2 + 80)
		.attr("y", y_save + 20)
		.attr("font-size", "0.9em")
		.on("mouseover", function(d, i) {return on_mouse_over(d);})
		.on("mouseout", function(d, i) {return on_mouse_out(d);})
		.on("click", function(d, i) {generate_data()})
		.text('Generate Batch')
	load();
	available_models();
	
	
}

init();