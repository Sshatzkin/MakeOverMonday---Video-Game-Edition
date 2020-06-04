// example of how to export functions
// this particular util only doubles a value so it shouldn't be too useful
// d3 imports
import * as d3 from "d3";

export function getChildWidth(width, margin){
  return width - margin.left - margin.right;
}

export function getChildHeight(height, margin){
  return height - margin.top - margin.bottom;
}

export function appendDots(parent, x, y){
  const dotDist = 10;
  const dotRadius = 2;
  const width = (2 * dotDist) + (3*dotRadius);
  const height = dotDist + (2*dotRadius);
  
  const dotGroup = parent.append('g')
    .attr('class', 'dot-group')
    .attr('anchor', 'middle')
    .attr('transform', `translate(${x - (width/2)}, ${y - (height/2)})`);

  
  
  for (let i = 0; i < 6; i++) {
    dotGroup.append('circle')
      .attr('class','dot')
      .attr('r', dotRadius)
      .attr('transform', `translate(${dotDist * (i%3)}, ${dotDist * (i%2)})`)
      .style('fill','gray');
  }
  return dotGroup;
}

export function appendDpad(parent, parentWidth, x, y){
  const width = parentWidth * 0.137;
  const width2 = parentWidth * 0.05;
  const dpad = parent.append('g')
    .attr('id', 'dpad')
    .attr('transform', `translate(${x}, ${y})`);
  
  dpad.append('rect')
    .attr('width', width)
    .attr('height', width2)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('transform', `translate(${0}, ${width/2 - width2/2})`)
    .style('fill', 'Gainsboro')
    .style('stroke', 'darkGray')
    .style('stroke-width', 2);

  dpad.append('rect')
    .attr('width', width2)
    .attr('height', width)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('transform', `translate(${width/2 - width2/2}, ${0})`)
    .style('fill', 'Gainsboro')
    .style('stroke', 'darkGray')
    .style('stroke-width', 2);

  dpad.append('rect')
    .attr('width', width2 + 4)
    .attr('height', width2 - 2)
    .attr('transform', `translate(${width/2 - width2/2 - 2}, ${width/2 - width2/2 + 1})`)
    .style('fill', 'Gainsboro')
    

  return dpad;
}

export function appendButtons(parent, parentWidth, x, y){
  const buttonRadius = parentWidth * 0.023;
  const buttonDist = parentWidth * 0.053;

  const buttons = parent.append('g')
    .attr('id', 'button-container')
    .attr('transform', `translate(${x}, ${y})`);
  
  for (let j = 0; j < 2; j++){
    for (let i = 0; i < 2; i++) {
      buttons.append('circle')
        .attr('class','button')
        .attr('r', buttonRadius)
        .attr('cx', (((i%2) + j) * buttonDist) + buttonRadius)
        .attr('cy', ((((i + 1) %2) + j) * buttonDist) + buttonRadius)
        .style('fill', 'Gainsboro')
        .style('stroke', 'darkGray')
        .style('stroke-width', 2);
    }
  }
  

}

export function tickWrap(text, width) {
  // eslint-disable-next-line func-names
  text.each(function() {
    // eslint-disable-next-line no-invalid-this
    text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word = "";
    let line = [];
    let  lineNumber = 0;
    const  lineHeight = 1.1; 
    const  y = text.attr("y");
    const  dy = parseFloat(text.attr("dy"));
    let  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", `${dy}em`);
    // eslint-disable-next-line no-cond-assign
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word);
      }
    }
  });
}

export function buildDonut(allData, columnData,  parent, x, y, radius){
  const donut = parent.append('g')
    .attr('id', `donut-${columnData}`)
    .attr('class', 'donut')
    .attr('transform', `translate(${x}, ${y})`);

  const data = allData.map((d) => {
      return {
        Category: d.Category,
        Data: d[columnData]
      }
    });

  // Set color scheme
  const color = d3.scaleOrdinal()
    .domain([data.Category])
    .range(['#C8F26D', '#05C7F2', '#b18eff', '#D90467']);
  
  // Create pie "axis"
  const pie = d3.pie()
    .sort(null)
    .value((d) => {return d.value.Data;});

  // Set up data on pie
  const dataPie = pie(d3.entries(data));

  // Arc generator (Δ)
  const arc = d3.arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  // Second arc for labels
  const labelArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Build the chart
  donut
    .selectAll('allSlices')
    .data(dataPie)
    .enter()
    .append('path')
    .attr('class', 'donut-slice')
    .attr('d',arc)
    .style('fill', (d) => {return (color(d.data.key))})
    .style('stroke', 'white')
    .style('stroke-width', '2px');
  
  // Add lines for labels
  donut
  .selectAll('allPolylines')
  .data(dataPie)
  .enter()
  .append('polyline')
    .attr('class', 'label-line')
    .attr("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1)
    .attr('points', (d) => {
      const posA = arc.centroid(d);
      const posB = labelArc.centroid(d);
      const posC = labelArc.centroid(d); 
      
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      const Offset = radius / 6;
      posC[1] = posC[1] + (posC[1] > radius/2 ? -Offset : 0 ) + (posC[1] < -radius/2 ? Offset : 0);
      return [posA, posB, posC,];
    });

    // Add labels
    donut
      .selectAll('allLabels')
      .data(dataPie)
      .enter()
      .append('text')
        .text((d) => {return `${100 * d.data.value.Data}% - ${d.data.value.Category}`;})
        .attr('transform', (d) => {
          const pos = labelArc.centroid(d);
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          const Offset = radius / 6;
          pos[1] = pos[1] + (pos[1] > radius/2 ? -Offset : 0 ) + (pos[1] < -radius/2 ? Offset : 0);
          return `translate(${pos})`;
        })
        .attr('dy', 0.2)
        .style('text-anchor', (d) => {
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          return (midangle < Math.PI ? 'start' : 'end')
        })
        .style('font-size', '11')
        .call(tickWrap,110);


    // Return svg selection containing donut plot
    return donut;
}