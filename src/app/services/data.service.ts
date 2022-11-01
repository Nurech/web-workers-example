import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Fib } from '../components/calculator/calculator.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  workerAnswers$: ReplaySubject<Fib[]> = new ReplaySubject<Fib[]>();
  noWorkerAnswers$: ReplaySubject<Fib[]> = new ReplaySubject<Fib[]>();
  noWorkerAnswers: Fib[] = [];
  workerAnswers: Fib[] = [];

  constructor() {
  }

  addNoWorkerAnswer(item: Fib) {
    this.noWorkerAnswers.push(item);
    this.noWorkerAnswers$.next(this.noWorkerAnswers);
  }

  resetNoWorkerAnswers() {
    this.noWorkerAnswers = [];
    this.noWorkerAnswers$.next(this.noWorkerAnswers);
  }

  addWorkerAnswer(item: Fib) {
    this.workerAnswers.push(item);
    this.workerAnswers$.next(this.workerAnswers);
  }

  resetWorkerAnswers() {
    this.workerAnswers = [];
    this.workerAnswers$.next(this.workerAnswers);
  }

  getFibAnswer(num: number) {
    let startTime = performance.now();
    let fibItem = {} as Fib;
    fibItem.answer = fibonacci(num);
    let endTime = performance.now();
    fibItem.time = endTime - startTime;
    console.log(`Call to solve took ${endTime - startTime} milliseconds`);
    this.addNoWorkerAnswer(fibItem);
  }

  getFibWithWorker(num: number) {
    this.runWorker(num);
  }

  runWorker(num: number) {
    if (typeof Worker !== 'undefined') {
      let url = import.meta.url
      console.log(url)
      const worker = new Worker(new URL('./app.worker', url)); // Spawn a worker
      worker.postMessage({num: num}); // Send to data to worker
      worker.onmessage = ({data}) => { // On return from the worker
        this.addWorkerAnswer(data as Fib);
      };
    } else {
      // Remember to handle fallback
    }
  }

}

// The typical fibonacci implementation (warning! slow!)
export const fibonacci = (num: number): any => {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
};

