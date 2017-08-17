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


// This script file is based on the tutorial:
// https://developer.autodesk.com/en/docs/viewer/v2/tutorials/basic-application/

var viewer = {};
viewer['3d'] = null;
viewer['2d'] = null;

var document;

function launchViewer(urn, div3d, div2d) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };
  var documentId = 'urn:' + urn;
  Autodesk.Viewing.Initializer(options, function onInitialized() {
    Autodesk.Viewing.Document.load(documentId, function (doc) {
      //document = doc;

      showModel(doc, '3d', div3d);
      showModel(doc, '2d', div2d, function (viewables) {
        var options = $("#list2dviews");
        viewables.forEach(function (view) {
          options.append($("<option />").val(view.guid).text(view.name));
        });
        options.change(function () {
          // destroy and recreate the 2d view
          viewer['2d'].impl.unloadCurrentModel();
          viewer['2d'].tearDown();
          var viewerDiv = document.getElementById(div2d);
          viewer['2d'] = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
          var selected = this.value;
          viewables.forEach(function (view) {
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
    console.error('Document contains no viewables.');
    return;
  }

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

function onLoadModelSuccess(model) {}

function onLoadModelError(viewerErrorCode) {}

function getForgeToken() {
  jQuery.ajax({
    url: '/user/token',
    success: function (res) {
      token = res;
    },
    async: false
  });
  return token;
}