function FamilyTypePieChart(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}

FamilyTypePieChart.prototype.load = function () {
    
}

FamilyTypePieChart.prototype.supportedExtensions = function () {
    // return ['*']; // for all file formats
    return ['rvt'];
}