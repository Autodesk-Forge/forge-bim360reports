function FamilyTypeBarChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}

FamilyTypeBarChart.prototype.load = function () {
    var barchartCanvas = $('#familyTypeBarChart'); // need to change the hardcoded ID
    barchartCanvas.append('<canvas id="myBarChart" width="400" height="400"></canvas>');
    startReportDataLoader(viewer, runReport);
    BarChart(chartOpts)
}

FamilyTypeBarChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}

function BarChart(barOpts) {
    
    loadReportDataChart(barOpts)
    var ctx = document.getElementById('myBarChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Labels,
            datasets: [{
                label: 'System Type',
                data: Values,
                backgroundColor: coloR,
                borderColor: coloR,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            'onClick' : function (evt, item) {
                viewer.isolate(dbids[item[0]._index])
            }
        }
    });
}