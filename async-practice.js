
// TRYING WITH ASYNC/AWAIT

// async function getMidiData(url) {
//     const response = await Midi.fromUrl(url)
//     console.log('r1', response)
//     return response
// }

// const midi = getMidiData("./data/musicnet_midis/Bach/2186_vs6_1.mid")

// setTimeout(() => {
//   console.log('r2', midi)
// }, 3000)

// console.log('when will this log?', midi)


// TRYING WITH PROMISES

const callback = (sillyResolve, sillyReject) => {
  // do thing, then…
  const n = Math.random()
  if (n > 0.01) {
    sillyResolve(n);
  }
  else {
    sillyReject(Error("It broke"));
  }
}

const successCallback = res => {
    console.log(res);
    console.log("See, it worked! 🎉 ");
}

const promise = new Promise(callback);

// 2021-05-18: 
// we seem to understand promises a bit better?
// but what is the deal with Promise.resolve and Promise.reject ? 

// const promise2 = new Promise()

// this doesn't work: 
promise.resolve('some').then(res => successCallback(res))
promise.reject('bad stuff').then(res => console.error(res))
