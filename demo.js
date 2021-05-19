async function getMidi() {

    // 2021/02/12: 
    // so far: got a model to predict a note for a pair of notes
    // next: loop recursively over pairs + predictions to get a longer string of notes
    // next next: randomness

    const midi = await Midi.fromUrl("./data/musicnet_midis/Bach/2186_vs6_1.mid")
    // console.log(midi)
    
    const ourNotes = []
    const nextNotes = []

    midi.tracks.forEach(track => {

        if (track.notes.length !== 0) {
            // console.log('track.notes', track.notes)

            const justNotes = track.notes.map(note => note.midi)
            const justNotesPairs = d3.pairs(justNotes)
            const nextNote = justNotesPairs.map((pair, i) => {
                try {
                    return justNotesPairs[i + 1][0]    
                } catch {
                    return 'nothing to see here'
                }
                
            })
            // ourNotes.push(justNotes)
            ourNotes.push(justNotesPairs)
            nextNotes.push(nextNote)
        }
    })

    const ourNotesForModel = ourNotes[0] // Use the first track only for now
    ourNotesForModel.pop() // Remove the last pair
    const nextNotesForModel = nextNotes[0]
    nextNotesForModel.pop()
    // console.log('ourNotesForModel', ourNotesForModel)
    // console.log('nextNotesForModel', nextNotesForModel)

    // const x_train = tf.tensor(ourNotesForModel) //.map(d => d/127)
    // const y_train = tf.tensor(nextNotesForModel.map(d => [d])) 
    
    const x_train_norm = ourNotesForModel.map(d => [d[0] / 127, d[1] / 127])
    const y_train_norm = nextNotesForModel.map(d => d / 127)

    const x_train = tf.tensor(x_train_norm) //ourNotesForModel) //.map(d => d/127)
    const y_train = tf.tensor(y_train_norm) // nextNotesForModel.map(d => [d])) 
    
    console.log('x_train_norm', x_train_norm)
    // console.log(y_train_norm)

    // Make the model with TensorFlow
    const model = tf.sequential(); // A sequential model is appropriate for a plain stack of layers where each layer has exactly one input tensor and one output tensor.

    // Config for layer in objects to feed into tf
    const config_hidden = {
        inputShape: [2], // Corresponds to dimension of x_train, x_test below
        // inputShape: [3], // Corresponds to dimension of x_train, x_test below
        activation: 'sigmoid',
        units: 4 // <- what is this?
    }
    
    const config_output = {
        units: 1, // Dimension of output (y_train)
        // units: 2, // Dimension of output (y_train)
        activation: 'sigmoid'
    }

    // Defining the hidden and output layer
    const hidden = tf.layers.dense(config_hidden);
    const output = tf.layers.dense(config_output);
    
    // Adding layers to model
    model.add(hidden);
    model.add(output);
    
    // Define an optimizer
    const optimize = tf.train.sgd(0.1);
    
    // Config for model
    const config = {
        optimizer: optimize,
        loss: 'meanSquaredError'
    }
    // Compiling the model
    model.compile(config);
    console.log('Model Successfully Compiled');
    // Dummy training data
    // const x_train = tf.tensor([
    //     [0.1, 0.5, 0.1],
    //     [0.9, 0.3, 0.4],
    //     [0.4, 0.5, 0.5],
    //     [0.7, 0.1, 0.9]
    // ])
    // Dummy training labels
    // const y_train = tf.tensor([
    //     [0.2, 0.8],
    //     [0.9, 0.10],
    //     [0.4, 0.6],
    //     [0.5, 0.5]
    // ])
    // Dummy testing data
    
    const x_test = tf.tensor([
        // [0.7, 0.1, 0.9]
        // [88, 92]
        [0.6929133858267716, 0.7244094488188977]
    ])

    resultsArr = []

    train_data().then(function () {
        console.log('Training is Complete');
        // console.log('Predictions :');
        
        model.predict(x_test);
        model.predict(x_test).print();

        x_train_norm.forEach(d => {
            resultsArr.push(model.predict(tf.tensor([d])).arraySync());
        })

        resultsArrJoy = resultsArr.map(d => d[0] * 127)

        // console.log(model.predict(x_test));
        // console.log('joy?', model.predict(x_test).arraySync());
        console.log(resultsArr);
        console.log(resultsArrJoy);

    })

    async function train_data() {
        for (let i = 0; i < 100; i++) {
            // The batch size is a number of samples processed before the model is updated.
            // The number of epochs is the number of complete passes through the training dataset.
            // The size of a batch must be more than or equal to one and less than or equal to the number of samples in the training dataset.
            // The number of epochs can be set to an integer value between one and infinity. 
            const res = await model.fit(x_train, y_train, epoch = 1000, batch_size = 10);
            // console.log(res.history.loss[0]);
            // console.log(res);
        }
    }

    // model.predict(tf.tensor([[89,92]])).print()

    // model.weights.forEach(w => {
    //     console.log(w.name, w.shape);
    //    });

}

getMidi()