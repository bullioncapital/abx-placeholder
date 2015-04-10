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
