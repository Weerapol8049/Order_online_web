

function loadXMLFile() {
    // Create a new XMLHttpRequest object 
    const xhr = new XMLHttpRequest(); 
    
    // Open the XML file 
    xhr.open('GET', 'file://stmm-ad2/RedirectData/1011405/My%20Documents/2407200001_HPKYI_1.xml', true); 
    
    // Handle the response 
    xhr.onreadystatechange = function() { 
    if (xhr.readyState === 4 && xhr.status === 200) { 
        // Parse the XML response 
        const doc = xhr.responseXML; 
    
        // Now you can access the XML data using the DOM APIs 
        console.log(doc.documentElement.nodeName); 
        // Access other elements and attributes as needed 
    } 
    }; 
    
    // Send the request 
    xhr.send(); 
}