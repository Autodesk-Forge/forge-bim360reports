function FamilyTypePieChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}

FamilyTypePieChart.prototype.load = function () {
    var piechartCanvas = $('#familyTypePieChart');
    piechartCanvas.append('<canvas id="myChart" width="400" height="400"></canvas>');
    pieChart();
}

FamilyTypePieChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}

function pieChart() {
    var ctx = document.getElementById("myChart")
    var myPieChart = new Chart(ctx, {
        type:'doughnut',
        data: {
            labels:['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
            datasets:[{
                label: 'Dataset',
                data:[300,50,100,40,150],
                backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ]
            }]
        }, // Adding Functionality to onClick events on the chart not working with LMV yet, but viewer is accessible from evt.view.viewer
        options: {
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