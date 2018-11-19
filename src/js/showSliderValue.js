function main() {
    var rangeSlider = document.getElementById("range-slider");
    var rangeLabel = document.getElementById("range-label");
    
    function showSliderValue() {
      rangeLabel.innerHTML = rangeSlider.value;
      var labelPosition = (rangeSlider.value - rangeSlider.min) / (rangeSlider.max - rangeSlider.min);
    
      if (rangeSlider.value === rangeSlider.min) {
        rangeLabel.style.left = labelPosition * 100 + 2 + "%";
      } else if (rangeSlider.value === rangeSlider.max) {
        rangeLabel.style.left = labelPosition * 100 - 2 + "%";
      } else {
        rangeLabel.style.left = labelPosition * 100 + "%";
      }
    }
    
    rangeSlider.addEventListener("input", showSliderValue, false);
}

export default main;