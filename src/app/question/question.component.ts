import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  name: any;
  public questionList: any;
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer:number=0;
  incorrectAnswer:number=0;
  interval$:any;
  progres: string='0';


  constructor(private questionService: QuestionService) {

  }

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.getAllQuestions();
  }

  getAllQuestions() {
    this.questionService.getQuestionJson()
      .subscribe(res => {
        this.questionList = res.questions;
      })
  }


  nextQuestion()
  {
      this.currentQuestion++;
  }

  previousQuestion()
  {
     this.currentQuestion--;
  }

  answer(currentQN:number,option:any)
  {
     if(option.correct)
     {
      this.points+=10;
      this.correctAnswer++;
      this.currentQuestion++;
      this.resetCounter();
      this.getProgress();

     }
     else
     {
      this.currentQuestion++;
      this.incorrectAnswer++;
      this.resetQuiz();
      this.getProgress();
      this.points-=10;

     }
  }

  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter === 0) {
          this.currentQuestion++;
          this.counter = 60;
          this.points -= 10;
        }


      });
    setTimeout(() => {
      this.interval$.unsubscribe()
    }, 6000000)
  }

  stopCounter()
  {
    this.interval$.unsubscribe();
    this.counter=0;
  }

  resetCounter()
  {
     this.counter=60;
     this.startCounter();
  }

  resetQuiz()
  {
     this.resetCounter();
     this.getAllQuestions();
     this.points=0;
     this.counter=60;
     this.currentQuestion=0;
     this.progres='0';
  }

  getProgress()
  {
    this.progres=((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progres;
  }

}
