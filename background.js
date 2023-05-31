chrome.action.onClicked.addListener((action) => { 
  highlightText();
});   

chrome.commands.onCommand.addListener((command) => {
  highlightText();
});

async function reload() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => document.location.reload(),
  });  
}

async function highlightText(command) {  
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: walkTree,
  });

  function walkTree() {
    var n,a=[],
    walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ALL,
      null,
      false
    )  

    while(n=walk.nextNode()) a.push(n);

    a.forEach(applyBold);

    function applyBold(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const strings = node.textContent.split(' ');        
    
        for (let i=0,l=strings.length; i<l;++i) {
          const stringLength = strings[i].length;

          if (stringLength == 2) {    
              strings[i] = makeBold(strings[i], 1)
          } else if (stringLength == 3) {    
              strings[i] = makeBold(strings[i], 2)
          }  else if (stringLength == 4) {    
              strings[i] = makeBold(strings[i], 2)
          } else if (stringLength == 5) {    
              strings[i] = makeBold(strings[i], 3)
          } else if (stringLength == 6) {    
              strings[i] = makeBold(strings[i], 4)
          } else if (stringLength == 7) {    
              strings[i] = makeBold(strings[i], 4)
          } else if (stringLength == 8) {    
              strings[i] = makeBold(strings[i], 4)
          } else if (stringLength == 9) {    
              strings[i] = makeBold(strings[i], 5)
          } else if (stringLength == 10) {    
              strings[i] = makeBold(strings[i], 5)       
          } else if (stringLength == 11) {    
              strings[i] = makeBold(strings[i], 6)
          } else if (stringLength == 12) {    
              strings[i] = makeBold(strings[i], 6)
          } else if (stringLength >= 13) {    
              strings[i] = makeBold(strings[i], 7)
          } else {
              const text = ' ' + strings[i];
              strings[i] = document.createTextNode(text);
          }
        }
        // replace node with modified node
        strings.forEach(content => {
          const space = document.createTextNode(' ');    
          node.parentElement.appendChild(content);
          node.parentElement.appendChild(space);
        });
        node.parentElement.removeChild(node);
      // keep nodes as they are
      } else if (['URL','A', 'I', 'STRONG', 'SUP'].indexOf(node.tagName) !== -1) {
        const parent = node.parentElement;
        const cloned = node.cloneNode(true);                                
        parent.removeChild(node);

        parent.appendChild(cloned) 
      }
    }    
    
    function makeBold(text, boldLength) {
      // string is a special charecter - keep as it is
      if (isNaN(text) && text.toLowerCase() == text.toUpperCase()) {
        return document.createTextNode(text);
      // string is a number - keep as it is
      } else if (!isNaN(text)) {
        return document.createTextNode(text);
      }

      const container = document.createElement('span');         
      const boldSpan = document.createElement('span');
      const normalSpan = document.createElement('span');      
      container.appendChild(boldSpan);
      container.appendChild(normalSpan);
      
      const bold = text.substring(0, boldLength);
      const normal = text.substring(boldLength, text.length);
      boldSpan.innerHTML = bold;
      normalSpan.innerHTML = normal;
      boldSpan.style.fontWeight = 'bold';
      normalSpan.style.opacity = '0.6'
      
      return container;
    }     
  }    
}
  