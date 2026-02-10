function clearScreen() {
  document.getElementById("process").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("table").innerHTML = "";
}

function getInputs() {
  var valuesStr = document.getElementById("values").value.trim();
  var weightsStr = document.getElementById("weights").value.trim();
  var capacityStr = document.getElementById("capacity").value.trim();

  if (!valuesStr || !weightsStr || !capacityStr) {
    alert("Please enter all inputs");
    return null;
  }

  var values = valuesStr.split(",").map(Number);
  var weights = weightsStr.split(",").map(Number);
  var capacity = parseInt(capacityStr);

  if (values.length !== weights.length) {
    alert("Values and Weights must be same length");
    return null;
  }

  return { values, weights, capacity };
}

function addStep(msg) {
  document.getElementById("process").innerHTML += "• " + msg + "<br>";
}

function runGreedy() {

  clearScreen();

  var data = getInputs();
  if (!data) return;

  var values = data.values;
  var weights = data.weights;
  var capacity = data.capacity;

  addStep("<b>Step 1:</b> Calculate Value/Weight ratio");

  var items = [];

  for (var i = 0; i < values.length; i++) {

    var ratio = values[i] / weights[i];

    items.push({
      index: i+1,
      value: values[i],
      weight: weights[i],
      ratio: ratio
    });

    addStep(
      "Item "+(i+1)+
      ": Ratio = "+ratio.toFixed(2)
    );
  }

  addStep("<b>Step 2:</b> Sort items by ratio (Descending)");

  items.sort((a,b)=>b.ratio-a.ratio);

  var remaining = capacity;
  var total = 0;

  var table = `
  <table>
  <tr>
  <th>Item</th>
  <th>Value</th>
  <th>Weight</th>
  <th>Ratio</th>
  <th>Selected</th>
  <th>% Taken</th>
  <th>Remaining Capacity</th>
  </tr>`;

  for (var item of items) {

    if (remaining == 0) break;

    var percent, selected;

    if (item.weight <= remaining) {

      percent = 100;
      selected = "Fully";

      total += item.value;
      remaining -= item.weight;

      addStep(
        "Item "+item.index+
        " selected fully (Weight="+item.weight+")"
      );
    }
    else {

      percent =
        (remaining/item.weight)*100;

      selected = "Partial";

      total += item.value*(percent/100);

      addStep(
        "Item "+item.index+
        " selected "+percent.toFixed(1)+"%"
      );

      remaining = 0;
    }

    table += `
    <tr>
    <td>${item.index}</td>
    <td>${item.value}</td>
    <td>${item.weight}</td>
    <td>${item.ratio.toFixed(2)}</td>
    <td>${selected}</td>
    <td>${percent.toFixed(1)}%</td>
    <td>${remaining}</td>
    </tr>`;
  }

  table += "</table>";

  document.getElementById("table").innerHTML = table;

  document.getElementById("result").innerHTML =
    "<b>Maximum Value (Greedy):</b> "+total.toFixed(2);
}

function runDP() {

  clearScreen();

  var data = getInputs();
  if (!data) return;

  var values = data.values;
  var weights = data.weights;
  var capacity = data.capacity;
  var n = values.length;

  addStep("<b>Step 1:</b> Create DP table");

  var dp = [];

  for (var i=0;i<=n;i++) {

    dp[i]=[];

    for (var w=0;w<=capacity;w++)
      dp[i][w]=0;
  }

  addStep("<b>Step 2:</b> Fill table using Include / Exclude rule");

  for (var i=1;i<=n;i++) {

    for (var w=0;w<=capacity;w++) {

      if (weights[i-1]<=w) {

        var include =
          values[i-1]+
          dp[i-1][w-weights[i-1]];

        var exclude =
          dp[i-1][w];

        if (include>exclude) {

          dp[i][w]=include;

          addStep(
            "Item "+i+
            " INCLUDED at capacity "+w+
            " → Value="+include
          );
        }
        else {

          dp[i][w]=exclude;

          addStep(
            "Item "+i+
            " EXCLUDED at capacity "+w
          );
        }
      }
      else {

        dp[i][w]=dp[i-1][w];
      }
    }
  }

  // Backtracking
  addStep("<b>Step 3:</b> Backtracking to find selected items");

  var w=capacity;
  var selected=[];

  for (var i=n;i>0;i--) {

    if (dp[i][w]!=dp[i-1][w]) {

      selected.push(i);

      addStep(
        "Item "+i+
        " selected (Weight="+weights[i-1]+")"
      );

      w-=weights[i-1];
    }
  }

  drawDPTable(dp,selected,n,capacity);

  document.getElementById("result").innerHTML =
    "<b>Maximum Value (DP):</b> "+
    dp[n][capacity]+
    "<br><b>Selected Items:</b> "+
    selected.reverse().join(", ");
}

function drawDPTable(dp,selected,n,capacity) {

  var html="<table><tr><th>Item\\Cap</th>";

  for(var w=0;w<=capacity;w++)
    html+="<th>"+w+"</th>";

  html+="</tr>";

  for(var i=0;i<=n;i++){

    html+="<tr><th>"+i+"</th>";

    for(var w=0;w<=capacity;w++){

      var cls="";

      if(selected.includes(i))
        cls="highlight";

      html+="<td class='"+cls+"'>"+
      dp[i][w]+"</td>";
    }

    html+="</tr>";
  }

  html+="</table>";

  document.getElementById("table").innerHTML=html;
}