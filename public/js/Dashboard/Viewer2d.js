function Viewer2d(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}

Viewer2d.prototype.load = function () {
    this.enumerate2dViews();
}

Viewer2d.prototype.enumerate2dViews = function () {
    function traverse(bubles) {
        bubles.forEach(function (buble) {
            if (buble.isGeometry() && buble.is2D())
                console.log(buble.data.name); // add this to a <select>

            // ToDo: need a better way to check this...
            if (buble.children) traverse(buble.children);
        })
    }
    traverse(viewer.model.getDocumentNode().getRootNode().findAllViewables());
}

Viewer2d.prototype.supportedExtensions = function () {
    return ['*'];
}
