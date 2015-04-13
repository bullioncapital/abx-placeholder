var fontToggle = false;

function toggleFonts(){
  if(fontToggle){
    document.documentElement.className = 'js wf-roboto-n5-active wf-roboto-n1-active wf-robotocondensed-n7-active wf-robotocondensed-n3-active wf-active';
  } else {
    document.documentElement.className = 'js wf-roboto-n5-inactive wf-roboto-n1-inactive wf-robotocondensed-n7-inactive wf-robotocondensed-n3-inactive wf-inactive';
  }
  fontToggle = !fontToggle;
}

