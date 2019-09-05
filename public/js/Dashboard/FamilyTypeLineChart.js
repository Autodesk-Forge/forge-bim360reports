function FamilyTypeLineChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}


FamilyTypeLineChart.prototype.load = function () {
    var linechartCanvas = $('#familyTypeLineChart');
    linechartCanvas.append('<canvas id="myLineChart" width="400" height="400"></canvas>');
    startReportDataLoader(viewer, runLineReport);
}

FamilyTypeLineChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}

function lineChart(lineOpts) {
    // if we have a lot of buckets, don't let the line chart get out of control, condense anything with 2 or less
    // into an "Other" wedge.

    lineOpts.data.content.sort(function (a, b) {
        if (a.value < b.value) return 1;
        else if (a.value > b.value) return -1;
        return 0;
    });

    if (lineOpts.data.content.length < 10) {
        lineOpts.data.smallSegmentGrouping.enabled = false;
    } else if (lineOpts.data.content.length > 20) {
        //lineOpts.labels.truncation.enabled = true;
        var thresholdObj = lineOpts.data.content[19];
        lineOpts.data.smallSegmentGrouping.value = thresholdObj.value;
    }

    console.log('The line opts', lineOpts);

    var Labels = [];
    var LineValues = [];
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

    lineOpts.data.content.forEach((data) => {
        Labels.push(data.label);
        LineValues.push(data.value);
        dbids.push(data.lmvIds);
        coloR.push(get_random_color());
    })

    console.log('Array of Labels', Labels)
    console.log('Array of Values', LineValues)
    console.log('Array of Colors', coloR)
    

    var ctx = document.getElementById("myLineChart")

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Dataset',
                data: LineValues,
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

function runLineReport() {
   
    var reportObj = _reportOptions[0];
    console.log("Running report: " + reportObj.label);
    _currentQty = null;
    _currentBound = null;
    var modelTypes = groupDataByType();
    wrapDataForLineChart(modelTypes);  
}

function wrapDataForLineChart(buckets, misCount) {
    var fieldName = (_reportOptions[0].fieldName === "");
    var lineOpts = [];

    lineOpts.data = {
        "content": [],
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 1,
            "valueType": "value"   // percentage or value
        },
    };

    for (var valueKey in buckets) {
        var lineObject = {};
        lineObject.label = valueKey;
        lineObject.value = buckets[valueKey].length;
        lineObject.lmvIds = buckets[valueKey];
        lineOpts.data.content.push(lineObject);
    }

    lineChart(lineOpts);
}

// initialize
function initLineOpts(fieldName, reportIndex) {
    var lineOpts = initLineDefaults(fieldName);
    lineOpts.reportIndex = reportIndex;

    lineOpts.data = {
        "sortOrder": _sortOrder,
        "content": [],
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 1,
            "valueType": "value"   // percentage or value
        },
    };

    return lineOpts;
}