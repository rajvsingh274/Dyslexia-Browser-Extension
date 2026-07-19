document.addEventListener("DOMContentLoaded", async () => {

  const inputText = document.getElementById("inputText");
  const resultBox = document.getElementById("result");
  const simplifyBtn = document.getElementById("simplifyBtn");

  const aslSlider = document.getElementById("asl");
  const aswSlider = document.getElementById("asw");
  const pdwSlider = document.getElementById("pdw");

  const sliders = [aslSlider, aswSlider, pdwSlider];

  // ----------------------------------
  // 1️⃣ Auto-balance sliders (sum=100)
  // ----------------------------------
  sliders.forEach(slider => {
    slider.addEventListener("input", (e) => {

      const changedSlider = e.target;
      const changedValue = parseInt(changedSlider.value);

      const otherSliders = sliders.filter(s => s !== changedSlider);

      const remaining = 100 - changedValue;
      const split = Math.floor(remaining / 2);

      otherSliders[0].value = split;
      otherSliders[1].value = remaining - split;

    });
  });

  // ----------------------------------
  // 2️⃣ Auto-fill selected text
  // ----------------------------------
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });

    const selectedText = results[0].result;

    if (selectedText && selectedText.trim().length > 0) {
      inputText.value = selectedText;
    }

  } catch (err) {
    console.error("Error getting selected text:", err);
  }

  let selectedColor = "#fff6cc"; // default

const colorCircles = document.querySelectorAll(".color-circle");

colorCircles.forEach(circle => {
  circle.addEventListener("click", () => {

    // remove previous selection
    colorCircles.forEach(c => c.classList.remove("selected"));

    // add new selection
    circle.classList.add("selected");

    // store selected color
    selectedColor = circle.getAttribute("data-color");
  });
});
  // ----------------------------------
  // 3️⃣ Simplify button
  // ----------------------------------
  simplifyBtn.addEventListener("click", async () => {

    const text = inputText.value.trim();

    if (!text) {
      resultBox.innerText = "Please select or enter text first.";
      return;
    }

    const asl = parseInt(aslSlider.value);
    const asw = parseInt(aswSlider.value);
    const pdw = parseInt(pdwSlider.value);

    const total = asl + asw + pdw;

    const weights = {
      wASL: asl / total,
      wASW: asw / total,
      wPDW: pdw / total
    };

    const fontStyle = document.getElementById("fontStyle").value;

    try {
      resultBox.innerText = "Simplifying...";

      const response = await fetch("http://127.0.0.1:3000/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, weights })
      });

      const data = await response.json();

resultBox.innerText =
  "Best Model: " + data.best.model + "\n\n" +
  data.best.text;

// 🔥 ADD THIS PART (VERY IMPORTANT)
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

chrome.tabs.sendMessage(tab.id, {
  action: "simplify",
  result: data,
  ui: {
    bgColor: selectedColor,
    fontStyle
}
});

    } catch (err) {
      console.error("Fetch error:", err);
      resultBox.innerText = "Error connecting to server.";
    }

  });

});
