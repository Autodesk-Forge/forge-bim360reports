
    // some global vars  (TBD: consider consolidating into an object)
var _viewerMain = null;             // the viewer
var _viewerSecondary = null;        // the viewer
var _loadedDocument = null;
var _loadedSecondaryDocument = null;

var _views2D = null;
var _views3D = null;

var _blockEventMain = false;
var _blockEventSecondary = false;
var _blockPropagateSelection = false;

var _secondaryModelLeafNodes = null;

    // setup for PRODUCTION
var _viewerEnv = "AutodeskProduction";
var _myAuthToken = '';

function blankOutReportPane() {
    $("#pieChart").empty();
    $("#barChart").empty();
    $("#bar-chart").empty();
    $("#sheetThumbs").empty();

}

    // populate the popup menu with the avaialable views to load (from the array above)
function load2dViewMenuOptions() {
    var sel = $("#pu_viewToLoad");
    
    sel.find("option").remove().end();  // remove all existing options

    // add the 2D options
    $.each(_views2D, function(i, item) {
        sel.append($("<option>", { 
            value: i + 1000,    // make 2D views have a value greater than 1000 so we can tell from 3D
            text : item.name 
        }));
    });
}


    // user selected a new view to load
 $("#pu_viewToLoad").change(function(evt) {  
    evt.preventDefault();
     
    var index = parseInt($("#pu_viewToLoad option:selected").val(), 10);
     
    if (index >= 1000) {    // 2D views we gave a higher index to in the Popup menu
        index -= 1000;
        console.log("Changing to 2D view: " + _views2D[index].name);
        switchSheet();
        loadView(_loadedDocument, _viewerSecondary, _views2D[index]);
    }
    else {
        console.log("Changing to 3D view: " + _views3D[index].name);
        switchSheet();
        loadView(_loadedDocument, _viewerSecondary, _views3D[index]);
    }
});

function switchSheet() {
    
    if (_viewerSecondary !== null) {
        _viewerSecondary.tearDown();     // delete everything associated with the current loaded asset
    }

    _viewerSecondary.setUp();    // set it up again for a new asset to be loaded
}

function mainViewerSelectionChanged(event) {        
    if (_blockEventSecondary)
        return;
        
    // if a single item selected in 3D, select that same item in 2D.
    var curSelSetMain = _viewerMain.getSelection();
    //if (curSelSetMain.length === 1) {
    _blockEventMain = true;
    _viewerSecondary.select(curSelSetMain)//select objects in secondary view
    _blockEventMain = false;
    //}
}

function secondaryViewerSelectionChanged(event) {
    if (_blockEventMain)
        return;
                
    // if a single item, select and isolate same thing in 3D.
    var curSelSetSecondary = _viewerSecondary.getSelection();
    if (curSelSetSecondary.length === 1) {            
        _blockEventSecondary = true;
            
        //_viewerMain.clearSelection();   // reset to nothing selected (otherwise we end up in cases where it just adds to the existing selection)
            
        // normal behavior is to isolate and zoom into the selected object, but we can only do that in 3D.
        if (_viewerMain.model.is2d() == false) {
            _viewerMain.select(curSelSetSecondary);
            _viewerMain.isolate(curSelSetSecondary);
            _viewerMain.fitToView(curSelSetSecondary);
        }
        else {
            _viewerMain.select(curSelSetSecondary);   // Call work-around to select objects in secondary view (see file TestFuncs.js)
            _viewerMain.fitToView(curSelSetSecondary);
        }
            
        _blockEventSecondary = false;
    }
}

