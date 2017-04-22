
var pages = ["home", "register", "oversikt"];
var storageTypes = ["Stor", "Liten", "Annet"];
var costumer = function(name, tlf, email, accountNumber, regDate, storageType){
  this.name = name;
  this.tlf = tlf;
  this.email = email;
  this.accountNumber = accountNumber;
  this.regDate = regDate;
  this.storageType = storageType;
}//TO BE USED LATER, NEED TO FIGURE OUT HOW TO STORE DATA

window.onload = pageLoaded;
function pageLoaded() {
  //show homepage
  getId("homePage").style.visibility = "visible";
  //create lists:
  makeList(storageTypes, "storageTypeInn");

  //listeners
    for(i in pages){
     getId(pages[i] + "Btn").onclick = showPage;
    }
}
function registerCustomer() {

}
function showPage(evt) {
  hidePages();
  var k = evt.target.id.slice(0,evt.target.id.length - 3);
  k += "Page";
  console.log(k);
  getId(k).style.visibility = "visible";
}
function hidePages(){
  var elements = getClass("pages")
  for(i in elements){
    if(typeof elements[i] === "object"){//separate html elements form other data
      elements[i].style.visibility = "hidden";
    }
  }
}
//div praktiske greier, ikke programspesifikt
function makeList(arr, selectId) {
  for(i in arr){
    var nyOp = document.createElement("option");
    nyOp.value = arr[i];
    nyOp.innerHTML = arr[i];
    document.getElementById(selectId).appendChild(nyOp);
  }
}
var getId = function(x){
  return document.getElementById(x);
}
var getClass = function(x){
  return document.getElementsByClassName(x);
}
var getTag = function(x){
  return document.getElementsByTagName(x);
}
