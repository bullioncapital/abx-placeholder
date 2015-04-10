/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

(function() {
  var formEl = document.getElementById('mc-embedded-subscribe-form');
  var formErrorEl = document.getElementById('formErrors');
  var formSubmitEl = document.getElementById('formSubmit');
  var formTimeout = null;
  var useBefore = true;

  formEl.addEventListener( 'submit', function(){
    classie.remove(formEl, 'form--success');
    classie.remove(formEl, 'form--error');

    classie.add(formEl, 'form--submitted');
    toggleSubmitStatus('Just hold on...');
  });

  // Override the MailChimp post callback
  window.mc.ajaxOptions.success = function mceSuccessCb(resp){
    classie.remove(formEl, 'form--submitted');
    
    if (resp.result == "success"){
      classie.add(formEl, 'form--success');
      toggleSubmitStatus('Thank You!');

      formTimeout = setTimeout(function(){
        classie.remove(formEl, 'form--success');
        toggleSubmitStatus('Notify me when ABX launches');
      }, 3000);
    } 
    else {
      var parts = resp.msg.split(' - ',2);
      if (parts[1]===undefined){
        msg = resp.msg;
      } else {
        i = parseInt(parts[0]);
        if (i.toString() == parts[0]){
          msg = parts[1];
        } else {
          msg = resp.msg;
        }
      }
      classie.add(formEl, 'form--error');
      toggleSubmitStatus('Sorry, there was an error');
      formErrorEl.innerHTML = msg;

      formTimeout = setTimeout(function(){
        toggleSubmitStatus('Notify me when ABX launches');
      }, 3000);
    }
  };

  function toggleSubmitStatus(text){
    if(useBefore){
      formSubmitEl.setAttribute('data-before', text);
      classie.add(formEl, 'form--before--enter');
      classie.remove(formEl, 'form--after--enter');
    }
    else {
      formSubmitEl.setAttribute('data-after', text);
      classie.add(formEl, 'form--after--enter');
      classie.remove(formEl, 'form--before--enter');
    }

    useBefore = !useBefore;
  }
})();

(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-XXXXX-X','auto');ga('send','pageview');
(function() {
  // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
  if (!String.prototype.trim) {
    (function() {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function() {
        return this.replace(rtrim, '');
      };
    })();
  }
  
  var inputEl = document.getElementById('email');

  if( inputEl.value.trim() !== '' ) {
    classie.add(inputEl, 'input--filled');
  }

  // events
  inputEl.addEventListener( 'focus', onInputFocus );
  inputEl.addEventListener( 'blur', onInputBlur );

  function onInputFocus( ev ) {
    classie.add(inputEl, 'input--filled');
  }

  function onInputBlur( ev ) {
    if( inputEl.value.trim() === '' ) {
      classie.remove(inputEl, 'input--filled');
    }
  }
})();
