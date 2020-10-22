async function getMidi() {

    const midi = await Midi.fromUrl("./data/musicnet_midis/Bach/2186_vs6_1.mid")

    const ourNotes = []

    midi.tracks.forEach(track => {

        if (track.notes.length !== 0) {
            // console.log('track.notes', track.notes)

            const justNotes = track.notes.map(note => note.midi)
            // console.log('justNotes', justNotes)

        }
    })

    // Make the model with TensorFlow
    const model = tf.sequential(); // A sequential model is appropriate for a plain stack of layers where each layer has exactly one input tensor and one output tensor.

    // Config for layer in objects to feed into tf
    const config_hidden = {
        inputShape: [3], // (?) Corresponds to dimension of x_train, x_test below
        activation: 'sigmoid',
        units: 4 // <- what is this?
    }
    
    const config_output = {
        units: 2, // Dimension of output
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
    const x_train = tf.tensor([
        [0.1, 0.5, 0.1],
        [0.9, 0.3, 0.4],
        [0.4, 0.5, 0.5],
        [0.7, 0.1, 0.9]
    ])
    // Dummy training labels
    const y_train = tf.tensor([
        [0.2, 0.8],
        [0.9, 0.10],
        [0.4, 0.6],
        [0.5, 0.5]
    ])
    // Dummy testing data
    const x_test = tf.tensor([
        [0.9, 0.1, 0.5]
    ])
    train_data().then(function () {
        console.log('Training is Complete');
        console.log('Predictions :');
        model.predict(x_test).print();
    })
    async function train_data() {
        for (let i = 0; i < 100; i++) {
            // The batch size is a number of samples processed before the model is updated.
            // The number of epochs is the number of complete passes through the training dataset.
            // The size of a batch must be more than or equal to one and less than or equal to the number of samples in the training dataset.
            // The number of epochs can be set to an integer value between one and infinity. 
            const res = await model.fit(x_train, y_train, epoch = 1000, batch_size = 10);
            console.log(res.history.loss[0]);
        }
    }

}

getMidi()