// to do: 
// - axis titles (and chart title?)
// - hover functionality? note sounds? 
// later:
// link with scale explorer
// - have scales clickable to select scale flavour? 
// - primary highlight on note of scale playing 
// - but also subtly highlight same note (other scales)
// - sort scales by criteria (most-least similar? diff. criteria for sort and/or filter)
// secondary vis or controls on side (e.g. rhythm, tonic, octave...)


const container = d3.select('#container') // creates a d3 selection (the html element is in .node())
const bounds = container.node().getBoundingClientRect()

// SET UP VARIABLES

const margin = {top: 25, right: 20, bottom: 35, left: 150}
const width = bounds.width
const height = bounds.height

// SET UP CHART SPACE
const svg = container.append('svg')
  .attr('class', 'svg')
  .attr('viewBox', [0, 0, width, height])
  // .attr('width', width)
  // .attr('height', height)
  // .style('border', '2px solid magenta')

// DATA
const scaleNames = Tonal.Scale.names()
const note = 'C'
const scalesInfo = scaleNames.map(name => Tonal.Scale.get(`${note} ${name}`))
// Calculate semitones from intervals for each scale type
scalesInfo.map(d => Object.assign(d, {semitones: d.intervals.map(d => Tonal.Interval.semitones(d))}))

console.log('scalesInfo', scalesInfo)

// SCALES
const xScale = d3.scalePoint() // d3.scaleBand()
  .domain(d3.range(12))
  .range([margin.left, width - margin.right])
// can check with e.g. console.log(x('major pentatonic')), or console.log(x.domain())

const yScale = d3.scalePoint() // d3.scaleBand()
  .domain(scaleNames)
  .range([height - margin.bottom, margin.top])

const colourScale = d3.scaleSequential()
  .domain([0,11])
  .interpolator(d3.interpolateRainbow)


// AXES
const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale)
      .tickFormat(d => d + 1) // add 1 to tick labels
    )
    .call(g => {
      g.select(".domain").remove() // remove main axis line
      g.selectAll(".tick line").remove() // remove tick lines
    })

const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale)
      .tickSize(-width + margin.left + margin.right))
    .call(g => {
      g.select(".domain").remove() // remove main axis line
      g.selectAll(".tick line") // change tick length and opacity
      .attr("stroke-opacity", 0.2)
      .attr("stroke-dasharray", "4,2")
      g.selectAll(".tick text") // nudge labels over
      .attr("dx", -4)
    })

svg.append("g").call(xAxis);
svg.append("g").call(yAxis);

// VIZ
const g = svg.selectAll('.scaleGroup') // Create scale groups
      .data(scalesInfo)
      .join('g')
      .attr('class', 'scaleGroup')
      .attr('transform', d => `translate(0, ${yScale(d.type)})`)
      
const circles = g.selectAll('circle') // Create a circle for each semitone in the scale
      .data(d => d.semitones)
      .join('circle')
      .attr("cx", note => xScale(note))
      .attr("cy", 0)
      .attr("fill", note => colourScale(note))
      .attr("fill-opacity", 0.5)
      .attr("r", 5)


    


      
// // Synthesize information for plots
// const plotInfo = scalesInfo.map(d => ({
//   yPos: yScale(d.type),
//   xPos: d.semitones.map(i => xScale(i)),
//   colours: d.semitones.map(i => colourScale(i))
// })
// )

// // Create groups from elements in plotInfo (corresponds to scale types)
// const g = svg.selectAll('g')
// .data(plotInfo).enter().append('g')

// // Create circles for each element in array in plotInfo (corresponds to semitones in that scale)
// const circles = g.selectAll('circle')
// .data(d => {
//         return d['xPos'].map((x,i) => {
//           return Object.assign({}, d, {xPos: d.xPos[i], colour: d.colours[i]})
//         })
//       }).enter().append('circle')
// .attr("cx", d => d.xPos)
// .attr("cy", d => d.yPos)
// .attr("fill", d => d.colour)
// .attr("fill-opacity", 0.5)
// .attr("r", 5)


