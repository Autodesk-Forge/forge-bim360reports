/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

// BarChart using NVD3.js
// This will get called when PieChart gets called by the LoadModels.js file

function loadBarChart(lmvData) {

    nv.addGraph(function() {
        var barChart = nv.models.multiBarHorizontalChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .showValues(true)
            .showControls(false)
            .tooltips(false)
            .valueFormat(d3.format('f'))
            .margin({ top: 0, right: 60, bottom: 0, left: 160})
            .transitionDuration(400);


        lmvData.content.sort(function(a,b) {
            if (_sortOrder == "value-asc")
                return a.value - b.value;
            else if (_sortOrder == "value-desc")
                return b.value - a.value;
            else if (_sortOrder == "label-asc")
                return a.label < b.label ? -1 : 1;
            else if (_sortOrder == "label-desc")
                return b.label < a.label ? -1 : 1;
        } );
        var barCharData =
            [
                {
                    key: "Quantity",
                    values: lmvData.content
                }
            ];
        
        barChart.height((lmvData.content.length + 2) * 15); // give each line 15px + add a header and footer

        var svg = d3.select("#barChart").append("svg")
           .attr("height", "600")
           // .attr('viewBox','0 0 600 400')

        svg.datum(barCharData)
            .call(barChart);
        barChart.yAxis.axisLabel("Quantity").tickFormat(d3.format("d"));
        d3.selectAll('svg .nv-bar').on('click', handleBarClick);

        nv.utils.windowResize(barChart.update);
        window.addEventListener('resize', barChart.render);

        return barChart;
    });
}

function handleBarClick(evt) {

    if (d3.select(this).classed("clicked") === true) {
        _viewerMain.showAll();
        _viewerSecondary.clearSelection();
        d3.select(this).classed({'clicked': false});
    } else {
        d3.selectAll('.nv-bar').classed({'clicked': false});
        d3.select(this).classed({'clicked': true});
        _viewerMain.isolate(evt.lmvIds);
        _viewerSecondary.select(evt.lmvIds);
    }
}