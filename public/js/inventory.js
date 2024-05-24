document.querySelector("form").addEventListener("submit", function(event) {
    var select = document.querySelector("#classification_name");
    var selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value === "select") {
      alert("Please, select an type of car.");
      event.preventDefault(); 
    }
  });

  