function selectMatching(viewer, prop_name, prop_value, leaf_nodes, callback) {
    console.log("Queueing selection of " + prop_name + " = " + prop_value);
    var selected = [];

    function isMatch(obj) {
        var isMatch = false;
        // and try to find prop_name
        obj.properties.forEach(function (item_prop) {
            // with a matching value
            if (item_prop.displayName.localeCompare(prop_name) == 0 &&
                item_prop.displayValue.localeCompare(prop_value) == 0) {
                isMatch = true;
            }
            // special line number matching check; selecting 3D object 
            else if (prop_name.localeCompare("LineNumberTag") == 0 &&
                     item_prop.displayName.localeCompare("Tag") == 0) {
                var tokens = item_prop.displayValue.split("-");
                // temp logic; should do something better
                if (tokens.length > 3) {
                    // check the last token to see if it matches
                    if (tokens[tokens.length - 1].localeCompare(prop_value) == 0) {
                        isMatch = true;
                    }
                }
            }
            // special line number matching check; selecting 2D SLINE
            else if (item_prop.displayName.localeCompare("LineNumberTag") == 0) {
                var tokens = prop_value.split("-");
                // temp logic; should do something better
                if (tokens.length > 3) {
                    // check the last token to see if it matches
                    if (tokens[tokens.length - 1].localeCompare(item_prop.displayValue) == 0) {
                        isMatch = true;
                    }
                }
            }
        });
        return isMatch;
    }

    viewer.model.getBulkProperties(leaf_nodes, ["Tag", "LineNumberTag"], function (objs) {
        objs.forEach(function (obj) {
            if (isMatch(obj)) {
                selected.push(obj.dbId);
            }
        });
        callback(selected);
    });
}

// get selected object properties and propagate selection
function propagateSelection(src_viewer, dst_viewer, props, leaf_nodes) {
    var select_promises = [];
    var selected = [];

    var selset = src_viewer.getSelection();

    function getSelectPromise(prop) {
        var deferred = $.Deferred();

        // so that matching items in destination view
        // can be found and selected
        selectMatching(dst_viewer, prop.displayName, prop.displayValue, leaf_nodes, function (curr_selected) {
            selected = selected.concat(curr_selected);
            deferred.resolve();
        });

        return deferred.promise();
    }

    src_viewer.model.getBulkProperties(selset, props, function (objs) {
        objs.forEach(function (obj) {
            obj.properties.forEach(function (item_prop) {
                select_promises.push(getSelectPromise(item_prop));
            });
        });

        // when all the selectMatching() promises are fulfilled, then select objects
        $.when.apply($, select_promises).then(function () {
            console.log("Selecting " + selected.length + " items in target view.");
            if (selected.length > 0) {
                // normal behavior is to isolate and zoom into the selected object, but we can only do that in 3D.
                dst_viewer.select(selected);
                if (dst_viewer.model.is2d() == false) {
                    dst_viewer.isolate(selected);
                }
                dst_viewer.fitToView(selected);
            }

            // unblock propagation now
            _blockPropagateSelection = false;
        });
    });
}


// STEPS:
//  0)  Initialize the Viewing Runtime
//  1)  Load a Document
//  2)  Get the available views (both 2D and 3D)
//  3)  Load a specific view
//      a)  initialize viewer for 2D or 3D
//      b)  load a "viewable" into the appropriate version of the viewer
//  4)  Attach a "listener" so we can keep track of events like Selection


    // initialize the viewer into the HTML placeholder
function initializeViewerMain(sel_changed_callback) {
    
        // if we already have something loaded, uninitialize and re-init (can't just load a new file!:  ?? is that a bug?)
    if (_viewerMain !== null) {
        _viewerMain.uninitialize();
        _viewerMain = null;
    }

    var viewerElement = document.getElementById("viewerMain");  // placeholder in HTML to stick the viewer
    _viewerMain = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
   
    var retCode = _viewerMain.initialize();
    if (retCode !== 0) {
        alert("ERROR: Couldn't initialize main viewer!");
        console.log("ERROR Code: " + retCode);      // TBD: do real error handling here
    }
    
    

    // JAIME - I have commented out this part since I still dont have the Pie Chart implemented.

    // when the geometry is loaded, automatically run the first report

    // disableReportMenu();
    // _viewerMain.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {

    //     enableReportMenu();
    //     //runReport(-1);   // run the currently selected report (the first one if this is the first model loaded, current one if loading a subsequent model)
        
    //     $("#tab_button_1").click();
    //     startReportDataLoader(runReport);
    // });
    
    



    // when selecting in the Primary viewer, select the matching items in the Secondary viewer
    _viewerMain.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, sel_changed_callback);
}

