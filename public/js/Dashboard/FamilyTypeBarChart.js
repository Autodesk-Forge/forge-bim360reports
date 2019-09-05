function FamilyTypeBarChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}



FamilyTypeBarChart.prototype.load = function () {
    var barchartCanvas = $('#familyTypeBarChart'); // need to change the hardcoded ID
    barchartCanvas.append('<canvas id="myBarChart" width="400" height="400"></canvas>');
    startReportDataLoader(viewer, runBarReport);
}

FamilyTypeBarChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}

function barChart(barOpts) {
    barOpts.data.content.sort(function (a, b) {
        if (a.value < b.value) return 1;
        else if (a.value > b.value) return -1;
        return 0;
    });

    if (barOpts.data.content.length < 10) {
        barOpts.data.smallSegmentGrouping.enabled = false;
    } else if (barOpts.data.content.length > 20) {
        //barOpts.labels.truncation.enabled = true;
        var thresholdObj = barOpts.data.content[19];
        barOpts.data.smallSegmentGrouping.value = thresholdObj.value;
    }

    console.log('The bar opts', barOpts);

    var Labels = [];
    var BarValues = [];
    var dbids = [];
    var coloR = [];

    function get_random_color() {
        var letters = 'ABCDE'.split('');
        var color = '#';
        for (var i=0; i<3; i++ ) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    barOpts.data.content.forEach((data) => {
        Labels.push(data.label);
        BarValues.push(data.value);
        dbids.push(data.lmvIds);
        coloR.push(get_random_color());
    })

    console.log('Array of Labels', Labels)
    console.log('Array of Values', BarValues)
    console.log('Array of Colors', coloR)
    var ctx = document.getElementById('myBarChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Labels,
            datasets: [{
                label: 'System Type',
                data: BarValues,
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

function runBarReport() {
   
    var reportObj = _reportOptions[0];
    console.log("Running report: " + reportObj.label);
    _currentQty = null;
    _currentBound = null;
    var modelTypes = groupDataByType();
    wrapDataForBarChart(modelTypes);  
}

function wrapDataForBarChart(buckets, misCount) {
    var fieldName = (_reportOptions[0].fieldName === "");
    var barOpts = [];

    barOpts.data = {
        "content": [],
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 1,
            "valueType": "value"   // percentage or value
        },
    };

    for (var valueKey in buckets) {
        var barObject = {};
        barObject.label = valueKey;
        barObject.value = buckets[valueKey].length;
        barObject.lmvIds = buckets[valueKey];
        barOpts.data.content.push(barObject);
    }

    barChart(barOpts);
}

// initialize
function initBarOpts(fieldName, reportIndex) {
    var barOpts = initBarDefaults(fieldName);
    barOpts.reportIndex = reportIndex;

    barOpts.data = {
        "sortOrder": _sortOrder,
        "content": [],
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 1,
            "valueType": "value"   // percentage or value
        },
    };

    return barOpts;
}