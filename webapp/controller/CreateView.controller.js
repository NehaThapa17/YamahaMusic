sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (UIComponent,History,Controller,JSONModel,Fragment) {
        "use strict";

        return Controller.extend("yamahamusic.so.createso.project.controller.CreateView", {
            onInit: function () {
                // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
				// this.getView().setModel(oModel);
                var oModel = new JSONModel();
                var oItemData = {"items":[]};
                oModel.setData(oItemData);
            
                this.getView().setModel(oModel,"itemModel");
                this.addItem();
            },

            addItem: function () {
                var oModelItem = this.getView().getModel("itemModel");
                var aItems = oModelItem.getProperty("/items");
                var nIndex = aItems.length;
                var itemNo = (nIndex * 10) + 10; 
                
                var oItem = {
                    "item": itemNo,
                    "material": "",
                    "description": "Material " + nIndex,
                    "quantity": "",
                    "uom": "EA",
                    "deliveryDate": null,
                    "netValue": "",
                    "status": "40"
                };
                aItems.push(oItem);
                oModelItem.refresh();
            },

            deleteItem: function () {
                var oTable = this.getView().byId("idTableItems");
                var aTableItems = oTable.getSelectedItems();
                var oModelItem = this.getView().getModel("itemModel");
                var aItems = oModelItem.getProperty("/items");
                for (var i = 0; i < aTableItems.length; i++) {
                    var sPath = aTableItems[i].getBindingContext("itemModel").getPath();
                    var sIndex = sPath.split("/")[2];
                    var deleteIndex = sIndex-i;
                    aItems.splice(deleteIndex,1);
                }
                oTable.removeSelections();
                for (i=0; i < aItems.length; i++) {
                    aItems[i].item = (i * 10) + 10;
                }
                oModelItem.refresh();
            },
            onShipToPartyLinkPress: function (oEvent) {
                var oButton = oEvent.getSource(),
				oView = this.getView();

                if (!this._shipToPartyPopover) {
                    this._shipToPartyPopover = Fragment.load({
                        id: oView.getId(),
                        name: "yamahamusic.so.createso.project.fragments.ShipToPartyList",
                        controller: this
                    }).then(function(oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._shipToPartyPopover.then(function(oPopover) {
                    oPopover.openBy(oButton);
			    });
            },
            onClickCancel: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteTrackView");
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
            

            },
            handleCloseButton: function (oEvent) {
                // note: We don't need to chain to the _pPopover promise, since this event-handler
                // is only called from within the loaded dialog itself.
                this.byId("myPopover").close();
            },
            handleResponsivePopoverPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
    
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "yamahamusic.so.createso.project.fragments.CheckAvailF4",
                        controller: this
                    }).then(function(oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._pPopover.then(function(oPopover) {
                    oPopover.openBy(oButton);
                });
            },
            onSelectionModeChange: function(oEvent) {
                var oTable = this.byId("table");
                var sKey = oEvent.getParameter("selectedItem").getKey();
    
                oTable.setSelectionMode(sKey);
            },
            onChangeCRDate:function(oEvt){
                debugger;
               var oDP = oEvt.getSource(),
				sValue = oEvt.getParameter("value");

            }
        });
    });
