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

$(document).ready(function () {
    $(document).on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('orbit-gizmo')) {
            // to make sure we get the viewer, let's use the global var NOP_VIEWER
            if (NOP_VIEWER === null || NOP_VIEWER === undefined) return;
            new Dashboard(NOP_VIEWER, [
                new BarChart('Material'),
                new PieChart('Material')
            ])
        }
    });
})

// Handles the Dashboard panels
class Dashboard {
    constructor(viewer, panels) {
        var _this = this;
        this._viewer = viewer;
        this._panels = panels;
        this.adjustLayout();
        this._viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (viewer) => {
            _this.loadPanels();
        });
    }

    adjustLayout() {
        // this function may vary for layout to layout...
        // for learn forge tutorials, let's get the ROW and adjust the size of the 
        // columns so it can fit the new dashboard column, also we added a smooth transition css class for a better user experience
        var row = $(".row").children();
        $(row[0]).removeClass('col-sm-4').addClass('col-sm-2 transition-width');
        $(row[1]).removeClass('col-sm-8').addClass('col-sm-7 transition-width').after('<div class="col-sm-3 transition-width" id="dashboard"></div>');
    }

    loadPanels () {
        var _this = this;
        var data = new ModelData(this);
        data.init(function () {
            $('#dashboard').empty();
            _this._panels.forEach(function (panel) {
                // let's create a DIV with the Panel Function name and load it
                panel.load('dashboard', viewer, data);
            });
        });
    }
}