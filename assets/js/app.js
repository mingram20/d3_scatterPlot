// @TODO: YOUR CODE HERE!
// use python -m http.server --bind localhost to launch
// set the area for the SVG element
const svgWidth = 1000;
const svgHeight = 700;

// set the margins for SVG element
var margins = {
    top: 40,
    bottom: 90,
    right: 40,
    left: 90
};

// set width and heights based on the SVG margins and parameters set above
var height = svgHeight - margins.top - margins.bottom;
var width = svgWidth - margins.left - margins.right;

// create SVG element variable that will have be selected in the HTML
var svg = d3.select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

// create chartGroup that will contain data using transform so it is fitted into area    
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

// import data from the csv
var dataCSV = 'assets/data/data.csv';

// use d3 function to convert CSV
d3.csv(dataCSV).then(successHandler, errorHandler);

// create error & sucess handling functions
function errorHandler(error) {
    throw error;
};

function successHandler(statesData) {
    // looping through all data and passing in arguments
    statesData.map(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

// create scales
var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.obesity)])
    .range([height, 0]);

// create axes
var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(8);
var leftAxis = d3.axisLeft(yLinearScale);

// append axes to the chartGroup
chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append('g')
    .call(leftAxis);

// create circles for the scatter plot
var circlesGroup = chartGroup.selectAll('circle')
    .data(statesData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.poverty))
    .attr('cy', d => yLinearScale(d.obesity))
    .attr('r', '13')
    .attr('fill', 'teal')
    .attr('opacity', '.70')

// append text to circles    
var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

// set up toolTip
var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
    });

// add toopTip to chart    
chartGroup.call(toolTip);

// create event listeners to display and hide toolTip on mouseover and mouseout
circlesGroup.on('mouseover', function(data) {
    toolTip.show(data,this);
    })
    .on('mouseout', function(data) {
        toolTip.hide(data);
    });

// create axes labels
chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margins.left + 40)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Obese(%)');

chartGroup.append('text')
    .attr('transform', `translate(${width / 2}, ${height + margins.top + 30})`)
    .attr('class', 'axisText')
    .text('Poverty(%)');
};