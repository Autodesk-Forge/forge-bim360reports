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

var viewer = {};
viewer['3d'] = null;
viewer['2d'] = null;
var flagModel = false;

function blankOutReportPane() {
  $("#pieChart").empty();
  $("#barChart").empty();
  $("#list2dviews").empty();
  $("#viewerSecondary").empty();
  $("#forgeViewer").empty();
}

function blankOutReportPane3d() {
  $("#pieChart").empty();
  $("#barChart").empty();
  $("#forgeViewer").empty();
  $(".report-dropdowns").css('visibility', 'hidden');
  $("#dropdown2dviews").css('visibility', 'hidden');
}

function blankOutReportPane2d() {
  $("#pieChart").empty();
  $("#barChart").empty();
  $("#list2dviews").empty();
  $("#viewerSecondary").empty();
  $(".report-dropdowns").css('visibility', 'hidden');
  $("#dropdown2dviews").css('visibility', 'hidden');
}

function launchViewer(urn, div3d, div2d) {
  blankOutReportPane()
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };
  var documentId = 'urn:' + urn;
  Autodesk.Viewing.Initializer(options, function onInitialized() {
    Autodesk.Viewing.Document.load(documentId, function(doc) {
      // clear both viewers
      showModel(doc, '3d', div3d);
      showModel(doc, '2d', div2d, function(viewables) {
        var options = $("#list2dviews");
        viewables.forEach(function(view) {
          options.append($("<option />").val(view.guid).text(view.name));
        });
        options.change(function() {
          // destroy and recreate the 2d view
          viewer['2d'].impl.unloadCurrentModel();
          viewer['2d'].tearDown();
          viewer['2d'].finish();
          var viewerDiv = document.getElementById(div2d);
          viewer['2d'] = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
          var selected = this.value;
          viewables.forEach(function(view) {
            if (view.guid === selected)
              showSvf(doc, view, '2d');
          })
        });
      });

    }, onDocumentLoadFailure);
  });
}

function showModel(doc, role, div, callback) {
  // A document contains references to 3D and 2D viewables.
  var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
    'type': 'geometry',
    'role': role
  }, true);
  if (viewables.length === 0) {
    
    if (role === '3d'){
      blankOutReportPane3d()
      flagModel = true;
      $("#forgeViewer").append("<h2><em>There is no viewables available for 3D models</em></h2>")
      $("#pieChart").append("<p><em>No data could be retrieved for charts.  This report is probably not applicable for the given model.  As an example, Revit models can be sorted by Type or Level, but Fusion models cannot.  Fusion models are more appropriate for reports sorted by Mass, Volume, or Material.  Try switching to a different report or a different model.</em></p>");

    } else {
      blankOutReportPane2d()
      flagModel = true;
      $("#viewerSecondary").append("<h2><em>There is no viewables available for 2D models</em></h2>")
      $("#pieChart").append("<p><em>No data could be retrieved for charts.  This report is probably not applicable for the given model.  As an example, Revit models can be sorted by Type or Level, but Fusion models cannot.  Fusion models are more appropriate for reports sorted by Mass, Volume, or Material.  Try switching to a different report or a different model.</em></p>");

    }
    //console.error('Document contains no viewables.');
    return;
  }

  flagModel = false;
  var viewerDiv = document.getElementById(div);
  viewer[role] = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);

  showSvf(doc, viewables[0], role);

  if (callback) callback(viewables);
}

function showSvf(doc, viewable, role) {
  // Choose any of the avialble viewables
  var svfUrl = doc.getViewablePath(viewable);
  var modelOptions = {
    sharedPropertyDbPath: doc.getPropertyDbPath()
  };

  viewer[role].start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
}

function onDocumentLoadFailure(viewerErrorCode) {}

var blockEvent = false;

function onLoadModelSuccess(model) {
  viewer[(model.is3d() ? '3d' : '2d')].addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(selection) {
    if (blockEvent) return;
    if (selection.dbIdArray.length == 0) return;
    var role = (model.is3d() ? '2d' : '3d');
    blockEvent = true;
    viewer[role].select(selection.dbIdArray);
    viewer[role].fitToView(selection.dbIdArray);
    blockEvent = false;
  });

  // when the geometry is loaded, automatically run the first report

  if (model.is3d() && flagModel === false) {
    disableReportMenu();
    viewer['3d'].addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function(event) {
      enableReportMenu();
      //runReport(-1);   // run the currently selected report (the first one if this is the first model loaded, current one if loading a subsequent model)
      $("#tab_button_1").click();
      startReportDataLoader(viewer['3d'], viewer['2d'], runReport);
    });

  }


}

function onLoadModelError(viewerErrorCode) {}

function getForgeToken() {
  jQuery.ajax({
    url: '/user/token',
    success: function(res) {
      token = res;
    },
    async: false
  });
  return token;
}