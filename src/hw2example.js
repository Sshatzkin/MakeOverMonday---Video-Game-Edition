/* global d3 */

const yVal = 'petalLength';
const xVal = 'sepalLength';
console.log(`X Var: ${xVal}, Y Var: ${yVal}`);

// Constants
const width = 600;
const height = 500;

const margin = ({
  top: 100,
  right: 60,
  bottom: 50,
  left: 30,
});
const plotHeight = height - margin.top - margin.bottom;
const plotWidth = width - margin.left - margin.right;


// Get the minimum value from a JSON array by value key
function getMin(data, key) {
  const values = data.map((obj) => obj[key])
    .reduce((p, v) => (p < v ? p : v));
  return values;
}

// Get the maximum value from a JSON array by value key
function getMax(data, key) {
  const max = data.map((obj) => obj[key])
    .reduce((p, v) => (p > v ? p : v));
  return max;
}

// Pulls out the data from the JSON that we need and stores it as two arrays in an object.
function prepData(data) {
  const returnObj = {};
  returnObj.x = data.map((obj) => obj[xVal]);
  returnObj.y = data.map((obj) => obj[yVal]);
  returnObj.s = data.map((obj) => obj.species);
  return returnObj;
}

function plotData(dataObj) {
  // Print first data point
  console.log('Item 0:');
  console.log(dataObj[0]);
  // Find and print maximum and minimum values
  const minX = getMin(dataObj, xVal);
  const maxX = getMax(dataObj, xVal);
  console.log(`Min ${xVal}: ${minX}, Max ${xVal}: ${maxX}`);
  const minY = getMin(dataObj, yVal);
  const maxY = getMax(dataObj, yVal);
  console.log(`Min ${yVal}: ${minY}, Max ${yVal}: ${maxY}`);
  // Create scale
  const xScale = d3.scaleLog()
    .domain([minX - (0.1 * minX), maxX + (0.1 * maxX)])
    .range([plotWidth, 0]);
  console.log(`xScale Test: ${dataObj[0][xVal]} -> ${xScale(dataObj[0][xVal])}`);
  console.log(`xScale Test: ${dataObj[140][xVal]} -> ${xScale(dataObj[140][xVal])}`);

  const yScale = d3.scaleLog()
    .domain([minY - (0.1 * minY), maxY + (0.1 * maxY)])
    .range([0, plotHeight]);
  console.log(`yScale Test: ${dataObj[0][yVal]} -> ${yScale(dataObj[0][yVal])}`);
  console.log(`yScale Test: ${dataObj[140][yVal]} -> ${yScale(dataObj[140][yVal])}`);


  // Convert Data from OBJ to 3 Arrays containing relevant data
  const data = prepData(dataObj);
  console.log(`Item 3 Before Prep: ${[dataObj[3][xVal], dataObj[3][yVal], dataObj[3].species]}`);
  console.log(`Item 3 After Prep: ${[data.x[3], data.y[3], data.s[3]]}`);

  // Selection
  const svg = d3.select('#app')
    .append('svg')
    .attr('height', height)
    .attr('width', width);

  const plot = d3.select('svg')
    .append('g')
    .attr('id', 'plot')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Add Background to plot
  plot
    .append('rect')
    .attr('id', 'background')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', plotHeight)
    .attr('width', plotWidth)
    .style('fill', 'F8F8F8');

  // Color
  const color = d3.scaleOrdinal()
    .domain(['setosa', 'versicolor', 'virginica'])
    .range(['purple', 'violet', 'blue']);

  // Create Data Container
  plot.append('g')
    .attr('id', 'dataContainer');

  // Add Points to graph
  d3.select('#dataContainer').selectAll('dot')
    .data(data.x)
    .join('circle')
    .attr('cx', (d) => xScale(d))
    .attr('cy', (d, i) => yScale(data.y[i]))
    .attr('r', 3)
    .attr('fill', (d, i) => color(data.s[i]))
    .attr('stroke', 'white')
    .attr('class', (d, i) => data.s[i]);

  // Axes
  const xAxis = d3.axisTop(xScale.range([plotWidth, 0]));
  plot
    .append('g')
    .call(xAxis)
    .attr('class', 'xAxis')
    .attr('transform', 'translate(0, 0)');
  const yAxis = d3.axisRight(yScale.range([0, plotHeight]));
  plot
    .append('g')
    .call(yAxis)
    .attr('class', 'yAxis')
    .attr('transform', `translate(${plotWidth}, 0)`);

  // Labels
  svg.append('text')
    .attr('id', 'title')
    .attr('text-anchor', 'middle')
    .attr('x', plotWidth / 2 + margin.left)
    .attr('y', margin.top / 2 - 10)
    .text('Sepal Length vs. Petal Length in Irises');
  svg.append('text')
    .attr('id', 'xAxis Label')
    .attr('text-anchor', 'middle')
    .attr('x', plotWidth / 2 + margin.left)
    .attr('y', margin.top / 2 + 10)
    .text('Sepal Length');
  svg.append('text')
    .attr('id', 'yAxis Label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(90)')
    .attr('y', -plotWidth - margin.left - 40)
    .attr('x', plotHeight / 2 + margin.top)
    .text('Petal Length');

  // Key
  const keyWidth = 300;
  const keyHeight = 30;
  const key = svg.append('g')
    .attr('id', 'key')
    .attr('height', keyHeight)
    .attr('width', keyWidth)
    .attr('transform', `translate(${plotWidth / 2 - keyWidth / 2 + margin.left}, ${plotHeight + margin.top})`);

  key
    .append('rect')
    .attr('height', 10)
    .attr('width', 10)
    .attr('x', 10)
    .attr('y', 10)
    .attr('fill', 'red');

  const keyData = {
    species: ['setosa', 'versicolor', 'virginica'],
    color: ['purple', 'violet', 'blue'],
  };

  key.selectAll('text')
    .data(keyData.species)
    .join('text')
    .attr('x', (d, i) => i * (keyWidth / 3) + 15)
    .attr('y', keyHeight / 2 + 5)
    .text((d) => d);
  key.selectAll('rect')
    .data(keyData.color)
    .join('rect')
    .attr('height', 10)
    .attr('width', 10)
    .attr('x', (d, i) => i * (keyWidth / 3))
    .attr('y', keyHeight / 2 - 3)
    .attr('fill', (d) => d);
}

// Import Data and Call Plotting function
fetch('iris.json')
  .then((d) => d.json())
  .then((data) => plotData(data));
