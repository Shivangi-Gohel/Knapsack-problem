// Clear the screen
function clearScreen() {
  document.getElementById("process").innerHTML = "";
  document.getElementById("result").innerHTML = "";
}

// Get user inputs
function getInputs() {
  // Get values from text boxes
  var valuesText = document.getElementById("values").value;
  var weightsText = document.getElementById("weights").value;
  var capacityText = document.getElementById("capacity").value;

  // Convert to arrays
  var values = valuesText.split(",");
  var weights = weightsText.split(",");
  var capacity = parseFloat(capacityText);

  // Convert strings to numbers
  for (var i = 0; i < values.length; i++) {
    values[i] = parseFloat(values[i]);
  }

  for (var i = 0; i < weights.length; i++) {
    weights[i] = parseFloat(weights[i]);
  }

  return {
    values: values,
    weights: weights,
    capacity: capacity,
  };
}

// Add a step to show what's happening
function addStep(message) {
  var processDiv = document.getElementById("process");
  var newStep = document.createElement("div");
  newStep.className = "step";
  newStep.innerHTML = message;
  processDiv.appendChild(newStep);
}

// Show the result
function showResult(message) {
  document.getElementById("result").innerHTML = message;
}

// GREEDY ALGORITHM - Simple version
function runGreedy() {
  clearScreen();

  // Get inputs
  var inputs = getInputs();
  var values = inputs.values;
  var weights = inputs.weights;
  var capacity = inputs.capacity;

  addStep("<b>Starting Greedy Algorithm</b>");
  addStep("Capacity: " + capacity);

  // Create items list
  var items = [];
  for (var i = 0; i < values.length; i++) {
    var item = {
      value: values[i],
      weight: weights[i],
      ratio: values[i] / weights[i],
      index: i + 1,
    };
    items.push(item);
  }

  addStep("We have " + items.length + " items");

  // Sort items by ratio (value/weight)
  items.sort(function (a, b) {
    return b.ratio - a.ratio;
  });

  addStep("Sorted items by value/weight ratio");

  // Fill the knapsack
  var remaining = capacity;
  var totalValue = 0;
  var selectedItems = [];

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    if (remaining <= 0) {
      addStep("Knapsack is full!");
      break;
    }

    if (remaining >= item.weight) {
      // Take whole item
      remaining -= item.weight;
      totalValue += item.value;
      selectedItems.push("Item " + item.index + " (full)");

      addStep("✅ Took Item " + item.index + " completely");
      addStep("   Value: +" + item.value + ", Remaining: " + remaining);
    } else {
      // Take fraction
      var fraction = remaining / item.weight;
      var fractionValue = item.value * fraction;
      totalValue += fractionValue;
      selectedItems.push(
        "Item " + item.index + " (" + Math.round(fraction * 100) + "%)",
      );

      addStep(
        "✅ Took " + Math.round(fraction * 100) + "% of Item " + item.index,
      );
      addStep("   Value: +" + fractionValue.toFixed(2) + ", Knapsack is full");
      remaining = 0;
    }
  }

  // Show final result
  showResult(
    "🎯 Maximum Value: " +
      totalValue.toFixed(2) +
      "<br>Selected items: " +
      selectedItems.join(", "),
  );
}

// DYNAMIC PROGRAMMING - Simple version
function runDP() {
  clearScreen();

  // Get inputs
  var inputs = getInputs();
  var values = inputs.values;
  var weights = inputs.weights;
  var capacity = inputs.capacity;
  var n = values.length;

  addStep("<b>Starting Dynamic Programming</b>");
  addStep("Items: " + n + ", Capacity: " + capacity);

  // Create DP table (2D array)
  var dp = [];
  for (var i = 0; i <= n; i++) {
    dp[i] = [];
    for (var w = 0; w <= capacity; w++) {
      dp[i][w] = 0;
    }
  }

  // Fill DP table
  for (var i = 1; i <= n; i++) {
    for (var w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        // We can take this item
        var option1 = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        var option2 = dp[i - 1][w];
        dp[i][w] = Math.max(option1, option2);
      } else {
        // Can't take this item
        dp[i][w] = dp[i - 1][w];
      }
    }
    addStep(
      "Processed Item " +
        i +
        " (Value: " +
        values[i - 1] +
        ", Weight: " +
        weights[i - 1] +
        ")",
    );
  }

  // Create visual table
  var tableDiv = document.createElement("div");
  tableDiv.className = "dp-table";

  // Add table header
  var headerRow = document.createElement("div");
  headerRow.className = "dp-row";
  headerRow.innerHTML =
    '<div class="dp-cell" style="background:#333">i\w</div>';

  for (var w = 0; w <= capacity; w++) {
    headerRow.innerHTML +=
      '<div class="dp-cell" style="background:#333">' + w + "</div>";
  }
  tableDiv.appendChild(headerRow);

  // Add table rows
  for (var i = 0; i <= n; i++) {
    var rowDiv = document.createElement("div");
    rowDiv.className = "dp-row";

    // Row header
    if (i === 0) {
      rowDiv.innerHTML +=
        '<div class="dp-cell" style="background:#333">0</div>';
    } else {
      rowDiv.innerHTML +=
        '<div class="dp-cell" style="background:#333">Item ' + i + "</div>";
    }

    // Row values
    for (var w = 0; w <= capacity; w++) {
      rowDiv.innerHTML += '<div class="dp-cell">' + dp[i][w] + "</div>";
    }

    tableDiv.appendChild(rowDiv);
  }

  document.getElementById("process").appendChild(tableDiv);

  // Find which items were selected
  addStep("<b>Finding selected items...</b>");

  var i = n;
  var w = capacity;
  var selectedItems = [];

  while (i > 0 && w > 0) {
    if (dp[i][w] !== dp[i - 1][w]) {
      // Item was taken
      selectedItems.push("Item " + i);
      w -= weights[i - 1];
      addStep("✅ Selected Item " + i);
    } else {
      addStep("✗ Skipped Item " + i);
    }
    i--;
  }

  // Show result
  var maxValue = dp[n][capacity];
  showResult(
    "🎯 Maximum Value: " +
      maxValue +
      "<br>Selected items: " +
      selectedItems.reverse().join(", "),
  );
}
