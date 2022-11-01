/// <reference lib="webworker" />


addEventListener('message', ({data}) => {

  // The typical fibonacci implementation (warning! slow!)
  const fibonacci = (num: number): any => {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  };

  if (data?.num) {
    let startTime = performance.now();
    let fibItem = {answer: 0, time: 0};
    fibItem.answer = fibonacci(data.num);
    let endTime = performance.now();
    fibItem.time = endTime - startTime;
    console.log(`Call to solve took ${endTime - startTime} milliseconds`);
    postMessage(fibItem);
  }
});
