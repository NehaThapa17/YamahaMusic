sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function ( Controller, History) {
        "use strict";

        return Controller.extend("yamahamusic.so.createso.project.controller.SalesOrdDetailView", {
            onInit: function () {
            
            },
            onPressCreateSO: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCreateView");
            }
            
        });
    });
