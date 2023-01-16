const cards = document.querySelectorAll('.memory-card');
var score = 0;
var topscore = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
var timerstart = null;
var timerstop = null;
var loked = false;
currentDataOBJ = {};
saveDataAsArray = [];
var docName = "";
var audio1 = new Audio('mixkit-achievement-bell-600.wav');
var audio2 = new Audio('Negative-sound.mp3');

var start,
  diff,
  minutes,
  seconds;

function startTimer(duration, display) {

  function timer() {
    // get the number of seconds that have elapsed since 
    // startTimer() was called
    diff = duration - (((Date.now() - start) / 1000) | 0);

    // does the same job as parseInt truncates the float
    minutes = (diff / 60) | 0;
    seconds = (diff % 60) | 0;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (diff <= 0) {
      // add one second so that the count down starts at the full duration
      // example 05: 00 not 04: 59
      start = Date.now() + 1000;
      clearInterval(timerstart)
      // window.location.href = 'gameOver.html'
      if (JSON.parse(localStorage.getItem("ListOfUsers")))
        saveDataAsArray = JSON.parse(localStorage.getItem("ListOfUsers"));

      let getName = "";
      if (localStorage.getItem("name")) getName = localStorage.getItem("name");
      else getName = "doctor";

      currentDataOBJ["name"] = getName;
      currentDataOBJ["correct"] = score;
      currentDataOBJ["scoretime"] = 90;
      let TopScore = []
      saveDataAsArray.forEach(item => {
        if (item.correct === 9) {
          TopScore.push(item)
        }
      })
      saveDataAsArray.push(currentDataOBJ);
      localStorage.setItem("ListOfUsers", JSON.stringify(saveDataAsArray));
      cards.forEach(card => card.removeEventListener('click', flipCard));
      document.getElementById("welcomeName").innerHTML = getName;
      document.getElementById("docScore").innerHTML = score;
      document.getElementById("finaltimetop").innerHTML = 90 + ":" + 90;

      for (var i = 0; i < TopScore.length; i++) {
        var item = TopScore[i];
        // Create a new table row
        var row = document.createElement("tr");
        // Add the data to the row
        row.innerHTML = "<td>" + item.name + "</td><td>" + item.correct + "/9" + "</td><td>" + item.scoretime + ":90" + "</td>";
        // Append the row to the table
        document.getElementById("table").appendChild(row);
      }



      $('#final').modal('show')

    }
  };
  // we don't want to wait a full second before the timer starts
  timer();
  timerstart = setInterval(timer, 1000, true);


}


function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.img === secondCard.dataset.img;
  if (isMatch === true) {


    audio1.play();
    document.getElementById("score").innerHTML = ++score;
    disableCards()
  } else {
    unflipCards();
    audio2.play();
  }
  if (score === 9) {
    clearInterval(timerstart)
    if (JSON.parse(localStorage.getItem("ListOfUsers")))
      saveDataAsArray = JSON.parse(localStorage.getItem("ListOfUsers"));

    let getName = "";
    if (localStorage.getItem("name")) getName = localStorage.getItem("name");
    else getName = "doctor";

    currentDataOBJ["name"] = getName;
    currentDataOBJ["correct"] = score;
    currentDataOBJ["scoretime"] = 90 - seconds;
    let TopScore = []
    saveDataAsArray.forEach(item => {
      if (item.correct === 9) {
        TopScore.push(item)
      }
    })
    saveDataAsArray.push(currentDataOBJ);
    localStorage.setItem("ListOfUsers", JSON.stringify(saveDataAsArray));
    cards.forEach(card => card.removeEventListener('click', flipCard));
    document.getElementById("welcomeName").innerHTML = getName;
    document.getElementById("docScore").innerHTML = score;
    document.getElementById("finaltimetop").innerHTML = 90 - seconds + ":90";
    for (var i = 0; i < TopScore.length; i++) {
      var item = TopScore[i];
      // Create a new table row
      var row = document.createElement("tr");
      // Add the data to the row
      row.innerHTML = "<td>" + item.name + "</td><td>" + item.correct + "/9" + "</td><td>" + item.scoretime + ":90" + "</td>";
      // Append the row to the table
      document.getElementById("table").appendChild(row);
    }

    // window.location.href = 'topscore.html'
    $('#final').modal('show')


  }

}


function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}
function unflip() {
  firstCard.classList.remove('flip');
  secondCard.classList.remove('flip');

  resetBoard();
}
function unflipCards() {
  lockBoard = true;

  setTimeout(unflip, 1500, true);

}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
var imagesArray = ["images/game01.jpg", "images/game02.jpg", "images/game03.jpg", "images/games-09.jpg", "images/games-11.jpg", "images/games-05.jpg", "images/games-17.jpg", "images/games-16.jpg", "images/games-19.jpg"];

(function shuffle() {
  cards.forEach(_card => {
    let randomPos = Math.floor(Math.random() * 18);
    document.getElementsByClassName(randomPos).src = imagesArray[1];
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));
$("#saveDoctor").on("click", function () {
  docName = $("#textDrName").val();

  let getName = "";
  if (localStorage.getItem("name")) getName = localStorage.getItem("name");
  else getName = "doctor";

  document.getElementById("docName").innerHTML = getName;

  localStorage.setItem("name", docName);
  $(".conOfdocName").hide();
  $(".gameBoard").show();
  start = Date.now();
  var fiveMinutes = 90,
    display = document.querySelector('#time');

  var count = 0;
  var randomArray = null;
  const nums = new Set();
  while (nums.size !== 18) {
    nums.add(Math.floor(Math.random() * 18) + 1);
  }

  randomArray = [...nums]
  cards.forEach(card => {

    card.style.order = randomArray[count];
    count++
    card.querySelector(".back-face").src = 'images/back.jpg'
  });
  startTimer(fiveMinutes, display)

})
$(document).ready(function () {


  $("#exportData").on("click", function () {
    let myDataArray = [];
    let exportData = JSON.parse(localStorage.getItem("ListOfUsers"));
    let tableHeader = Object.keys(exportData[0])
    exportData.forEach((el) => {
      myDataArray.push([
        el["name"],

        `${el["correct"]} of 9`
      ])
    });

    const doc = new jsPDF()
    doc.autoTable({
      head: [
        ['Dr.Name', 'Score'
        ]
      ],
      body: myDataArray,
    })
    doc.save('table.pdf')
  });
});
// =========================
// $(document).ready(function () {


//   $("#final").on("click", function () {
//     let myDataArray = [];
//     let exportData = JSON.parse(localStorage.getItem("ListOfUsers"));
//     let tableHeader = Object.keys(exportData[0])

//     exportData.forEach((el) => {

//       myDataArray.push([

//         el["name"],
//         `${el["correct"]} of 9`,
//         `${el["scoretime"]}` == 'undefined' ? '00:60 of 00:60 ' : `00:${el["scoretime"]} of 00:60`,


//       ])

//       // console.log(typeof `${el["scoretime"]}`)
//       // console.log("scoretime", `${el["scoretime"]}` == 'undefined' ? '00:00' : `${el[`"00":"scoretime"`]}`)
//     });
//     const doc = new jsPDF()
//     doc.autoTable({
//       head: [
//         ['Dr.Name', 'Score', 'Time'
//         ]
//       ],

//       body: myDataArray,

//     })
//     window.open(doc.output('bloburl'), '_blank');
//   });
// });
// =========================

// ===============




