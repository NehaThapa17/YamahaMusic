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
            },
            onNavBackDetail:function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oHistory, sPreviousHash;
    
                oHistory = History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    oRouter.navTo("RouteTrackView");
                }
            

            }
            
        });
    });
