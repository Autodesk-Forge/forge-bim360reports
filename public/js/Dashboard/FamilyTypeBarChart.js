function FamilyTypeBarChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}



FamilyTypeBarChart.prototype.load = function () {
    var barchartCanvas = $('#familyTypeBarChart'); // need to change the hardcoded ID
    barchartCanvas.append('<canvas id="myChart" width="400" height="400"></canvas>');
    barCharts();
}

FamilyTypeBarChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}

function barCharts() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'System Type',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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
                console.log ('legend onClick', evt);
                console.log('legd item', item);
            }
        }
    });
}