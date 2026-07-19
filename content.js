console.log("content.js loaded");

let savedRange = null;

// ✅ 1. SAVE SELECTION BEFORE POPUP OPENS
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();

  if (selection.rangeCount > 0 && selection.toString().trim() !== "") {
    savedRange = selection.getRangeAt(0);
    console.log("Range saved");
  }
});

// ✅ 2. CLEAN TEXT (REMOVE ANSI + WEIRD CHARACTERS)
function cleanText(text) {
  return text
    .replace(/\x1B\[[0-9;]*[A-Za-z]/g, "") // Remove ANSI escape codes
    .replace(/[^\x20-\x7E]/g, "");         // Remove non-printable chars
}

// ✅ 3. APPLY DYSLEXIA-FRIENDLY STYLING
function applyDyslexicStyle(el, ui = {}) {
  el.style.setProperty(
  "font-family",
  ui.fontStyle || "'Comic Sans MS', Arial, sans-serif",
  "important"
);
  el.style.setProperty("font-size", "1.1em", "important");
  el.style.setProperty("line-height", "1.8", "important");
  el.style.setProperty("letter-spacing", "0.08em", "important");
  el.style.setProperty("word-spacing", "0.2em", "important");
  el.style.setProperty(
  "background-color",
  ui.bgColor || "#fff6cc",
  "important"
);
  el.style.setProperty("color", "#000000", "important");
  el.style.setProperty("padding", "4px", "important");
  el.style.setProperty("border-radius", "4px", "important");
}

// ✅ 4. LISTEN FOR POPUP MESSAGE
chrome.runtime.onMessage.addListener((request) => {
  if (request.action !== "simplify") return;

  console.log("Message received:", request);

  // ❌ If no saved selection → stop
  if (!savedRange) {
    console.log("No saved range available");
    return;
  }

  try {
    // ✅ Clean the text
    const clean = cleanText(request.result.best.text);

    // ✅ Create styled element
    const span = document.createElement("span");
    span.textContent = clean;

    applyDyslexicStyle(span, request.ui);

    // ✅ Replace selected text
    savedRange.deleteContents();
    savedRange.insertNode(span);

    // ✅ Fix layout issues
    span.style.display = "inline-block";

    console.log("Text replaced successfully");

  } catch (err) {
    console.error("Error replacing text:", err);
  }
});