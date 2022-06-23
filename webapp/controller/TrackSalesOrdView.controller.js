sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/SearchField"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function ( Controller, History,JSONModel, Fragment, Filter, FilterOperator,SearchField) {
        "use strict";

        return Controller.extend("yamahamusic.so.createso.project.controller.TrackSalesOrdView", {
            onInit: function () {
                var oModel = new JSONModel();

                var oItemData = {
                    "items": [],
                    "docData": [
                        {
                            "docNo": "1200234",
                            "dsc": "TEST1"
                           
                        },
                        {
                            "docNo": "1200235",
                            "dsc": "TEST2"
                            
                        },
                        {
                            "docNo": "1200236",
                            "dsc": "TEST3"
                            

                        }
                    ]
                };

                oModel.setData(oItemData);
                this.getView().setModel(oModel, "bpModel");
            },
            onSuggest: function (oEvent) {
                var sTerm = oEvent.getParameter("suggestValue");
                var aFiltersCombo = [];
                var aFilters = [];
                if (sTerm) {
                    aFiltersCombo.push(new Filter("docNo", FilterOperator.Contains, sTerm));
                    // aFiltersCombo.push(new Filter("BusinessPartnerName", FilterOperator.Contains, sTerm));
                }
                aFilters.push(new Filter({
                    filters: aFiltersCombo,
                    and: false
                }));

                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },
            onDocNumVH:function (oEvent) {
                this._oInputField = oEvent.getSource();
                var sFragmentName = "yamahamusic.so.createso.project.fragments.DocNoVh";
                var oModelData =  this.getView().getModel("bpModel");
                var oModelColumns = new JSONModel();
                var oCol = {
                    cols: [{
                        "label": "Document No",
                        "template": "docNo"
                    },
                    {
                        "label": "Description",
                        "template": "dsc"
                    }]
                };
                oModelColumns.setData(oCol);

                this.openCommonDialogVH(sFragmentName, oModelData, oModelColumns );

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
                            oTable.bindAggregation("rows", "/docData");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/docData", function () {
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
            onPressCreateSO: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCreateView");
            },
            onTitleClicked: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("SalesOrdDetailView");
            },
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                var sValue = aTokens[0].getKey();
                // @ts-ignore
                this._oValueHelpDialog.close();

                // @ts-ignore
                if (this._oInputField) {
                    // @ts-ignore
                    this._oInputField.setValue(sValue);
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
