var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;

function preload() {
  sadDog = loadImage("Images/Dog.png");
  happyDog = loadImage("Images/happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1100, 500);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(1000, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.30;

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(600, 95);
  addFood.mousePressed(addFoods);

  var input = createInput("Name");
  var button = createButton("play");
  input.position(800, 430);
  button.position(800, 470);

 
}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })
  fill("white");
  strokeWeight(3);
  stroke("black");
  textSize(30);
  if (lastFed >= 12) {
    text("Last Feed : " + lastFed % 12 + " PM", 50, 70);
  } else if (lastFed == 0) {
    text("Last Feed : 12 AM", 110, 70);
  } else {
    text("Last Feed : " + lastFed + " AM", 110, 70);
  }




  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })


}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

