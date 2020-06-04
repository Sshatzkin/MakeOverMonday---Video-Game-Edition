// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');
// this command imports the css file, if you remove it your css wont be applied!
import './main.css';
// example of importing a util function you define
import {appendDpad, appendDots, tickWrap, appendButtons, buildDonut} from './utils';
import {getChildHeight} from './utils';
import {getChildWidth} from './utils';
// d3 imports
import * as d3 from "d3";

domReady(() => {
  // this is just one example of how to import data. there are lots of ways to do it!
  Promise.all([
      d3.csv('./data/Adults vs. Teens - Sheet1.csv'),
      d3.csv('./data/Adults vs. Teens - Sheet2.csv'),
  ])
    // this one sends that data your vis function down below
    .then(data => buildVis(data))
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(e);
    });
  // if you need to import several datasets you can do something like:
  // Promise.all([
  //   fetch('./data/example-1.json').then(x => x.json()),
  //   fetch('./data/example-2.json').then(x => x.json()),
  // ]).then((results) => myVis(results));
});

function buildBackground(selection, width, height, margin){
  // Create a background group to hold the bg elements
  const background = selection.append('g')
    .attr('id', "background")
    .attr('x', 0)
    .attr('y', 0)
  
  // Add a rectangle to fill the bg
  background.append('rect')
    .attr('id', 'bg-fill')
    .attr('width', width)
    .attr('height', height)
    .attr('rx', 20)
    .attr('ry', 20)
    .style('margin', '10px')
    .style('fill', 'F8F8F8');
  
  // Calculate screenwidth
  const screenWidth = getChildWidth(width, margin);
  const screenHeight = (3/4) * screenWidth;
  const screenBorder = 10;
  // Append the screen border
  background.append('rect')
    .attr('id', 'screen-1-bg')
    .attr('width', screenWidth + 2*screenBorder)
    .attr('height', screenHeight + 2*screenBorder)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('transform', `translate(${margin.left-screenBorder}, ${margin.top-screenBorder})`)
    .style('fill', 'Gainsboro')
    .style('stroke', 'darkGray')
    .style('stroke-width', 2);
  
  // Append the screen
  background.append('rect')
    .attr('id', 'screen-1-bg')
    .attr('width', screenWidth)
    .attr('height', screenHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .style('fill', '#F5FFFA');

  // Append the second screen border
  background.append('rect')
    .attr('id', 'screen-2-bg')
    .attr('width', screenWidth + 2*screenBorder)
    .attr('height', screenHeight + 2*screenBorder)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('transform', `translate(${margin.left-screenBorder}, ${margin.top2-screenBorder})`)
    .style('fill', 'Gainsboro')
    .style('stroke', 'darkGray')
    .style('stroke-width', 2);
  
  // Append the second screen
  background.append('rect')
    .attr('id', 'screen-2-bg')
    .attr('width', screenWidth)
    .attr('height', screenHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top2})`)
    .style('fill', '#F5FFFA');

  appendDots(background, margin.left/2, margin.top + screenHeight/2);
  appendDots(background, width - margin.right/2, margin.top + screenHeight/2);

  // Append the decorative bar
  const barHeight = height * 0.07;
  const bar = background.append('g')
    .attr('id', 'hinge')
    .attr('transform', `translate(${0}, ${height * 0.47})`);
  
  bar.append('rect')
    .attr('id', 'bar-fill')
    .attr('width', width)
    .attr('height', barHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .style('fill', '#F8F8F8')
    .style('stroke', 'Gainsboro')
    .style('stroke-width', 2);

  const lineHeight = height * 0.03;
  // Append two lines
  for (let i = 0; i < 2; i++) {
    bar.append('rect')
      .attr('id', 'bar-fill')
      .attr('width', 4)
      .attr('height', lineHeight)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('x', (width * 0.91) + (i * 10))
      .attr('y', barHeight/2 - lineHeight/2)
      .style('fill', 'rgb(200, 242, 109)')
      .style('stroke', 'Gainsboro')
      .style('stroke-width', 2);
    }

  appendDpad(background, width, width * 0.05, height * 0.64);
  appendButtons(background, width, width * 0.79, height * 0.62);
  
  return background;
}

function buildSticker(parent, x, y, width, height){
  const rotation = -20;
  
  const sticker = parent.append('g')
    .attr('id', 'sticker')
    .attr('transform', `translate(${x}, ${y}) rotate(${rotation}) `);

  const cx = width/2;
  const cy = height/2;


  
  sticker.append('ellipse')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('rx', width)
    .attr('ry', height)
    .style('fill', 'white')
    .style('stroke', 'gray')
    .style('stroke-width', '1px');

    sticker.append('ellipse')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('rx', width - 8)
    .attr('ry', height - 8)
    .style('fill', 'rgb(217, 4, 103)');


  sticker.append('text')
    .attr('transform', `translate(${cx}, ${cy - 12})`)
    .attr('text-anchor', 'middle')
    .text('53% of American Adults are Gamers')
    .style('fill', 'white')
    .attr('dy', 0.2)
    .call(tickWrap, 150);

  return sticker;
}

function buildPlot(data, parent, x, y, width, height){
  // Create plot
  const plot = parent.append('g')
    .attr('id', 'plot1')
    .attr('transform', `translate(${x}, ${y})`);

  // Plot Background
  plot.append('rect')
    .attr('class', 'plot-bg')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', height)
    .attr('width', width)
    .style('fill', '#F5FFFA');

  // Prepare data
  const subgroups = data.columns.slice(1);
  const groups = d3.map(data, (d)=>{return(d.Category);}).keys();

  // Create and Append X-Axis
  const xAxis = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2]);
  
  plot.append('g')
    .attr('id', 'plot1-x-axis')
    .attr('transform', `translate(${0},${height})`)
    .call(d3.axisBottom(xAxis).tickSize(0))
    .selectAll("text")
      .attr('dy', '1')
      .call(tickWrap, 80);

  // Create and append y-axis
  const yScale = d3.scaleLinear()
    .domain([0,1])
    .range([height, 0]);
  plot.append('g')
    .attr('id', 'plot1-y-axis')
    .attr('transform', `translate(${0}, ${0})`)
    .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')));

  // Subgroup scale
  const subAxis = d3.scaleBand()
    .domain(subgroups)
    .range([0, xAxis.bandwidth()])
    .padding([0.05]);

  // Color palette
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#C8F26D','#05C7F2']);
  
  // Show the bars
  plot.append('g')
    .selectAll('g')
  // Enter in data
    .data(data)
    .enter()
    .append('g')
      .attr('transform', (d, i) => { 
        return `translate(${xAxis(d.Category)}, 0)`;} )
    .selectAll('rect')
    .data((d) => { return subgroups.map((key) => { return {key, value: d[key]}; }); })
    .enter().append("rect")
      .attr('x', (d) => {
        return subAxis(d.key);})
      .attr('y', (d) => {return yScale(d.value);})
      .attr('width', subAxis.bandwidth())
      .attr('height', (d) => {return height - yScale(d.value);})
      .attr('fill', (d) => {return color(d.key);});
  
  // Labels
  plot.append('text')
    .attr('id', 'plot1-title')
    .attr('class', 'plot-label')
    .attr('text-anchor', 'middle')
    .attr('x', width/2 - 10)
    .attr('y', -20)
    .style('fill', 'black')
    .text('Use of Gaming Devices, Adults vs Teens');
  
  // Key
  // Key
  const keyWidth = 200;
  const keyHeight = 30;
  const key = plot.append('g')
    .attr('id', 'key')
    .attr('height', keyHeight)
    .attr('width', keyWidth)
    .attr('transform', `translate(${width / 2 - keyWidth / 2}, ${height + 25})`);

  key.selectAll('text')
    .data(subgroups)
    .join('text')
    .attr('class', 'key-text')
    .attr('x', (d, i) => i * (keyWidth / 2) + 15)
    .attr('y', keyHeight / 2 + 6)
    .text((d) => d);
  key.selectAll('rect')
    .data(subgroups)
    .join('rect')
    .attr('height', 10)
    .attr('width', 10)
    .attr('x', (d, i) => i * (keyWidth / 2))
    .attr('y', keyHeight / 2 - 3)
    .attr('fill', (d) => color(d));

  // End function and return plot selection
  return plot;
}


function buildDonutPlot(data, parent, x, y, width, height){
  // Create plot
  const plot = parent.append('g')
    .attr('id', 'plot2')
    .attr('transform', `translate(${x}, ${y})`);

  const donutWidth = height / 4;
  buildDonut(data, 'Parents', plot, donutWidth, height * 0.3, donutWidth);
  buildDonut(data, 'Non-Parents', plot, width - donutWidth, height * 0.8, donutWidth);
  
  // Add titles and labels
  plot.append('text')
    .attr('class', 'plot-label')
    .attr('transform', `translate(${width/2}, ${10})`)
    .style('text-anchor', 'middle')
    .style('font-size', '14')
    .text('Use of Gaming Devices, Parents vs. Non-Parents');

  plot.append('text')
    .attr('transform', `translate(${width * 0.75}, ${height * 0.3})`)
    .attr('text-anchor', 'middle')
    .text('<- Parents');

  plot.append('text')
    .attr('transform', `translate(${width * 0.20}, ${height * 0.75})`)
    .attr('text-anchor', 'middle')
    .text('Non-Parents -> ');

  return plot;
}



function buildVis(data) {
  // Widths and heights of the overall vis
  const backgroundWidth = 850;
  const backgroundHeight = (1.04) * backgroundWidth;
  const backgroundMargin = {top: backgroundHeight * 0.07, top2: backgroundHeight * 0.58, left: backgroundWidth * 0.27,
     bottom: 50, right: backgroundWidth * 0.27};
  // eslint-disable-next-line no-console
  console.log(`Background (w: ${backgroundWidth}, h: ${backgroundHeight})`);
  // Widths and heights of the inlaid screens
  const screenWidth = getChildWidth(backgroundWidth, backgroundMargin);
  const screenHeight = (3/4) * screenWidth;
  const screenMargin = {top: 50, left: 50, bottom: 60, right: 10};
  // eslint-disable-next-line no-console
  console.log(`Screen (w: ${screenWidth}, h: ${screenHeight})`);
  // Widths and Heights of the plots on the screens
 
  const plotWidth = getChildWidth(screenWidth, screenMargin);
  const plotHeight = getChildHeight(screenHeight, screenMargin);
  // eslint-disable-next-line no-console
  console.log(`Plot (w: ${plotWidth}, h: ${plotHeight})`);

  const screenMargin2 = {top:10, left: 10, bottom: 10, right: 10};
  const donutPlotWidth = getChildWidth(screenWidth, screenMargin2);
  const donutPlotHeight = getChildHeight(screenHeight, screenMargin2);

  // Create the svg
  const svg = d3.select('#app')
    .append('svg')
    .attr('height', backgroundHeight)
    .attr('width', backgroundWidth);
  
  // Append the background to it
  buildBackground(svg, backgroundWidth, backgroundHeight, backgroundMargin);
  
  
  // Call the sticker appending function
  buildSticker(svg, backgroundWidth * 0.06, backgroundHeight * 0.07,
     backgroundWidth * 0.12, backgroundHeight * 0.06);

  const screen1 = svg.append('g')
    .attr('id', 'screen1')
    .attr('transform', `translate(${backgroundMargin.left}, ${backgroundMargin.top})`);
  
  // Call the plot building function
  buildPlot(data[0], screen1, screenMargin.left, screenMargin.top,  plotWidth, plotHeight);

  const screen2 = svg.append('g')
    .attr('id', 'screen2')
    .attr('transform', `translate(${backgroundMargin.left}, ${backgroundMargin.top2})`);

  // Call the donut plot building function
  buildDonutPlot(data[1], screen2, screenMargin2.left, screenMargin2.top, donutPlotWidth, donutPlotHeight);

}