function initializeViewerSecondary(sel_changed_callback, geom_loaded_callback) {
    
        // if we already have something loaded, uninitialize and re-init (can't just load a new file!:  ?? is that a bug?)
    if (_viewerSecondary !== null) {
        _viewerSecondary.uninitialize();
        _viewerSecondary = null;
    }

    var viewerElement = document.getElementById("viewerSecondary");  // placeholder in HTML to stick the viewer
    _viewerSecondary = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
   
    var retCode = _viewerSecondary.initialize();
    if (retCode !== 0) {
        alert("ERROR: Couldn't initialize secondary viewer!");
        console.log("ERROR Code: " + retCode);      // TBD: do real error handling here
    }
    
        // when we change sheets, we want to re-select things after this sheet is loaded
    _viewerSecondary.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geom_loaded_callback);

    // when selecting objects in the Secondary viewer, also select the matching itmes in the Primary viewer
    _viewerSecondary.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, sel_changed_callback);
}

function secondaryViewerGeometryLoaded(event) {
    _blockEventMain = true; // prevent normal event of select/isolate/fit in main viewer
    if (_viewerMain.model)
        _viewerSecondary.select(_viewerMain.getSelection());
    _blockEventMain = false;
}

    // load a specific document into the intialized viewer
function loadDocument(urnStr) {

    _loadedDocument = null; // reset to null if reloading
    _loadedSecondaryDocument = null;

    var fullUrnStr = !urnStr.startsWith('urn:') ? 'urn:' + urnStr : urnStr
        //var fullUrnStr = "urn:" + urnStr;

    // JAIME This is where I'm having problems at the time of loading.
    // I dont know if it is related to 403 error we are getting.

    Autodesk.Viewing.Document.load(fullUrnStr, function(document) {
        _loadedDocument = document; // keep this in a global var so we can reference it in other spots

        // get all the 3D and 2D views (but keep in separate arrays so we can differentiate in the UX)
        _views3D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {
            'type': 'geometry',
            'role': '3d'
        }, true);
        _views2D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {
            'type': 'geometry',
            'role': '2d'
        }, true);

        //load2dViewMenuOptions(); // populate UX with 2d views we just retrieved
        initializeViewerMain(mainViewerSelectionChanged);
        initializeViewerSecondary(secondaryViewerSelectionChanged, secondaryViewerGeometryLoaded);

        // load up first 3D view by default into the primary viewer
        if (_views3D.length > 0) {
            loadView(_loadedDocument, _viewerMain, _views3D[0]);
        } else { // there weren't any 3D views!
            if (_views2D.length > 0) {
                loadView(_loadedDocument, _viewerMain, _views2D[0]);
                $('#pu_viewToLoad').val('1000'); // selects first option in 2D list
            } else {
                alert("ERROR: No 3D or 2D views found in this drawing!");
            }
        }
        // now load the Secondary viewer with the first 2D view by default
        if (_views2D.length > 0) {
            loadView(_loadedDocument, _viewerSecondary, _views2D[0]);
            $('#pu_viewToLoad').val('1000'); // selects first option in 2D list
        } else {
            console.log("WARNING: No 2D views found for secondary view, using additional 3D view");
            if (_views3D.length > 0)
                loadView(_loadedDocument, _viewerSecondary, _views3D[0]);
        }


    }, function(errorCode, errorMsg) {
        alert('Load Error: ' + errorCode + " " + errorMsg);
    });
}


function getForgeToken() {
  jQuery.ajax({
    url: '/user/token',
    success: function (res) {
      _myAuthToken = res;
    },
    async: false
  });
  return _myAuthToken;
}


    // for now, just simple diagnostic functions to make sure we know what is happing
function loadViewSuccessFunc()
{
    console.log("Loaded viewer successfully with given asset...");
}

function loadViewErrorFunc()
{
    console.log("ERROR: could not load asset into viewer...");
}

    // load a particular viewable into the viewer (either Primary or Secondary depending on what's passed in)
// JAIME - This needs to be updated to use loadModel, it is quite old and most likely fail when it gets called.
function loadView(document, viewer, viewObj) {
    var path = document.getViewablePath(viewObj);
    console.log("Loading view URN: " + path);
    
    viewer.load(path, document.getPropertyDbPath(), loadViewSuccessFunc, loadViewErrorFunc);
}