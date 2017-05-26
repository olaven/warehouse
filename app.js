
var pages = ["home", "register", "overview", "settings",
 "deleteCustomer", "colorSettings"];
var storageTypes = ["Stor", "Liten", "Annet"];

var customers;
//Constructor used to create a new entry in custoenrs
var customer = function(name, tlf, email, accountNumber, regDate, storageType){
  this.name = name;
  this.tlf = tlf;
  this.email = email;
  this.accountNumber = accountNumber;
  this.regDate = regDate;
  this.storageType = storageType;
  this.payed = false;
}

window.onload = pageLoaded;
function pageLoaded() {
  //is customerStore registred in localStorage?
  if(localStorage.getItem("customerStore") === null || localStorage.getItem("customerStore") === undefined){
    populateStorage();
  }
  //customers JSON-object as string. Converted to object below
  var str = localStorage.getItem("customerStore");
  customers = JSON.parse(str);
  //show homepage
  getId("homePage").style.visibility = "visible";
  //create html-stuff:
  makeList(storageTypes, "storageTypeInn");
  updateOverview(customers, "overviewTableDiv"); ;

  //listeners
    for(i in pages){
     getId(pages[i] + "Btn").onclick = showPage;
    }
    //registerPage
    getId("registerCustomerBtn").onclick = registerCustomer;
    //overviewPage
    getId("searchBtn").onclick = function(){
      searchFun("searchInn", "overviewTableDiv");
    }
    getId("viewAllBtn").onclick = function(){
      updateOverview(customers, "overviewTableDiv");
    }
    //deleteCustomerPage
    getId("searchDeleteCustomerBtn").onclick = function(){
      searchFun("searchInnDeleteCustomer", "deleteCustomerTableDiv");
      //adding listener for deletion-click
      getId("deleteCustomerTableDiv").childNodes[0].onclick = deleteCustomerFun;
    }
}
function deleteCustomerFun(evt) {
  var deleteTr = evt.target.parentNode; //getting the <tr> tag. Can extract
  //information from that later on width .childNodes[0] etc.

    /*I have chosen to only check specific parts of the customer information.
    1: Converting datatypes can and will be messy
    2: Updating this method will be difficult if/when more properties are addedCustomer
    3: My opinion on this would not be the same if this software was going to be used
    by a big audience
    4: If I have any reason to do so, I will do my best to go with a better approach here
    at another date*/

  for(i in customers){
    if(customers[i].name === deleteTr.childNodes[0].innerHTML){
      if(customers[i].tlf === deleteTr.childNodes[1].innerHTML){
        if(customers[i].email === deleteTr.childNodes[2].innerHTML){
          if(customers[i].accountNumber === deleteTr.childNodes[3].innerHTML){
            if(customers[i].regDate === deleteTr.childNodes[4].innerHTML){
              if (customers[i].storageType === deleteTr.childNodes[5].innerHTML) {
                customers.splice(i, 1) //removes customer from customers
                localStorage.setItem("customerStore", JSON.stringify(customers));
                updateOverview(customers, "overviewTableDiv");
              }
            }
          }
        }
      }
    }
  }
}
function populateStorage() {//when no costumers are saved
  localStorage.setItem("customerStore", "[]"); //assigned as no customers
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
        //now.style.borderStyle = "none";
      }, 1000);
      denied = true;
    }
  }
  if(denied){
    return;
  }

  //converting datestring from html calendar to a js date object
  var d = getId("dateInn").value;
  var dateObj = new Date(d[0]+d[1]+d[2]+d[3], d[5]+d[6], d[7]+d[8]);
  //--------------------------------------------

  var nameInn = getId("nameInn").value;
  var tlfInn = getId("tlfInn").value;
  var emailInn = getId("emailInn").value;
  var accountInn = getId("accountInn").value;
  var dateInn = dateObj;
  var storageTypeInn = getId("storageTypeInn").value;

  //actually adding customer:
  var addedCustomer = new customer(nameInn, tlfInn, emailInn, accountInn, dateInn, storageTypeInn);
  customers.push(addedCustomer);
  //communicate to user that comstumer was registred
  for(i in registerInputs){//clearing field
    if(registerInputs[i].tagName !== "SELECT"){
      registerInputs[i].innerHTML = "";
      registerInputs[i].value = "";
    }
  }
  //making registerCustomerBtn green to indicate success
  getId("registerCustomerBtn").style.backgroundColor = "rgb(51, 242, 104)";
  getId("registerCustomerBtn").innerHTML = "Success";
  setTimeout(function(){
    getId("registerCustomerBtn").style.backgroundColor = "rgb(201, 219, 49)";
    getId("registerCustomerBtn").innerHTML = "Registrer kunde";
  }, 1000)
  //update localStorage/JSON and overviewPage
  updateOverview(customers, "overviewTableDiv");
  updateLocalStorage("customerStore", customers)
}
function updateLocalStorage(key, object) {
  var objectString = JSON.stringify(object)
  localStorage.setItem(key, objectString);
}
function searchFun(termKilde, tabellId, evt) {
  var searchTerm = getId(termKilde).value;
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
    updateOverview(hits, tabellId);
  }
}
function updateOverview(arr, fieldId) {
  //expects an array where all indexes
  //contains structural identical objects
  //arr[i] = {node1 = "node1", node2 = "node2"} and similars.
  //fieldId is a html-element (not table) where table should be
  //created
  document.getElementById(fieldId).innerHTML = "";//clearing area
  var newTable = document.createElement("table");
  newTable.className = "fullWidth";
  for(i in arr){
    var newTr = document.createElement("tr");
    for(x in arr[i]){
      var newTd = document.createElement("td");
      newTd.innerHTML = arr[i][x];
      newTr.appendChild(newTd);
    }
    newTable.appendChild(newTr);
  }
  document.getElementById(fieldId).appendChild(newTable);
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
