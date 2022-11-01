import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatRadioChange } from '@angular/material/radio';
import { tap } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {

  noWorkerSolutions = 3;
  workerSolutions = 3;
  noWorkerTotalTime = 0;
  workerTotalTime = 0;

  noWorkerAnswers$ = this.dataService.noWorkerAnswers$.pipe(tap((data) => {
    this.noWorkerTotalTime = data.reduce((accumulator, object) => {return accumulator + object.time;}, 0);
  }));

  workerAnswers$ = this.dataService.workerAnswers$.pipe(tap(data => {
    if (data.length === this.workerSolutions) {
      this.stopTimer();
    }
  }));

  startTime: number = 0;
  endTime: number = 0;

  constructor(public dataService: DataService) { }

  startTimer() {
    this.startTime = new Date().getTime();
  }

  stopTimer() {
    this.endTime = new Date().getTime();
    this.workerTotalTime = this.endTime - this.startTime;
    console.warn(this.workerTotalTime, this.endTime, this.startTime);
  }

  onRadioChangeNoWorkers(event: MatRadioChange) {
    this.noWorkerSolutions = event?.value;
    this.dataService.resetNoWorkerAnswers();
  }

  onRadioChangeWorkers(event: MatRadioChange) {
    this.workerSolutions = event?.value;
    this.dataService.resetWorkerAnswers();
  }

  startSolvingNoWorkers() {
    this.dataService.resetNoWorkerAnswers();
    for (let i = 0; i < this.noWorkerSolutions; i++) {
      this.dataService.getFibAnswer(42);
    }
  }

  startSolvingWorkers() {
    this.dataService.resetWorkerAnswers();
    this.startTimer();
    for (let i = 0; i < this.workerSolutions; i++) {
      this.dataService.getFibWithWorker(42);
    }
  }

}


export interface Fib {
  id: number,
  answer: number,
  time: number
}
