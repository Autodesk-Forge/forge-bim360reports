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
  $('#refreshAutodeskTree').hide();
  if (getForgeToken() != '') {
    prepareDataManagementTree();
    $('#refreshAutodeskTree').show();
    $('#refreshAutodeskTree').click(function(){
      $('#dataManagementHubs').jstree(true).refresh();
    });
  }

});

var haveBIM360Hub = false;

function prepareDataManagementTree() {
  $('#dataManagementHubs').jstree({
    'core': {
      'themes': {"icons": true},
      'data': {
        "url": '/dm/getTreeNode',
        "dataType": "json",
        'multiple': false,
        "data": function (node) {
          $('#dataManagementHubs').jstree(true).toggle_node(node);
          return {"id": node.id};
        },
        "cache" : false,
        "success": function (nodes) {
          nodes.forEach(function (n) {
            if (n.type === 'bim360hubs' && n.id.indexOf('b.') > 0)
              haveBIM360Hub = true;
          });
          if (!haveBIM360Hub) {
            $.getJSON("/api/forge/clientID", function (data) {
              $("#ClientID").val(data.ForgeClientId);
              $("#BIMconfig").show();
            });
          }
        }        
      }
    },
    'types': {
      'default': {
        'icon': 'glyphicon glyphicon-question-sign'
      },
      '#': {
        'icon': 'glyphicon glyphicon-user'
      },
      'hubs': {
        'icon': '/img/a360hub.png'
      },
      'personalHub': {
        'icon': '/img/a360hub.png'
      },
      'bim360Hubs': {
        'icon': '/img/bim360hub.png'
      },
      'bim360projects': {
        'icon': '/img/bim360project.png'
      },
      'a360projects': {
        'icon': '/img/a360project.png'
      },
      'items': {
        'icon': 'glyphicon glyphicon-file'
      },
      'folders': {
        'icon': 'glyphicon glyphicon-folder-open'
      },
      'versions': {
        'icon': 'glyphicon glyphicon-time'
      }
    },
    "plugins": 
      ["types", "state", "sort"]
  }).bind("activate_node.jstree", function (evt, data) {
    if (data != null && data.node != null && data.node.type == 'versions') {
      if (data.node.id === 'not_available') { alert('No viewable available for this version'); return; }
      var parent_node = $('#dataManagementHubs').jstree(true).get_node(data.node.parent);
      launchViewer(data.node.id, 'forgeViewer', 'viewerSecondary');
      $.notify("loading... " + parent_node.text, { className: "info", position:"bottom right" });
      $(".report-dropdowns").css('visibility', 'visible');
      $("#dropdown2dviews").css('visibility', 'visible');
    }
  });
}