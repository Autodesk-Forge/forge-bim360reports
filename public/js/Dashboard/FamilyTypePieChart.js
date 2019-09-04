function FamilyTypePieChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}

const _reportOptions = [{ label: "Qty - Type", fieldName: "", fieldType: "ModelType" }];
var _currentQty = null;
var _currentBound = null;

FamilyTypePieChart.prototype.load = function () {
    var piechartCanvas = $('#familyTypePieChart');
    piechartCanvas.append('<canvas id="myChart" width="400" height="400"></canvas>');
    startReportDataLoader(viewer, runPieReport);
}

FamilyTypePieChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}

function pieChart(pieOpts) {
    // if we have a lot of buckets, don't let the pie chart get out of control, condense anything with 2 or less
    // into an "Other" wedge.

    pieOpts.data.content.sort(function (a, b) {
        if (a.value < b.value) return 1;
        else if (a.value > b.value) return -1;
        return 0;
    });

    if (pieOpts.data.content.length < 10) {
        pieOpts.data.smallSegmentGrouping.enabled = false;
    } else if (pieOpts.data.content.length > 20) {
        //pieOpts.labels.truncation.enabled = true;
        var thresholdObj = pieOpts.data.content[19];
        pieOpts.data.smallSegmentGrouping.value = thresholdObj.value;
    }

    console.log('The Pie opts', pieOpts);

    var Labels = [];
    var PieValues = [];
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

    pieOpts.data.content.forEach((data) => {
        Labels.push(data.label);
        PieValues.push(data.value);
        dbids.push(data.lmvIds);
        coloR.push(get_random_color());
    })

    console.log('Array of Labels', Labels)
    console.log('Array of Values', PieValues)
    console.log('Array of Colors', coloR)
    

    var ctx = document.getElementById("myChart")

    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Dataset',
                data: PieValues,
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

function runPieReport() {
   
    var reportObj = _reportOptions[0];
    console.log("Running report: " + reportObj.label);
    _currentQty = null;
    _currentBound = null;
    var modelTypes = groupDataByType();
    wrapDataForPieChart(modelTypes);  
}

function wrapDataForPieChart(buckets, misCount) {
    var fieldName = (_reportOptions[0].fieldName === "");
    var pieOpts = [];

    pieOpts.data = {
        "content": [],
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 1,
            "valueType": "value"   // percentage or value
        },
    };

    for (var valueKey in buckets) {
        var pieObject = {};
        pieObject.label = valueKey;
        pieObject.value = buckets[valueKey].length;
        pieObject.lmvIds = buckets[valueKey];
        pieOpts.data.content.push(pieObject);
    }

    pieChart(pieOpts);
}

// initialize
function initPieOpts(fieldName, reportIndex) {
    var pieOpts = initPieDefaults(fieldName);
    pieOpts.reportIndex = reportIndex;

    pieOpts.data = {
        "sortOrder": _sortOrder,
        "content": [],
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 1,
            "valueType": "value"   // percentage or value
        },
    };

    return pieOpts;
}