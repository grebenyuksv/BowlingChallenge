var score = Bowling.Score.create();
score.getRoll().knockDown(2).getRoll().knockDown(3);
console.log("no crashes");