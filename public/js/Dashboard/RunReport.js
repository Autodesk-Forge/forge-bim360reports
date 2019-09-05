const _reportOptions = [{ label: "Qty - Type", fieldName: "", fieldType: "ModelType" }];
var _currentQty = null;
var _currentBound = null;
var chartOpts = [];
var Labels = [];
var Values = [];
var dbids = [];
var coloR = [];

function runReport() {

    Labels = [];
    Values = [];
    dbids = [];
    coloR =[];

    var reportObj = _reportOptions[0];
    console.log("Running report: " + reportObj.label);
    _currentQty = null;
    _currentBound = null;
    var modelTypes = groupDataByType();
    wrapDataForChart(modelTypes);  
}

function wrapDataForChart(buckets, misCount) {
    //var fieldName = (_reportOptions[0].fieldName === "");
   // var chartOpts = [];

    chartOpts.data = {
        "content": [],
        "smallSegmentGrouping": {
            "enabled": true,
            "value": 1,
            "valueType": "value"   // percentage or value
        },
    };

    for (var valueKey in buckets) {
        var chartObject = {};
        chartObject.label = valueKey;
        chartObject.value = buckets[valueKey].length;
        chartObject.lmvIds = buckets[valueKey];
        chartOpts.data.content.push(chartObject);
    }

    return chartOpts
}

function loadReportDataChart (chartOpts) {
// if we have a lot of buckets, don't let the pie chart get out of control, condense anything with 2 or less
    // into an "Other" wedge.

    chartOpts.data.content.sort(function (a, b) {
        if (a.value < b.value) return 1;
        else if (a.value > b.value) return -1;
        return 0;
    });

    if (chartOpts.data.content.length < 10) {
        chartOpts.data.smallSegmentGrouping.enabled = false;
    } else if (chartOpts.data.content.length > 20) {
        var thresholdObj = chartOpts.data.content[19];
        chartOpts.data.smallSegmentGrouping.value = thresholdObj.value;
    }

    function get_random_color() {
        var letters = 'ABCDE'.split('');
        var color = '#';
        for (var i=0; i<3; i++ ) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    chartOpts.data.content.forEach((data) => {
        Labels.push(data.label);
        Values.push(data.value);
        dbids.push(data.lmvIds);
        coloR.push(get_random_color());
    })

    return;
}
