
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

// SET UP VARIABLES

const margin = {top: 25, right: 20, bottom: 35, left: 40}
const width = 900
const height = 600

// SET UP CHART SPACE
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
scalesInfo.map(d => Object.assign(d, {semitones: d.intervals.map(d => Tonal.Interval.semitones(d))}))
console.log(scalesInfo)

// SCALES
const xScale = d3.scaleBand()
  .domain(scaleNames)
  .range([margin.left, width - margin.right])
// can check with e.g. console.log(x('major pentatonic')), or console.log(x.domain())

const yScale = d3.scaleBand()
  .domain(d3.range(12))
  .range([height - margin.top, margin.bottom])

const colourScale = d3.scaleSequential()
  .domain([0,11])
  .interpolator(d3.interpolateRainbow)

// Synthesize information for plots
const plotInfo = scalesInfo.map(d => ({
      xPos: xScale(d.type),
      yPos: d.semitones.map(i => yScale(i)),
      colours: d.semitones.map(i => colourScale(i))
    })
)

// VIZ
// Create groups from elements in plotInfo (corresponds to scale types)
const g = d3.select(svg.node()).selectAll('g')
      .data(plotInfo).enter().append('g')

// Create circles for each element in array in plotInfo (corresponds to semitones in that scale)
const circles = g.selectAll('circle')
      .data(d => {
              return d['yPos'].map((y,i) => {
                return Object.assign({}, d, {yPos: d.yPos[i], colour: d.colours[i]})
              })
            }).enter().append('circle')
      .attr("cx", d => d.xPos)
      .attr("cy", d => d.yPos)
      .attr("fill", d => d.colour)
      .attr("fill-opacity", 0.5)
      .attr("r", 5)


