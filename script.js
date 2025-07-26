document.getElementById('bp-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const rev = +document.getElementById('revenue').value;
  const growth = +document.getElementById('growth').value / 100;
  const margin = +document.getElementById('margin').value / 100;
  const costs = +document.getElementById('costs').value;
  const costGrowth = +document.getElementById('costGrowth').value / 100;
  const invest = +document.getElementById('investment').value;
  const years = +document.getElementById('years').value;
  const discount = +document.getElementById('discount').value / 100;

  let table = `<table><tr><th>Year</th><th>Revenue</th><th>Gross Profit</th><th>Fixed Costs</th><th>EBITDA</th><th>Cash Flow</th><th>Discounted CF</th></tr>`;
  let labels = [], cash = [], ebits = [], npv = 0, irrCash = [-invest];

  let revY = rev, costY = costs, cashCum = -invest;

  for (let i = 1; i <= years; i++) {
    const gp = revY * margin;
    const ebitda = gp - costY;
    const cf = ebitda;
    const disc = cf / Math.pow(1 + discount, i);
    irrCash.push(cf);
    cashCum += cf;

    table += `<tr><td>${i}</td><td>${revY.toFixed(0)}</td><td>${gp.toFixed(0)}</td><td>${costY.toFixed(0)}</td><td>${ebitda.toFixed(0)}</td><td>${cf.toFixed(0)}</td><td>${disc.toFixed(0)}</td></tr>`;

    labels.push("Year " + i);
    cash.push(cashCum);
    ebits.push(ebitda);

    revY *= (1 + growth);
    costY *= (1 + costGrowth);
    npv += disc;
  }

  table += `</table>`;
  document.getElementById("results").innerHTML = `<h3>NPV: €${npv.toFixed(0)}</h3>` + table;

  const ctx = document.getElementById("chart").getContext("2d");
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Cumulative Cash Flow', data: cash, borderColor: 'blue', fill: false },
        { label: 'EBITDA', data: ebits, borderColor: 'green', fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
});

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("EdgeGas Business Plan Simulation", 20, 20);
  doc.html(document.getElementById("results"), {
    callback: function (doc) {
      doc.save("EdgeGas_BusinessPlan.pdf");
    },
    x: 20,
    y: 30
  });
}
