(function() {
  var inputEl = document.getElementById('email');

  // Bail for IE8
  if(!inputEl.addEventListener){
    return;
  }

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
