const simplifyBtn = document.getElementById("simplifyBtn");
const sliders = ["asl", "asw", "pdw"];

sliders.forEach(id => {
  document.getElementById(id).addEventListener("input", (e) => {

    const changed = e.target.id;
    const value = parseInt(e.target.value);

    const others = sliders.filter(s => s !== changed);

    const remaining = 100 - value;
    const share = remaining / 2;

    document.getElementById(others[0]).value = share;
    document.getElementById(others[1]).value = share;
  });
});

simplifyBtn.addEventListener("click", async () => {

  const text = document.getElementById("inputText").value;

  const asl = parseFloat(document.getElementById("asl").value);
  const asw = parseFloat(document.getElementById("asw").value);
  const pdw = parseFloat(document.getElementById("pdw").value);

  const total = asl + asw + pdw;

  const weights = {
    wASL: asl / total,
    wASW: asw / total,
    wPDW: pdw / total
  };

  const response = await fetch("http://localhost:3000/simplify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text, weights })
  });

  const data = await response.json();

  document.getElementById("result").innerText =
    "Best Model: " + data.best.model + "\n\n" +
    data.best.text;
});
