function clearScreen() {
  document.getElementById("process").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("table").innerHTML = "";
}

function getInputs() {
  var values = document.getElementById("values").value.split(",");
  var weights = document.getElementById("weights").value.split(",");
  var capacity = parseInt(document.getElementById("capacity").value);

  for (var i = 0; i < values.length; i++) {
    values[i] = parseInt(values[i]);
    weights[i] = parseInt(weights[i]);
  }

  return { values, weights, capacity };
}

function addStep(msg) {
  document.getElementById("process").innerHTML += "• " + msg + "<br>";
}

//////////////// GREEDY //////////////////
function runGreedy() {
  clearScreen();

  var data = getInputs();
  var values = data.values;
  var weights = data.weights;
  var capacity = data.capacity;

  addStep("Greedy algorithm started");

  var items = [];
  for (var i = 0; i < values.length; i++) {
    items.push({
      value: values[i],
      weight: weights[i],
      ratio: values[i] / weights[i],
      index: i + 1,
    });
  }

  items.sort(function (a, b) {
    return b.ratio - a.ratio;
  });

  var total = 0;
  var remaining = capacity;

  for (var i = 0; i < items.length; i++) {
    if (remaining === 0) break;

    if (items[i].weight <= remaining) {
      remaining -= items[i].weight;
      total += items[i].value;
      addStep("Took Item " + items[i].index + " fully");
    } else {
      var frac = remaining / items[i].weight;
      total += items[i].value * frac;
      addStep("Took partial Item " + items[i].index);
      remaining = 0;
    }
  }

  document.getElementById("result").innerHTML =
    "Maximum Value (Greedy): " + total.toFixed(2);
}

//////////////// DYNAMIC PROGRAMMING //////////////////
function runDP() {
  clearScreen();

  var data = getInputs();
  var values = data.values;
  var weights = data.weights;
  var capacity = data.capacity;
  var n = values.length;

  addStep("Dynamic Programming started");

  var dp = [];
  for (var i = 0; i <= n; i++) {
    dp[i] = [];
    for (var w = 0; w <= capacity; w++) {
      dp[i][w] = 0;
    }
  }

  for (var i = 1; i <= n; i++) {
    for (var w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w],
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
    addStep("Processed Item " + i);
  }

  drawTable(dp, n, capacity);

  document.getElementById("result").innerHTML =
    "Maximum Value (DP): " + dp[n][capacity];
}

function drawTable(dp, n, capacity) {
  var html = "<table><tr><th>i\\w</th>";

  for (var w = 0; w <= capacity; w++) {
    html += "<th>" + w + "</th>";
  }
  html += "</tr>";

  for (var i = 0; i <= n; i++) {
    html += "<tr><th>" + i + "</th>";
    for (var w = 0; w <= capacity; w++) {
      var cls = i === n && w === capacity ? "highlight" : "";
      html += "<td class='" + cls + "'>" + dp[i][w] + "</td>";
    }
    html += "</tr>";
  }

  html += "</table>";
  document.getElementById("table").innerHTML = html;
}
