function main() {
    let rangeSlider = document.getElementById("range-slider");
    let rangeLabel = document.getElementById("range-label");
    
    function genSliderLabel() {
      rangeLabel.innerHTML = rangeSlider.value;
      let labelPosition = (rangeSlider.value - rangeSlider.min) / (rangeSlider.max - rangeSlider.min);
    
      if (rangeSlider.value === rangeSlider.min) {
        rangeLabel.style.left = labelPosition * 100 + 2 + "%";
      } else if (rangeSlider.value === rangeSlider.max) {
        rangeLabel.style.left = labelPosition * 100 - 2 + "%";
      } else {
        rangeLabel.style.left = labelPosition * 100 + "%";
      }
    }
    
    genSliderLabel(); //Set default presentation
    rangeSlider.addEventListener("input", genSliderLabel, false);
}

export default main;