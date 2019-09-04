$(document).ready(function () {
    adjustLayout();
    $(document).on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('orbit-gizmo')) {
            // to make sure we get the viewer, let's use the global var NOP_VIEWER
            if (NOP_VIEWER === null || NOP_VIEWER === undefined) return;
            NOP_VIEWER.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, loadPanels);
        }
    });
})

function adjustLayout() {
    // this function may vary for layout to layout...
    // for learn forge tutorials, let's get the ROW and adjust the size of the 
    // collumns so it can fit the new dashboard collumn
    var row = $(".row").children();
    $(row[0]).removeClass('col-sm-4').addClass('col-sm-2');
    $(row[1]).removeClass('col-sm-8').addClass('col-sm-5').after('<div class="col-sm-5" id="dashboard"></div>');
}

function loadPanels() {
    var dashboard = $('#dashboard');
    dashboard.empty();
    var panelNames = Object.keys(dashboardPanels);
    panelNames.forEach(function (id) {
        dashboard.append('<div id="' + id + '" class="dashboardPanel"></div>');
        dashboardPanels[id].load(id, viewer);
    });
}

// this holds the list of panels
var dashboardPanels = {};

// define the panels in order:
// dashboardPanels['panelDivID'] = new objetName();
//dashboardPanels['familyTypePieChart'] = new FamilyTypePieChart();

//Only one working at a time, they get stacked on the same location we need to move one below the other.
dashboardPanels['viewer2d'] = new Viewer2d();
dashboardPanels['familyTypeBarChart'] = new FamilyTypeBarChart();