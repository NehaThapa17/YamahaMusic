var oId;
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (UIComponent, History, Controller, JSONModel, Fragment,Filter,FilterOperator) {
        "use strict";

        return Controller.extend("yamahamusic.so.createso.project.controller.CreateView", {
            onInit: function () {
                // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                // this.getView().setModel(oModel);
                var oModel = new JSONModel();
                 
                var oItemData = {
                    "items": [],
                    "material": [
                        {
                            "mat": "AA768",
                            "description": "Material For Test1",
                            "value": "20"

                        },
                        {
                            "mat": "AA564",
                            "description": "Material for Test2",
                            "value": "60"

                        }
                    ]
                };
                // var oMatData = {};

                oModel.setData(oItemData);
                // oModel.push(oMatData);
                this.getView().setModel(oModel, "itemModel");
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
                    var deleteIndex = sIndex - i;
                    aItems.splice(deleteIndex, 1);
                }
                oTable.removeSelections();
                for (i = 0; i < aItems.length; i++) {
                    aItems[i].item = (i * 10) + 10;
                }
                oModelItem.refresh();
            },
            onClickCancel: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteTrackView");
            },
            onNavBack: function () {
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
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },
            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                    oId = oEvent.getSource().sId;
    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "yamahamusic.so.createso.project.fragments.MaterialF4",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function(oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("mat", FilterOperator.Contains, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },
            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("mat", FilterOperator.Contains, sValue);
    
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
    
            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
    
                if (!oSelectedItem) {
                    return;
                }
    
                // this.getView().byId(oId).setValue(oSelectedItem.getTitle());
            },
            onSelectionModeChange: function (oEvent) {
                var oTable = this.byId("table");
                var sKey = oEvent.getParameter("selectedItem").getKey();

                oTable.setSelectionMode(sKey);
            },
            onChangeCRDate: function (oEvt) {
                debugger;
                var oDP = oEvt.getSource(),
                    oSelDate = oDP.getDateValue(),
                    // sValue = oEvt.getParameter("value"),
                    sValue = new Date(oSelDate),
                    oDate,
                    oSelDay = new Date(sValue).getDay();
                Date.prototype.addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
                Date.prototype.subractDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() - days);
                    return date;
                }

                // var newDate = oSelDate.getDate() + oSelDay;
                switch (oSelDay) {
                    case 0: //Sunday
                        oDate = sValue.addDays(5);
                        break;
                    case 1: //Monday
                        oDate = sValue.addDays(4);
                        break;
                    case 2: //Tuesday
                        oDate = sValue.addDays(3);
                        break;
                    case 3: //Wednesday
                        oDate = sValue.addDays(2);
                        break;
                    case 4: //Thrusday
                        oDate = sValue.addDays(1);
                        break;
                    case 5: //Friday    
                        break;
                    case 6: //Saturday 
                        oDate = sValue.subractDays(1);
                        break;
                }
                oDP.setDateValue(oDate);

            },
            addDays: function (days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }
        });
    });
