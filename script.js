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
const margin = {top: 150, right: 20, bottom: 150, left: 150}
const width = bounds.width // window.innerWidth * 0.8 
const height = 1200;

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

const semitoneNames = {
  0: "P1 / d2",
  1: "m2 / A1",
  2: "M2 / d3",
  3: "m3 / A2",
  4: "M3 / d4",
  5: "P4 / A3",
  6: "d5 / A4",
  7: "P5 / d6",
  8: "m6 / A5",
  9: "M6 / d7",
  10: "m7 / A6",
  11: "M7 / d8"
}

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
const xAxisFormat = (g, pos) => g
  .call(g => {
    g.select(".domain").remove() // remove main axis line
    g.selectAll(".tick line").remove() // remove tick lines
  })
  .call(g => {
    g.selectAll("text")
      .attr('class', 'semitone label')
  })
  .call(g => { // add annotation to each tick
    g.selectAll(".tick")
      .append("text")
        .attr('fill', 'black')
        .attr('class', 'interval label')
        .attr('y', pos == 'top' ? '-1.5rem' : '1.8rem')
        .text(d => semitoneNames[d])
  })

const xAxisBottom = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(xScale)
    // .tickFormat(d => d + 1) // add 1 to tick labels
  )
  .call(xAxisFormat)

const xAxisTop = g => g
  .attr("transform", `translate(0,${margin.top})`)
  .call(d3.axisTop(xScale))
  .call(xAxisFormat, 'top')

// & axis titles
const xTitle = (g, pos) => g
  .append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .attr('class', 'semitone title')
    .attr('x', (width)/2 + margin.left - margin.right)
    .attr('y', pos == 'top' ? -60 : 70)
    .text('Semitones above the tonic')

const xSubtitle = (g, pos) => g
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .attr('class', 'interval title')
    .attr('x', (width)/2 + margin.left - margin.right)
    .attr('y', pos == 'top' ? -75 : 85)
    .text('Interval')

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
  .selectAll("text")
  .style("font-style", "oblique")

const yTitle = g => g
  .append('text')
    .attr('text-anchor', 'end')
    .attr('fill', 'black')
    .attr('x', -30)
    .attr('y', margin.top - 10)
    .attr('class', 'scale title')
    .text('↓ scale type')

const mainTitle = g => g
  .append('text')
    .attr('class', 'chart-title')
    .attr('fill', 'grey')
    .attr('font-size', '3rem')
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'start')
    .attr('x', 0)
    .attr('y', margin.top/2)
    .text('notes on a scale')

// Call axes above
svg.append("g")
  .call(xAxisBottom)
  .call(xTitle)
  .call(xSubtitle)

svg.append("g")
  .call(xAxisTop)
  // .call(xTitle, 'top')
  // .call(xSubtitle, 'top')

svg.append("g")
  .call(yAxis)
  .call(yTitle)

svg.call(mainTitle)

// VIZ
const g = svg.selectAll('.scaleGroup') // Create scale groups and move them into position
  .data(scalesInfo)
  .join('g')
  .attr('class', 'scaleGroup')
  .attr('transform', d => `translate(0, ${yScale(d.type)})`)
  
const circles = g.selectAll('circle') // Create a circle for each semitone in the scale (group)
  .data(d => {
    // console.log(d)
    // console.log(d.semitones)

    const noteDataArr = []
    d.semitones.forEach((semitone, i) => {
      newObj = {}
      newObj.semitone = semitone
      newObj.note = d.notes[i]
      noteDataArr.push(newObj)
    })

    // console.log(noteDataArr)
    
    return noteDataArr
    // return d.semitones
  })
  .join('circle')
  .attr("cx", note => xScale(note.semitone))
  .attr("cy", 0)
  .attr("fill", note => colourScale(note.semitone))
  .attr("fill-opacity", 0.5)
  .attr("r", 5)
  // .on('mouseover', function() {
  //   // console.log('data', d3.select(this).data()[0].note)
  //   playSomething(this)
  //   // playSomething()
  // })
  .on('mouseover', handleMouseover)

let synth;

function handleMouseover(event) {
  console.log(event)
  let element = event.target
  const note = d3.select(element).data()[0].note+"4"
  playSomething(note)
}

function playSomething(note) {
  if (!synth) synth = new Tone.Synth().toDestination()
  synth.triggerAttackRelease(note, "8n");
}