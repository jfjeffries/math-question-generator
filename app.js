const gradeLevel = document.getElementById('grade-level');
const typeElement = document.getElementById('type');
const questionsElement = document.getElementById('questions');
const quantity = document.getElementById('quantity');
gradeLevel.addEventListener('input', (event) => newGame(event))
type.addEventListener('input', (event) => newGame(event))
quantity.addEventListener('input', (event) => newGame(event))

class Questions {
  constructor(){
    this.questions = {};
  }
}

class Question {
  constructor(type, level){
    this.numbers = []
    this.numbers.push(Math.floor(getRandomNumber(parseInt(level), 10**level)));
    this.numbers.push(Math.floor(getRandomNumber(parseInt(level), 10**level)));
    this.numbers = this.numbers.sort((a,b) => a - b);
    this.sign = type;
    this.questionWrapper = element('div', ['question-wrapper', `${typeElement.options[typeElement.selectedIndex].innerHTML.toLowerCase()}`]);
    this.questionElement = type == "/" ? element('div', ['question', 'division']) : element('div', ['question']);
    this.input = element('input', ['answer-input']);
    this.form = element('form', ['answer-form']);
    this.id = Math.floor(this.getAnswer() * getRandomNumber(20, 100));
  }

  getAnswer () {
    switch (this.sign){
      case "+": return this.numbers[0] + this.numbers[1]
      case "-": return this.numbers[1] - this.numbers[0]
      case "x": return this.numbers[0] * this.numbers[1]
      case "/": return getDivisionAnswer(this.numbers[1], this.numbers[0])
    }
  }

  buildQuestion () {
    if ( this.sign == '/') {
      this.input.setAttribute('id', this.id);
      this.form.appendChild(this.input);
      let formDiv = element('div', ['division-form-div']);
      formDiv.appendChild(this.form);
      this.questionWrapper.appendChild(formDiv);
      this.questionElement.appendChild(element('span', ['top'], this.numbers[0]))
      this.questionElement.appendChild(element('span', ['bottom'], this.numbers[1]))
    } else {
      this.questionElement.appendChild(element('span', ['top'], this.numbers[1]))
      let bottomElement = element('div', ['bottom-element'])
      bottomElement.appendChild(element('span', ['bottom-sign'], this.sign))
      bottomElement.appendChild(element('span', ['bottom-number'], this.numbers[0]))
      this.questionElement.appendChild(bottomElement)
      let answerDiv = element('div', ['answer-div']);
      this.input.setAttribute('id', this.id);
      this.form.appendChild(this.input);
      this.form.setAttribute('data-remote', true);
      answerDiv.style.width = this.form.style.width;
      answerDiv.appendChild(this.form);
      this.questionElement.appendChild(answerDiv)
    }
    this.form.addEventListener('submit', (event) => this.checkAnswer(event, this));
    this.questionWrapper.appendChild(this.questionElement);
  }
  checkAnswer (event, q) {
    event.preventDefault();
    let correctAnswer = q.getAnswer();
    let answer = q.input.value;
    if (game.type == '/') {
      console.log(answer, correctAnswer)
      answer = answer.replace(' ', '');
      if (answer == correctAnswer){
        rightAnswer(event.target, answer);
      } else {
        wrongAnswer(event.target, answer);
      }
    } else {
      if (answer == correctAnswer){
        rightAnswer(event.target, answer);
      } else {
        wrongAnswer(event.target, answer);
      }
    }
  }
}

const element = (type, classes, val) => {
  let el = document.createElement(type);
  classes.forEach(c => el.classList.add(c));
  if (val){
    el.innerText = val;
  }
  
  return el;
}

const getRandomNumber = (max, min) => { return Math.random() * (max - min) + min }

const newGame = (e) => {
  if (e) {
    e.preventDefault();
    val = e.target.value;
    switch (e.target.name){
      case "type": game.setType(val); break;
      case "level": game.setDifficulty(val); break;
      default: game.setQuantity(val); break;
    }
  }
  game.newGame();
}

const rightAnswer = (form, answer) => {
  let span = element('span', ['replacement', 'correct']);
  span.innerText = answer;
  parent = form.parentElement;
  parent.removeChild(form);
  parent.appendChild(span);
  forms = document.getElementsByTagName('form');
  if (forms.length > 0){
    forms[0].firstChild.focus();
  } else {
    newGame();
  }

}
const wrongAnswer = (form, answer) => {
  form.firstChild.classList.add('replacement',  'incorrect');
  let t = setTimeout(() => {form.firstChild.value = ""}, 1000);
}

class Game {
  constructor(difficulty, type, quantity){
    this.questions = new Questions();
    this.difficulty = difficulty;
    this.type = type;
    this.quantity = parseInt(quantity);
  }
  setType(t){
    this.type = t;
  }
  setDifficulty(d){
    this.difficulty = d;
  }
  setQuantity(q){
    this.quantity = q;
  }
  emptyQuestions(){
    while (questionsElement.firstChild){
      questionsElement.removeChild(questionsElement.firstChild);
    }
    
    this.questions = new Questions();
  }
  fillQuestions(n){
    if(!n) n = 1;
    for(let i = 0; i < n; i++){
      let q = new Question(this.type, this.difficulty);
      this.questions.questions[q.id] = q;
      q.buildQuestion();
      questionsElement.appendChild(q.questionWrapper);
    }
  }
  newGame(){
    
    this.emptyQuestions();
    this.fillQuestions(this.quantity);
  }
}

const getDivisionAnswer = (n1, n2) => {
  console.log(n1, n2)
  let i = Math.floor(n1 / n2);
  if (n2 == 0) return 0;
  if (i == n1 / n2) return i;
  return `${i}r${n1 - n2 * i}`;
}
const game = new Game(gradeLevel.value, typeElement.value, quantity.value);
game.newGame();
