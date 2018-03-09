/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = true

const url = "ws://127.0.0.1:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  // console.info(msg)
}

function connectCallback() {
  document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
  var subscription = client.subscribe("/fx/prices", callback);
}
client.connect({}, connectCallback)

var priceArray = [];
var midPrices = [];


/**
 * Function to find index where new object can be placed in ascending order of lastChangedBid
 * @param {Array} array - Array in which new data has to be pushed
 * @param {Object} objToInsert - new object to be inserted
 * @param {String} key - key on basis of which array is to remain sorted
 */
var findIndexOfNewElement = function(array, objToInsert, key = 'lastChangeBid') {
  let value = objToInsert[key];
    let newIndex = 0;

    // Step 1. Sort the incoming array
    array.sort((a, b) => a.lastChangeBid - b.lastChangeBid);
    
    // Step 2. Loop over array to find the index where new object can be placed on basis of 'key'  
    array.forEach((x,i) => {
      // If value is less than 'lastchangebid' of item of array then increment the newIndex
      if(x.lastChangeBid < value) {
        newIndex++;
      }
    });
	return newIndex;
}

/**
 * Function to push new HTML in specfic Node
 * @param {String} parentId - id of parent in DOM
 * @param {String} elementTag - tag of elemnt to be created
 * @param {String} html - new html to be inserted inside tag
 * @param {Number} index - index of child node at which html has to be inserted
 */
function addDOMElement(html, index, parentId = 'prices', elementTag = 'tr') {
  const p = document.getElementById(parentId);
  const newElement = document.createElement(elementTag);
  newElement.innerHTML = html;

  const newIndex = index +1;

  // If no element in DOM then directly append element
  if(newIndex > 0) {
    p.insertBefore(newElement, p.childNodes[newIndex]);
  } else {
    p.appendChild(newElement);
  }
}

// Function to create graph
function createSparkline(prices) {

// Create new array of deposited prices
  let midPrices = prices.map((x) => (x.bestBid + x.bestAsk)/2);

  // Create sparkline
  const sparkElement = document.getElementById('example-sparkline');
  Sparkline.draw(sparkElement, midPrices)

}

// Create new HTML string for row in table for given data
function getHTML(data) {
  return '<td>'+ data.name + '</td>'+
          '<td>'+ data.bestBid +'</td>'+
          '<td>'+ data.bestAsk +'</td>'+
          '<td>'+ data.lastChangeBid +'</td>'+
          '<td>'+ data.lastChangeAsk +'</td>';
}

var callback = function(message) {
  
  // called when the client receives a STOMP message from the server
  let indexOfNewValue =0;

  if (message.body) {
      let msg = JSON.parse(message.body);

      // Get HTML to be appended in table
      let newHTML = getHTML(msg);

      if(priceArray.length > 0) {
        // find index where new item is to be inserted in DOM in ascending order according to lastChangedBid
        indexOfNewValue = findIndexOfNewElement(priceArray, msg);
        
        // Push new item from server in prices array
        priceArray.push(msg);

        // Add new Element in DOM
        addDOMElement(newHTML, indexOfNewValue);
        
        // Create sparkline with price array
        createSparkline(priceArray);
      } else{

        // If no elemnt is present in 
        priceArray.push(msg);

        // Add new Element in DOM
        addDOMElement(newHTML, -1);
      }
  } else {
    console.log("got empty message");
  }
};
