sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./ServiceSearch",
	"./InvoiceList",
	"./Log",
	"./utilities",
	"sap/ui/core/routing/History",
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
	'sap/ui/core/Fragment',
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"com/sap/build/standard/pocPatientServiceAndInvoice/utils/format"
], function (BaseController,  MessageBox, ServiceSearch, InvoiceList, Log, Utilities, History, Export, ExportTypeCSV, Fragment, Dialog, Button, Text,format) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.pocPatientServiceAndInvoice.controller.ServiceList", {
		formatter: format,
		handleRouteMatched: function (oEvent) {
			
		},
		onDeleteRow: function (oEvent) {
			debugger;

			var oTable = this.getView().byId("idtab");
			var oSelectedItem = oEvent.getParameter("listItem");
			var that = this;
			this.openConfirmationDialog("Are you sure you want to delete this item?", function (result) {
				if (result === true) {
					oTable.removeItem(oSelectedItem);
					var array = that.getView().getModel("main").getData().To_Items.results;
					var value = oSelectedItem.getCells()[1].getText();
					const index = array.findIndex(element => element["ItmNumber"] === value);
					if (index !== -1) {
						//   array.splice(index, 1);
						that.getView().getModel("main").getData().To_Items.results[index].Mode = 'DEL';
					}
				} else {
					// User clicked "No", do nothing
				}
			});
			// this.getView().getModel("main").refresh();
		},
		openConfirmationDialog: function (message, callback) {
			var dialog = new Dialog({
				title: "Confirmation",
				type: "Message",
				content: new Text({
					text: message
				}),
				beginButton: new Button({
					text: "Yes",
					press: function () {
						dialog.close();
						callback(true);
					}
				}),
				endButton: new Button({
					text: "No",
					press: function () {
						dialog.close();
						callback(false);
					}
				})
			});

			dialog.open();
		},
		onDataExport: function (oEvent) {

			var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new ExportTypeCSV({
					separatorChar: ";"
				}),

				// Pass in the model created above
				models: this.getView().getModel("main"),

				// binding information for the rows aggregation
				rows: {
					path: "/To_Items"
				},

				// column definitions with column name and binding info for the content

				columns: [{
					name: "Document Number",
					template: {
						content: "{DocNumber}"
					}
				}, {
					name: "Item Number",
					template: {
						content: "{ItmNumber}"
					}
				}, {
					name: "Material ",
					template: {
						content: "{Material}"
					}
				}, {
					name: "Description",
					template: {
						content: "{ShortText}"
					}
				}, {
					name: "Price",
					template: {
						content: "{NetValue}"
					}
				}]
			});

			// download exported file
			oExport.saveFile().catch(function (oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function () {
				oExport.destroy();
			});
		},
		onNavBack: function () {
			this.getOwnerComponent().setCompData([]);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		getCaseItemData: function (oEvent) {
			debugger;
			var url = "/sap/opu/odata/sap/ZGW_BILLING_APP_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(url, true);

			// var oDataModel = this.getView().getModel(); // Model used for triggering the Odata Request
			const str = oEvent.getParameters().arguments.OrdNumber;
			const start = str.indexOf("'") + 1; // finds the index of the first single quote and adds 1 to skip it
			const end = str.lastIndexOf("'"); // finds the index of the last single quote
			const literal = str.substring(start, end); // extracts the substring between the single quotes
			const value = parseInt(literal);

			this.ordData = value;

			var aFilters = new Array();
			var ordID = new sap.ui.model.Filter({ path: "CaseOrder", operator: sap.ui.model.FilterOperator.EQ, value1: this.ordData })
			aFilters.push(ordID);
			var efilter = "$filter=CaseOrder eq '" + this.ordData + "'";

			var url = "GetCaseDataSet?$expand=To_ItemCond,To_Items,To_Movement,To_Message" + "&&" + efilter;

			var that = this;
			// if (this.getOwnerComponent().getCompData().results) {
			// 	this.fldVal.setData(this.getOwnerComponent().getCompData().oData.results[0].To_Items.results.filter(item => item.MatlGroup === 'OSS000000' && item.ItemCateg === 'ZADH'));
			// 	this.adminChg.setModel(that.fldVal);
			// 	this.adminChg.bindAggregation("items", {
			// 		path: "/",
			// 		template: that.oTemplate
			// 	});
			// } else {
			if (!this.getOwnerComponent().getCompData().results) {
				// if (this.getOwnerComponent().getCompData().results.length === 0) {
				this.oGloablDiaglogBox.open();
				oModel.read(url, null, { filters: aFilters }, null,
					function onSuccess(oData, oResponse) {
						debugger;
						that.oGloablDiaglogBox.close();
						that.getOwnerComponent().setCompData(oData);
						that.getView().getModel("main").setData(oData.results[0]);
						// that.fldVal.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === 'OSS000000' && item.ItemCateg === 'ZADH'));
						// that.adminChg.setModel(that.fldVal);
						// that.adminChg.bindAggregation("items", {
						// 	path: "/",
						// 	template: that.oTemplate
						// });

						// that.roomChgData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADH'));
						// that.roomChg.setModel(that.roomChgData);
						// that.roomChg.bindAggregation("items", {
						// 	path: "/",
						// 	template: that.oTemplate
						// });

						// that.consumableData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADH'));
						// that.consumable.setModel(that.consumableData);
						// that.consumable.bindAggregation("items", {
						// 	path: "/",
						// 	template: that.oTemplate
						// });

						// that.medicationData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADH'));
						// that.medication.setModel(that.medicationData);
						// that.medication.bindAggregation("items", {
						// 	path: "/",
						// 	template: that.oTemplate
						// });

						// that.examinationData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADI'));
						// that.examination.setModel(that.examinationData);
						// that.examination.bindAggregation("items", {
						// 	path: "/",
						// 	template: that.oTemplate
						// });
					},
					function _onError(oError) {
						that.oGloablDiaglogBox.close();
					}

				);
				// }
				// oDataModel.attachRequestSent(function() {
				// 				sap.ui.core.BusyIndicator.show(100);
				// 			});
				// oDataModel.attachRequestCompleted(function() {
				// 				sap.ui.core.BusyIndicator.hide();
				// 			});
				var ordID = oEvent.getParameter("arguments").OrdNumber;
				var sPath = '/' + ordID;
				this.getView().bindElement(sPath, {
					expand: 'To_Items'
				});
				// this.getView().bindElement(sPath);

				// var oModel = this.getOwnerComponent().getModel();
				// this.getView().setModel(oModel);
				// }
			}
		},
		oPopupMessage: null, oCondType: null,
		onSaveItems: function (oEvent) {
			debugger;
			var url = "/sap/opu/odata/sap/ZGW_BILLING_APP_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			// this.data = {
			// 	"CaseOrder" : "122222",
			// 	"To_Items" : [{
			// 		"ItmNumber"  : "00010",
			// 		"DocNumber"  : "",
			// 		"Material"   : "",
			// 		"MatEntrd"   : "",
			// 		"MatlGroup"  : "",
			// 		"ShortText"  : "",
			// 		"ItemCateg"  : "",

			// 	},
			// 	{
			// 		"ItmNumber"  : "00020",
			// 		"DocNumber"  : "",
			// 		"Material"   : "",
			// 		"MatEntrd"   : "",
			// 		"MatlGroup"  : "",
			// 		"ShortText"  : "",
			// 		"ItemCateg"  : "",

			// 	}
			// ],

			// }
			var cData = this.getOwnerComponent().getCompData().results[0];
			var that = this;
			this.oMessage = new sap.ui.model.json.JSONModel();
			this.oGloablDiaglogBox.open();
			this.popupView = null;
			oModel.create("/GetCaseDataSet", cData, {
				method: "POST",
				success: function (oResultData, oResponse) {
					that.oGloablDiaglogBox.close();
					if (!that.popupView) {
						that.popupView = sap.ui.xmlfragment("com.sap.build.standard.pocPatientServiceAndInvoice.view.Messages", that);
					}
					that.oMessage.setData(oResultData.To_Message);

					that.popupView.setModel(that.oMessage, "message");
					var dialog = new sap.m.Dialog({
						title: "Messages",
						contentWidth: "600px",
						contentHeight: "600px",
						content: that.popupView,
						beginButton: new sap.m.Button({
							text: "OK",
							press: function () {
								that.popupView.destroy();
								dialog.close();
							}
						})
					});

					dialog.open();


				},
				error: function (e) {

					sap.m.MessageToast.show("Error while creating ");
					that.oGloablDiaglogBox.close();

				}
			});





		},
		_onButtonPress: function (oEvent) {

			var sDialogName = "ServiceSearch";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new ServiceSearch(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onButtonInvoice: function (oEvent) {

			var sDialogName = "InvoiceList";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new InvoiceList(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onFileUploaderUploadComplete: function () {
			// Please implement

		},
		_onFileUploaderChange: function () {
			// Please implement

		},
		_onFileUploaderTypeMissmatch: function () {
			// Please implement

		},
		_onFileUploaderFileSizeExceed: function () {
			// Please implement

		},
		_onMenuItemPress: function (oEvent) {
			debugger;
			var cData = this.getOwnerComponent().getCompData();
			if (cData.results[0].To_Items.results[0].DocNumber) {
				this.data = { "Vbeln": cData.results[0].To_Items.results[0].DocNumber };

				var url = "/sap/opu/odata/sap/ZGW_BILLING_APP_SRV/";
				var oModel = new sap.ui.model.odata.ODataModel(url, true);

				oModel.create("/InvoiceSet", this.data, {
					method: "POST",
					success: function (oResultData, oResponse) {
						debugger;
						sap.m.MessageToast.show(oResultData.Ktext);


					},
					error: function (e) {
						debugger;
						sap.m.MessageToast.show("Error while creating Invoice");


					}
				});
			}


		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation, oEvent) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				// this.oRouter.navTo("ConditionDetails");

				// var sPath = oEvent.getParameter("listItem").getBindingContextPath();
				// if(sPath){
				// 	var ItmNumber = oEvent.getSource().getModel().getProperty(sPath).ItmNumber
				// }else{

				// }
				if (sRouteName === "InsuranceRelationship_1") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					var ItmNumber = oEvent.getParameter("listItem").getCells()[1].getText();
					this.oRouter.navTo("ConditionDetails", {
						ItmNumber: ItmNumber
					});
				}
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onMenuItemPress1: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function (fnResolve) {

				this.doNavigate("InvoicePayment", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPress1: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function (fnResolve) {

				this.doNavigate("InsuranceRelationship_1", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onToggleButtonPress: function (oEvent) {

			var sDialogName = "Log";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Log(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onTableItemPress: function (oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function (fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress1: function (oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function (fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress2: function (oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function (fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress3: function (oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function (fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress4: function (oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function (fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},

		onInit: function () {
			// debugger;
			history.pushState(null, null, location.href);
			var that = this;
			window.onpopstate = function () {
				if (location.pathname === '/index.html') {
					// that.getOwnerComponent().setCompData([]);
				}
			};
			this.adminChg = this.getView().byId("idtab");
			this.roomChg = this.getView().byId("idRoomChg");
			this.consumable = this.getView().byId("idConsumable");
			this.medication = this.getView().byId("idMedication");
			this.examination = this.getView().byId("idExamination");

			// this.listitem = this.getView().byId("listitem");
			// if (this.listitem) {
			// 	this.oTemplate = this.listitem.clone();
			// }
			this.oDataSer = new sap.ui.model.json.JSONModel();

			this.getView().setModel(this.oDataSer, "main");
			this.fldVal = new sap.ui.model.json.JSONModel();
			this.roomChgData = new sap.ui.model.json.JSONModel();
			this.consumableData = new sap.ui.model.json.JSONModel();
			this.medicationData = new sap.ui.model.json.JSONModel();
			this.examinationData = new sap.ui.model.json.JSONModel();

			this.ordData = "";
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("ServiceList1").attachMatched(this.getCaseItemData, this);
			// this.oRouter.getRoute("ServiceList2").attachMatched(this.getCaseItemData, this);
			this.oGloablDiaglogBox = new sap.m.BusyDialog();
			// this.oRouter.getTarget("ServiceList").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			// var oView = this.getView();
			// oView.addEventDelegate({
			// 	onBeforeShow: function() {
			// 		if (sap.ui.Device.system.phone) {
			// 			var oPage = oView.getContent()[0];
			// 			if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
			// 				oPage.setShowNavButton(true);
			// 				oPage.attachNavButtonPress(function() {
			// 					this.oRouter.navTo("CaseList", {}, true);
			// 				}.bind(this));
			// 			}
			// 		}
			// 	}.bind(this)
			// });

		},
		onExit: function () {
			this.getOwnerComponent().setCompData([]);
			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1-content-build_simple_Table-1672824753670",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1666936268157-content-build_simple_Table-1672800635917",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1666936288237-content-build_simple_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1666936323795-content-build_simple_Table-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_IconTabBar_Page_0-content-sap_m_IconTabBar-2-items-sap_m_IconTabFilter-1666936454140-content-build_simple_Table-1",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		}
	});
}, /* bExport= */ true);
