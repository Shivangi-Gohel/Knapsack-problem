function getInput() {
  return {
    values: document.getElementById("values").value.split(",").map(Number),
    weights: document.getElementById("weights").value.split(",").map(Number),
    capacity: Number(document.getElementById("capacity").value),
  };
}

function clearUI() {
  document.getElementById("process").innerHTML = "";
  document.getElementById("result").innerHTML = "";
}

/* ================= GREEDY ANIMATION ================= */

async function startGreedy() {
  clearUI();
  const { values, weights, capacity } = getInput();

  let items = values.map((v, i) => ({
    value: v,
    weight: weights[i],
    ratio: v / weights[i],
  }));

  items.sort((a, b) => b.ratio - a.ratio);

  let remaining = capacity;
  let total = 0;

  for (let item of items) {
    await sleep(800);

    if (remaining >= item.weight) {
      remaining -= item.weight;
      total += item.value;
      addStep(`Picked full item (W:${item.weight}, V:${item.value})`);
    } else {
      let fraction = remaining / item.weight;
      total += item.value * fraction;
      addStep(
        `Picked ${fraction.toFixed(2)} fraction of item (W:${item.weight}, V:${item.value})`,
      );
      break;
    }
  }

  document.getElementById("result").innerHTML =
    `<b>Maximum Value (Greedy):</b> ${total.toFixed(2)}`;
}

/* ================= DP ANIMATION ================= */

async function startDP() {
  clearUI();
  const { values, weights, capacity } = getInput();
  const n = values.length;

  let dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));
  const process = document.getElementById("process");

  for (let i = 1; i <= n; i++) {
    let row = document.createElement("div");
    row.className = "dp-row";

    for (let w = 0; w <= capacity; w++) {
      await sleep(100);

      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w],
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }

      let cell = document.createElement("div");
      cell.className = "dp-cell";
      cell.innerText = dp[i][w];
      row.appendChild(cell);
    }

    process.appendChild(row);
  }

  document.getElementById("result").innerHTML =
    `<b>Maximum Value (DP):</b> ${dp[n][capacity]}`;
}

/* ================= HELPERS ================= */

function addStep(text) {
  const div = document.createElement("div");
  div.className = "step";
  div.innerText = text;
  document.getElementById("process").appendChild(div);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
