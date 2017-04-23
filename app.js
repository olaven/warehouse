
var pages = ["home", "register", "overview"];
var storageTypes = ["Stor", "Liten", "Annet"];
var customers = [];
customers.push({name:"testmann", tlf:"909090", email:"testmail@test.no",
date:"date", storageType:"small"});
customers.push({name:"olaven", tlf:"itsame999", email:"olaven@learning.com",
date:"23.12.2023", storageType:"big"});
var customer = function(name, tlf, email, accountNumber, regDate, storageType){
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
  //create html-stuff:
  makeList(storageTypes, "storageTypeInn");
  updateOverview(customers);

  //listeners
    for(i in pages){
     getId(pages[i] + "Btn").onclick = showPage;
    }
    //registerPage
    getId("registerCustomerBtn").onclick = registerCustomer;
    //overviewPage
    getId("searchBtn").onclick = searchFun;
    getId("viewAllBtn").onclick = function(){
      updateOverview(customers);
    }
}
function registerCustomer() {
  var registerInputs = getClass("registerInputs");
  var denied = false;
  for(i in registerInputs){
    if (registerInputs[i].value === "" || registerInputs.value === "dd.mm.åååå") {
      //styling red to signalize illegal input
      registerInputs[i].style.borderStyle = "solid";
      registerInputs[i].style.borderColor = "rgb(180, 40, 48)";
      registerInputs[i].style.backgroundColor = "rgb(180, 40, 48)";
      let now = registerInputs[i];
      setTimeout(function(evt){ //resetting red bgcolor after user has spotted it
        now.style.backgroundColor = "rgba(48, 109, 117, 0.72)";
      }, 1000);
      denied = true;
    }
  }
  if(denied){
    return;
  }

  var nameInn = getId("nameInn").value;
  var tlfInn = getId("tlfInn").value;
  var emailInn = getId("emailInn").value;
  var accountInn = getId("accountInn").value;
  var dateInn = getId("dateInn").value;
  var storageTypeInn = getId("storageTypeInn").value;

  //actually adding customer:
  var addedCustomer = new customer(nameInn, tlfInn, emailInn, accountInn, dateInn, storageTypeInn);
  customers.push(addedCustomer);
  updateOverview(customers);
}
function searchFun(evt) {
  var searchTerm = getId("searchInn").value;
  var hits = [];
  var anyHits = false;
  for(i in customers){
    //if searchterm matches the first letters in current customer
    if(searchTerm.toLowerCase() === customers[i].name.toLowerCase()){
      hits.push(customers[i]);
      anyHits = true;
    }
  }
  if(anyHits){
    updateOverview(hits);
  }
}
function updateOverview(arr) { //chhaning this to changable parameter. This->
  //way i can use it for seareching as well
  getId("overviewTableDiv").innerHTML = "";
  for(i in arr){//creating new <td> elements
    //need new <td>-tags for each "datapoint", ie. .name
    //adding info for one table row/customer
    var nameTd = document.createElement("td");
    var tlfTd = document.createElement("td");
    var emailTd = document.createElement("td");
    var accountNumberTd = document.createElement("td");
    var dateTd = document.createElement("td");
    var storageTypeTd = document.createElement("td");
    nameTd.innerHTML = arr[i].name;
    tlfTd.innerHTML = arr[i].tlf;
    emailTd.innerHTML = arr[i].email;
    accountNumberTd.innerHTML = arr[i].accountNumber;
    dateTd.innerHTML = arr[i].date;
    storageTypeTd.innerHTML = arr[i].storageType;
    nameTd.id = arr[i].name;
    tlfTd.id = arr[i].tlf;
    emailTd.id = arr[i].email;
    accountNumberTd.id = arr[i].accountNumber;
    dateTd.id = arr[i].date;
    storageTypeTd.id = arr[i].storageType;

    //Wrap customer up in one tr + appending of all td's
    var newTr = document.createElement("tr");
    newTr.appendChild(nameTd);
    newTr.appendChild(tlfTd);
    newTr.appendChild(emailTd);
    newTr.appendChild(accountNumberTd);
    newTr.appendChild(dateTd);
    newTr.appendChild(storageTypeTd);

    //table to add everything into + appending
    var newTable = document.createElement("table");
    newTable.appendChild(newTr);

    //appending to div in document (finally!)
    getId("overviewTableDiv").appendChild(newTable);

  }
}
function showPage(evt) {
  hidePages();
  var k = evt.target.id.slice(0,evt.target.id.length - 3);
  k += "Page";
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
