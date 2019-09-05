function FamilyTypePieChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}

FamilyTypePieChart.prototype.load = function () {
    var piechartCanvas = $('#familyTypePieChart');
    piechartCanvas.append('<canvas id="myPieChart" width="400" height="400"></canvas>');
    startReportDataLoader(viewer, runReport);
    PieChart(chartOpts);
}

FamilyTypePieChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}

function PieChart(pieOpts) {
    
    loadReportDataChart(pieOpts)
    var ctx = document.getElementById("myPieChart")

    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Dataset',
                data: Values,
                backgroundColor: coloR
            }]
        }, // Adding Functionality to onClick events on the chart not working with LMV yet, but viewer is accessible from evt.view.viewer
        options: {
            legend: {
                display: false
            },
            'onClick': function (evt, item) {
                viewer.isolate(dbids[item[0]._index])
            }
        }
    });
}