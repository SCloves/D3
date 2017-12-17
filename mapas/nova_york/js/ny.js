

// domínio das cores

var income_domain = [0, 10000, 50000, 70000, 80000, 150000, 290000, 360000]
var income_color = d3.scaleThreshold()
	.domain(income_domain)
	.range(d3.schemeGreens[7]);	

var poverty_domain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
var poverty_color = d3.scaleThreshold()
	.domain(poverty_domain)
	.range(d3.schemeReds[4]);	


// income
var incomeData = d3.map();

// poverty
var povertyData = d3.map();

// fazendo o load do mapa topojson
// e dos dados

d3.queue()
	.defer(d3.json, 'data/ny-quantize-topo.json')
	.defer(d3.csv, 'data/income.csv', function(d){
		if (isNaN(d.income)) {
			incomeData.set(d.id, 0);
		} else { incomeData.set(d.id, +d.income) }}
	 	)
	.defer(d3.csv, 'data/poverty.csv',  function(d){ 
		if (d.poverty == '-') {
			povertyData.set(d.id, 0);}
		else{povertyData.set(d.id, +d.poverty) }
			})
	.await(ready);


function ready(error, data) {

	if (error) throw error;

	// new york
	var new_york = topojson.feature(data, {
		type:'GeometryCollection',
		geometries: data.objects.ny.geometries});


	// projection
	var projection = d3.geoAlbersUsa()
		.fitExtent([ [20, 20], [460, 580] ], new_york);

	// path
	var geoPath = d3.geoPath()
		.projection(projection);

	// desenhar o mapa do income
	d3.select('svg.income').selectAll('path')
		.data(new_york.features)
		.enter()
			.append('path')
			.attr('d', geoPath)
			.attr('fill', function(d){
				var value = incomeData.get(d.properties.GEOID);
				return ( value != 0 ? income_color(value) : 'lightblue' );
			});


	// desenhar o mapa poverty
	d3.select('svg.poverty').selectAll('path')
		.data(new_york.features)
		.enter()
			.append('path')
			.attr('d', geoPath)
			.attr('fill', function(d){
				var value = povertyData.get(d.properties.GEOID);
				return ( value != 0 ? poverty_color(value) : 'lightblue' );
			});

	};