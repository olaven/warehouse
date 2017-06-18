
var pages = ['home', 'register', 'overview', 'settings',
 'deleteCustomer', 'colorSettings', 'payment'];
var storageTypes = ['Stor', 'Liten', 'Annet'];

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
  //if 'customerStore' is not registered in localStorage
  if(localStorage.getItem('customerStore') === null || localStorage.getItem('customerStore') === undefined){
    populateStorage();
  }
  //customers JSON-object as string. Converted to object below
  var str = localStorage.getItem('customerStore');
  customers = JSON.parse(str);
  //show homepage
  getId('homePage').style.visibility = 'visible';
  //create html-stuff:
  makeList(storageTypes, 'storageTypeInn');
  updateOverview(customers, 'overviewTableDiv'); ;

  //listeners
    for(i in pages){
     getId(pages[i] + 'Btn').onclick = showPage;
    }
    //registerPage
    getId('registerCustomerBtn').onclick = registerCustomer;
    //overviewPage
    getId('searchBtn').onclick = function(){
      searchFun('searchInn', 'overviewTableDiv');
    }
    getId('viewAllBtn').onclick = function(){
      updateOverview(customers, 'overviewTableDiv');
    }
    //deleteCustomerPage
    getId('searchDeleteCustomerBtn').onclick = function(){
      searchFun('searchInnDeleteCustomer', 'deleteCustomerTableDiv');
      //adding listener for deletion-click
      getId('deleteCustomerTableDiv').childNodes[0].onclick = deleteCustomerFun;
    }
    getId('paymentSearchBtn').onclick = function(){
      searchFun("payMentSearchInn", 'paymentTable')
      getId('paymentTable').childNodes[0].onclick = paymentFun;
    }
}
function paymentFun(evt){
  var eventPar = evt;
  if (findCustomer(eventPar)) {
    console.log("BETALT");
  }
  else {
    alert("Denne kunden finnes ikke. Dette var rart");
  }

  /*
  //testing with dateobject from localStorage
  var dateObj = new Date(JSON.parse(localStorage.getItem('customerStore'))[0].regDate);
  console.log(dateObj.getWeek());
  console.log(dateObj);
  */
}
function deleteCustomerFun(evt) {
  var eventPar = evt;
  if (findCustomer(eventPar)) {
    customers.splice(i, 1) //removes customer from customers
    localStorage.setItem('customerStore', JSON.stringify(customers));

    evt.target.parentNode.style.backgroundColor = 'rgb(108, 17, 39)';
    updateOverview(customers, 'overviewTableDiv');
  }
}

function findCustomer(eventPar){//requires an evt-event that is defined above its scope
  var deleteTr = eventPar.target.parentNode; //getting the <tr> tag. Can extract
  //information from that later on width .childNodes[0] etc.

  /*Finding a customer by checking data in a HTML-table and running
  through the object stored in localStorage, 'customerStore'.
  I am fully aware that this is not the best way to do it, and I
  will come back to this later if this software turns out to become important
  to someone other than myself.
  @olaven*/
for(i in customers){
    if(customers[i].name === deleteTr.childNodes[0].innerHTML){
      if(customers[i].tlf === deleteTr.childNodes[1].innerHTML){
        if(customers[i].email === deleteTr.childNodes[2].innerHTML){
          if(customers[i].accountNumber === deleteTr.childNodes[3].innerHTML){
            if(customers[i].regDate === deleteTr.childNodes[4].innerHTML){
              if (customers[i].storageType === deleteTr.childNodes[5].innerHTML) {
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
}
function populateStorage() {//when no costumers are saved
  localStorage.setItem('customerStore', '[]'); //assigned as no customers
}
function registerCustomer() {
  var registerInputs = getClass('registerInputs');
  var denied = false;
  for(i in registerInputs){
    if (registerInputs[i].value === '' || registerInputs.value === 'dd.mm.åååå') {
      //styling red to signalize illegal input
      registerInputs[i].style.borderStyle = 'solid';
      registerInputs[i].style.borderColor = 'rgb(180, 40, 48)';
      registerInputs[i].style.backgroundColor = 'rgb(180, 40, 48)';
      let now = registerInputs[i];
      setTimeout(function(evt){ //resetting red bgcolor after user has spotted it
        now.style.backgroundColor = 'rgba(48, 109, 117, 0.72)';
        //now.style.borderStyle = 'none';
      }, 1000);
      denied = true;
    }
  }
  if(denied){
    return;
  }

  //converting datestring from html calendar to a js date object
  var d = getId('dateInn').value;
  var dateObj = new Date(d[0]+d[1]+d[2]+d[3], d[5]+d[6], d[7]+d[8]);
  //--------------------------------------------

  var nameInn = getId('nameInn').value;
  var tlfInn = getId('tlfInn').value;
  var emailInn = getId('emailInn').value;
  var accountInn = getId('accountInn').value;
  var dateInn = dateObj;
  var storageTypeInn = getId('storageTypeInn').value;

  //actually adding customer:
  var addedCustomer = new customer(nameInn, tlfInn, emailInn, accountInn, dateInn, storageTypeInn);
  customers.push(addedCustomer);
  //communicate to user that comstumer was registred
  for(i in registerInputs){//clearing field
    if(registerInputs[i].tagName !== 'SELECT'){
      registerInputs[i].innerHTML = '';
      registerInputs[i].value = '';
    }
  }
  //making registerCustomerBtn green to indicate success
  getId('registerCustomerBtn').style.backgroundColor = 'rgb(51, 242, 104)';
  getId('registerCustomerBtn').innerHTML = 'Success';
  setTimeout(function(){
    getId('registerCustomerBtn').style.backgroundColor = 'rgb(201, 219, 49)';
    getId('registerCustomerBtn').innerHTML = 'Registrer kunde';
  }, 1000)
  //update localStorage/JSON and overviewPage
  updateOverview(customers, 'overviewTableDiv');
  updateLocalStorage('customerStore', customers)
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
  //arr[i] = {node1 = 'node1', node2 = 'node2'} and similars.
  //fieldId is a html-element (not table) where table should be
  //created
  document.getElementById(fieldId).innerHTML = '';//clearing area
  var newTable = document.createElement('table');
  newTable.className = 'fullWidth';
  for(i in arr){
    var newTr = document.createElement('tr');
    for(x in arr[i]){
      var newTd = document.createElement('td');
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
  k += 'Page';
  getId(k).style.visibility = 'visible';
}
function hidePages(){
  var elements = getClass('pages')
  for(i in elements){
    if(typeof elements[i] === 'object'){//separate html elements form other data
      elements[i].style.visibility = 'hidden';
    }
  }
}

//div praktiske greier, ikke programspesifikt
function makeList(arr, selectId) {
  for(i in arr){
    var nyOp = document.createElement('option');
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

Date.prototype.getWeek = function() {//FROM https://weeknumber.net/how-to/javascript
  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}
