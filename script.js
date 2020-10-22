// console.log('Tonal', Tonal)

  const scaleNames = Tonal.Scale.names()
  const note = 'C'

  const scaleNotes = scaleNames.map(name => {
    // return {
    //   name: name,
    //   notes: Tonal.Scale.get(`${note} ${name}`).notes }

    return Tonal.Scale.get(`${note} ${name}`)

  })

  // console.log(scaleNotes)