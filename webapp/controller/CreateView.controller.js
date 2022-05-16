sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (UIComponent,History,Controller) {
        "use strict";

        return Controller.extend("yamahamusic.so.createso.project.controller.CreateView", {
            onInit: function () {
                // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
				// this.getView().setModel(oModel);
            },
            onNavBack:function(){
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
