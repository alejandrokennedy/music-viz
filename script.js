
// To Do
// Calculate interval for each note in scale
// Define x scale (map data domain to pixel) scaleNames
// Define y scale [1,12]
// Create x axis: add text: name, ticks??
// Create y axis: add text: interval/ semitone/ note name

// Create svg
// Append xAxis, yAxis
// Append group of circles for each note in the scale (x = name, y = interval)
// (Return svg)

const container = d3.select('#container') // creates a d3 selection (the html element is in .node())

// SETUP VARIABLES

const margin = {top: 25, right: 20, bottom: 35, left: 40}
const width = 900
const height = 600

// SETUP CHART SPACE

const svg = container.append('svg')
  .attr('class', 'svg')
  .attr('viewBox', [0, 0, width, height])
  // .attr('width', width)
  // .attr('height', height)
  .style('border', '2px solid magenta')

// DATA

const scaleNames = Tonal.Scale.names()
const note = 'C'
const scalesInfo = scaleNames.map(name => Tonal.Scale.get(`${note} ${name}`))

//intervals.map //.semitones()
console.log(scalesInfo)

// SCALES

console.log(scaleNames)

const x = d3.scaleOrdinal()
  .domain(scaleNames)
  .range([margin.left, width - margin.right])
// can check with e.g. console.log(x('major pentatonic')), or console.log(x.domain())

// const y = d3.scaleOrdinal()
//   .domain()

