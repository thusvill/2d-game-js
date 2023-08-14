function Save(NAME, SCORE) {
    const dataToSave = {
      key1: NAME,
      key2: SCORE
    };
  
    // Convert the data to JSON format
    const jsonData = JSON.stringify(dataToSave);
  
    // Save JSON data to localStorage
    localStorage.setItem('savedData', jsonData);
  
    console.log('Data saved to localStorage successfully.');
  }
  
  function Load() {
    const jsonData = localStorage.getItem('savedData');
    if (jsonData) {
      return JSON.parse(jsonData);
    } else {
      return { key1: '', key2: 0 }; // Default values if no data found
    }
  }
  
  