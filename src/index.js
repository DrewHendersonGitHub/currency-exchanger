import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Currency from './currency.js';

function getElements(response, amount) {
  if (response.result === "error") {
    if (response["error-type"] === "unsupported-code") {
      $('#result').html(`<h3>Error: Invalid currency code entered, <a href="https://www.exchangerate-api.com/docs/supported-currencies">Click here</a> for a list of supported codes.</h3>`);
    }
    else if (response["error-type"] === "malformed-request") {
      $('#result').html(`<h3>Error: Bad request.</h3>`);
    }
    else if (response["error-type"] === "invalid-key") {
      $('#result').html(`<h3>Error: API key is invalid.</h3>`);
    }
    else if (response["error-type"] === "inactive-account") {
      $('#result').html(`<h3>Error: Inactive account, confirm your email address.</h3>`);
    }
    else if (response["error-type"] === "quota-reached") {
      $('#result').html(`<h3>Error: Exceeded maximum requests allowed.</h3>`);
    }
    else {
      $('#result').html(`<h3>Error: Unspecified error.</h3>`);
    }
    $('#result').addClass("red");
  }
  
  else if (typeof response === "string") {
    $('#result').html(`<h3>Error: ${response}.</h3>`);
    $('#result').addClass("red");
  }
  else if (response.result === "success" && amount === 0) {
    $('#result').html(`<h2>${amount} ${response.base_code} is equal to 0 ${response.target_code}.</h2>`);
  }
  else if (response.result === "success") {
    $('#result').html(`<h2>${amount} ${response.base_code} is equal to ${response.conversion_result} ${response.target_code}.</h2>`);
  }
}

async function makeApiCall(from, to, amount) {
  let response = await Currency.convert(from, to, amount);
  getElements(response, amount);
}

$(document).ready(function() {
  $('#currency-form').submit(function() {
    event.preventDefault();
    let from = $('#from').val().toUpperCase();
    let to = $('#to').val().toUpperCase();
    let amount = 1;
    if (parseFloat($('#amount').val()) >= 0) {
      amount = parseFloat($('#amount').val());
    }

    if (parseFloat($('#amount').val()) < 0) {
      $('#result').html("<h3>Error: Enter a positive amount.</h3>");
      $('#result').addClass("red");
    }
    else if (/[^a-zA-Z]/.test(from) || /[^a-zA-Z]/.test(to)) {
      $('#result').html("<h3>Error: Enter a code with only letters.</h3>");
      $('#result').addClass("red");
    }
    else if (from.length != 3 || to.length != 3) {
      $('#result').html("<h3>Error: Enter a 3 digit code.</h3>");
      $('#result').addClass("red");
    }
    else {
      $('#result').html("<h3>loading...</h3>");
      $('#result').removeClass("red");
      makeApiCall(from, to, amount);
      $('#from').val("");
      $('#to').val("");
      $('#amount').val("");
    }
  });
});