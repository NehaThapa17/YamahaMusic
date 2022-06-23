var oId;
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../utils/formatter",
    "sap/m/SearchField"
],
    /** 
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (UIComponent, History, Controller, JSONModel, Fragment, Filter, FilterOperator, formatter) {
        "use strict";

        return Controller.extend("yamahamusic.so.createso.project.controller.CreateView", {
            formatter: formatter,
            
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
                            "sloc":"LOC1",
                            "value": "20",
                             "transit": true

                        },
                        {
                            "mat": "AA564",
                            "description": "Material for Test2",
                            "sloc":"LOC2",
                            "value": "60",
                            "transit": true

                        },
                        {
                            "mat": "AA908",
                            "description": "Material for Test3",
                            "sloc":"LOC3",
                            "value": "0",
                            "transit": true
                        },
                        {
                            "mat": "AA234",
                            "description": "Material for Test4",
                            "sloc":"LOC2",
                            "value": "0",
                            "transit": false
                        }
                    ],
                    "soldTP": [{
                        "buyerID": "TBS010002",
                        "buyerName": "The Brass Specialist",
                    },
                    {
                        "buyerID": "TBS010003",
                        "buyerName": "The Brass Buyer",
                    },
                    {
                        "buyerID": "TBS010004",
                        "buyerName": "Buyer C",
                    }]
                };
                // var oMatData = {};

                oModel.setData(oItemData);
                this.getView().setModel(oModel, "itemModel");
                this.addItem();

                //*******Calendar Default Date to 3days from current date *******//
                var dateCurr = new Date();
                dateCurr.setDate(dateCurr.getDate() + 3);
                // this.getView().byId("idDPHeader").setDateValue(dateCurr);
                //*******Dynamic ID for Calender input in Item Table *******//
                // var dynId = this.getView().getId() + "--idDPItem-" + this.getView().getId() + "--idTableItems-0";
                //*******Calendar Limit to 40days *******//
                var date = new Date();
                date.setDate(date.getDate() + 40);
                // this.getView().byId("idDPHeader").setMinDate(new Date());
                // this.getView().byId("idDPHeader").setMaxDate(new Date(date));
                // this.getView().byId(dynId).setMinDate(new Date());
                // this.getView().byId(dynId).setMaxDate(new Date(date));
                //*******Calendar Limit to 40days *******//


            },

            addItem: function () {
                var oModelItem = this.getView().getModel("itemModel");
                var aItems = oModelItem.getProperty("/items");
                var nIndex = aItems.length;
                var itemNo = (nIndex * 10) + 10;

                var oItem = {
                    "item": itemNo,
                    "material": "",
                    "description": "Material Description " + nIndex,
                    "quantity": "",
                    "uom": "EA",
                    "deliveryDate": null,
                    "netValue": "",
                    "status": "40"
                };
                aItems.push(oItem);
                oModelItem.refresh();
                //*******Dynamic ID for Calender in Item Table *******//
                // var dynIdI = this.getView().getId() + "--idDPItem-" + this.getView().getId() + "--idTableItems-" + nIndex;
                // this.getView().byId(dynIdI).setMinDate(new Date());
                //*******Calendar Limit to 40days *******//
                var date = new Date();
                date.setDate(date.getDate() + 40);
                //*******Calendar Limit to 40days *******//
                // this.getView().byId(dynIdI).setMaxDate(new Date(date));
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
            onShipToPartyLinkPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                if (!this._shipToPartyPopover) {
                    this._shipToPartyPopover = Fragment.load({
                        id: oView.getId(),
                        name: "yamahamusic.so.createso.project.fragments.ShipToPartyList",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._shipToPartyPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
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
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("mat", FilterOperator.Contains, sInputValue)]);
                    oDialog.getBinding("items").filter([new Filter("description", FilterOperator.Contains, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open();
                });
            },
            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                // var oFilter = new Filter("mat", FilterOperator.Contains, sValue);
                var oFilter = new Filter({
                    filters: [
                        new Filter("mat", FilterOperator.Contains, sValue),
                        new Filter("description", FilterOperator.Contains, sValue)
                    ],
                    and: false
                });

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                var aContexts = oEvent.getParameter("selectedContexts");
                var selMat = aContexts.map(function (oContext) { return oContext.getObject().mat; });
                var selMatDsc = aContexts.map(function (oContext) { return oContext.getObject().description; });
                if (!oSelectedItem) {
                    return;
                }
                var oIdDsc = this.getView().getId() + "--idMatDscTxt-" + this.getView().getId() + "--idTableItems-" + oId.charAt(oId.length - 1);
                this.getView().byId(oId).setValue(selMat[0]);
                this.getView().byId(oIdDsc).setText(selMatDsc[0]);
            },
            onSelectionModeChange: function (oEvent) {
                var oTable = this.byId("table");
                var sKey = oEvent.getParameter("selectedItem").getKey();

                oTable.setSelectionMode(sKey);
            },
            // onDefaultCBDate:function(oEvent){
            //     var vSel = oEvent.getParameters().selected;
            //     if (vSel === false){
            //         this.getView().byId("idDPHeader").setEnabled(true);
            //     }
            //     else {
            //         this.getView().byId("idDPHeader").setEnabled(false);
            //     }

            // }, 
            onBuyerPartyF4Help: function (oEvent) {
                this._oInputField = oEvent.getSource();
                var sFragmentName = "yamahamusic.so.createso.project.fragments.BuyerPartyList";
                var oModelData = this.getView().getModel("itemModel");
                var oModelColumns = new JSONModel();
                var oCol = {
                    cols: [{
                        "label": "Buyer ID",
                        "template": "buyerID"
                    },
                    {
                        "label": "Buyer Name",
                        "template": "buyerName"
                    }]
                };
                oModelColumns.setData(oCol);

                this.openCommonDialogVH(sFragmentName, oModelData, oModelColumns);

            },
            openCommonDialogVH: function (sFragmentName, oModelData, oModelColumns) {
                // @ts-ignore
                this._oBasicSearchField = new SearchField({
                    showSearchButton: false
                });

                var aCols = oModelColumns.getData().cols;

                Fragment.load({
                    name: sFragmentName,
                    controller: this
                }).then(function name(oFragment) {
                    this._oValueHelpDialog = oFragment;
                    this.getView().addDependent(this._oValueHelpDialog);

                    //set filter bar in dialog
                    var oFilterBar = this._oValueHelpDialog.getFilterBar();
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchField);

                    //set table in dialog
                    this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                        oTable.setModel(oModelData);
                        oTable.setModel(oModelColumns, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/soldTP");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/soldTP", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        var oSorter = new sap.ui.model.Sorter(
                            aCols[0].template
                        );
                        oTable.getBinding("rows").sort(oSorter);
                        this._oValueHelpDialog.update();
                    }.bind(this));

                    this._oValueHelpDialog.open();
                }.bind(this));
            },
            onValueHelpCloseSH: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");

                var aContexts = oEvent.getParameter("selectedContexts");

                if (!oSelectedItem) {
                    return;
                } else {
                    this.getView().byId("idBuyerIdInput").setValue(oSelectedItem.getTitle());
                    this.getView().byId("idBuyerIdInput").setDescription(oSelectedItem.getDescription());
                    this.getView().byId("idShipToInput").setEnabled(true);
                }
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
                oDP.setDateValue(oSelDate);

            },
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                var sValue = aTokens[0].getKey(),
                    sDesc = aTokens[0].getText().split("("),
                    sTxt = sDesc[0];

                // @ts-ignore
                this._oValueHelpDialog.close();

                // @ts-ignore
                if (this._oInputField) {
                    // @ts-ignore
                    this._oInputField.setValue(sValue);
                    this._oInputField.setDescription(sTxt);
                    this.getView().byId("idShipToInput").setEnabled(true);
                }
            },
            onValueHelpCancelPress: function () {
                // @ts-ignore
                this._oValueHelpDialog.close();
            },
            onValueHelpAfterClose: function () {
                // @ts-ignore
                this._oInputField = "";
                // @ts-ignore
                this._oValueHelpDialog.destroy();
            },

            commonFilterBarSearch: function (oEvent) {
                var aSelectionSet = oEvent.getParameter("selectionSet");
                // @ts-ignore
                var sSearchQuery = this._oBasicSearchField.getValue();
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new Filter({
                            path: oControl.getName(),
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }

                    return aResult;
                }, []);

                //set OR filters
                var aFilterCombo = [];
                for (var i = 0; i < aSelectionSet.length; i++) {
                    aFilterCombo.push(new Filter({ path: aSelectionSet[i].getName(), operator: FilterOperator.Contains, value1: sSearchQuery }))
                }
                aFilters.push(new Filter({
                    filters: aFilterCombo,
                    and: false
                }));

                //call all filters
                this._filterTable(new Filter({
                    filters: aFilters,
                    and: true
                }));
            },
            _filterTable: function (oFilter) {
                // @ts-ignore
                var oValueHelpDialog = this._oValueHelpDialog;

                oValueHelpDialog.getTableAsync().then(function (oTable) {
                    if (oTable.bindRows) {
                        oTable.getBinding("rows").filter(oFilter);
                    }

                    if (oTable.bindItems) {
                        oTable.getBinding("items").filter(oFilter);
                    }

                    oValueHelpDialog.update();
                });
            }

        });
    });
