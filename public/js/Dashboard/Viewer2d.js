function Viewer2d(div, viewer) {
    this._div = div;
    this._viewer = viewer;
}

Viewer2d.prototype.load = function () {
    this.enumerate2dViews();
}

Viewer2d.prototype.enumerate2dViews = function () {
    function traverse(bubbles) {
        bubbles.forEach(function (bubble) {
            if (bubble.isGeometry() && bubble.is2D())
                console.log(bubble.data.name); // add this to a <select>

            // ToDo: need a better way to check this...
            if (bubble.children) traverse(bubble.children);
        })
    }
    traverse(viewer.model.getDocumentNode().getRootNode().findAllViewables());
}

Viewer2d.prototype.supportedExtensions = function () {
    return ['*'];
}
