sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./ServiceSearch", "./Log",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, ServiceSearch, Log, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.pocPatientServiceAndInvoice.controller.ServiceList", {
		handleRouteMatched: function(oEvent) {
			debugger;
			// var sAppId = "App6352534280e30701c54b4b6b";

			// var oParams = {};

			// if (sap.ui.Device.system.desktop) {

			// 	this._oRootView = this.getOwnerComponent().getAggregation("rootControl");
			// 	this._oRootView.getController().setMode(sap.m.SplitAppMode.StretchCompressMode);

			// } else {

			// 	this._oRootView = this.getOwnerComponent().getAggregation("rootControl");
			// 	this._oRootView.getController().setMode(sap.m.SplitAppMode.StretchCompressMode);

			// }
			// if (oEvent.mParameters.data.context) {
			// 	this.sContext = oEvent.mParameters.data.context;

			// } else {
			// 	if (this.getOwnerComponent().getComponentData()) {
			// 		var patternConvert = function(oParam) {
			// 			if (Object.keys(oParam).length !== 0) {
			// 				for (var prop in oParam) {
			// 					if (prop !== "sourcePrototype" && prop.includes("Set")) {
			// 						return prop + "(" + oParam[prop][0] + ")";
			// 					}
			// 				}
			// 			}
			// 		};

			// 		this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

			// 	}
			// }

			// if (!this.sContext) {
			// 	this.sContext = "CaseSet('3')";
			// }

			// var oPath;

			// if (this.sContext) {
			// 	oPath = {
			// 		path: "/" + this.sContext,
			// 		parameters: oParams
			// 	};
			// 	this.getView().bindObject(oPath);
			// }

			
			// var ordID = oEvent.getParameter("arguments").OrdNumber;
			// var sPath = '/' + ordID;
			// this.getView().bindElement(sPath, {
			// 	expand: 'To_Items'
			// });
		},
		getCaseItemData:function(oEvent){
			debugger;
			var url = "/sap/opu/odata/sap/ZGW_BILLING_APP_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(url, true);

			// var oDataModel = this.getView().getModel(); // Model used for triggering the Odata Request
			var ordData = '100000000060';

			var aFilters = new Array();
			var ordID = new sap.ui.model.Filter( { path: "CaseOrder", operator: sap.ui.model.FilterOperator.EQ, value1: ordData})
			aFilters.push(ordID);
			var efilter = "$filter=CaseOrder eq '" + ordData + "'";

			this.adminChg = this.getView().byId("idtab");
			this.roomChg  = this.getView().byId("idRoomChg");
			this.consumable  = this.getView().byId("idConsumable");
			this.medication  = this.getView().byId("idMedication");
			this.examination  = this.getView().byId("idExamination");

			this.listitem = this.getView().byId("listitem");
			if(this.listitem){
				this.oTemplate = this.listitem.clone();
			}
			
			this.fldVal = new sap.ui.model.json.JSONModel();
			this.roomChgData = new sap.ui.model.json.JSONModel();
			this.consumableData = new sap.ui.model.json.JSONModel();
			this.medicationData = new sap.ui.model.json.JSONModel();
			this.examinationData = new sap.ui.model.json.JSONModel();
			var that = this;

			oModel.read("GetCaseDataSet?$expand=To_ItemCond,To_Items",null, {filters: aFilters},null,
				function onSuccess(oData, oResponse){
					debugger;
					that.getOwnerComponent().setCompData(oData);
					that.fldVal.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADH' ));
					that.adminChg.setModel(that.fldVal);
					that.adminChg.bindAggregation("items", {
						path: "/",
						template: that.oTemplate
					});

					that.roomChgData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADH' ));
					that.roomChg.setModel(that.roomChgData);
					that.roomChg.bindAggregation("items", {
						path: "/",
						template: that.oTemplate
					});

					that.consumableData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADH' ));
					that.consumable.setModel(that.consumableData);
					that.consumable.bindAggregation("items", {
						path: "/",
						template: that.oTemplate
					});

					that.medicationData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADH' ));
					that.medication.setModel(that.medicationData);
					that.medication.bindAggregation("items", {
						path: "/",
						template: that.oTemplate
					});

					that.examinationData.setData(oData.results[0].To_Items.results.filter(item => item.MatlGroup === '' && item.ItemCateg === 'ZADI' ));
					that.examination.setModel(that.examinationData);
					that.examination.bindAggregation("items", {
						path: "/",
						template: that.oTemplate
					});
				},
				function _onError(oError){
					debugger;
				}	
			);
			// oDataModel.attachRequestSent(function() {
			// 				sap.ui.core.BusyIndicator.show(100);
			// 			});
			// oDataModel.attachRequestCompleted(function() {
			// 				sap.ui.core.BusyIndicator.hide();
			// 			});
			var ordID = oEvent.getParameter("arguments").OrdNumber;
			var sPath = '/' + ordID;
			// this.getView().bindElement(sPath, {
			// 	expand: 'To_Items'
			// });
			this.getView().bindElement('/');

			var oModel = this.getOwnerComponent().getModel();
			this.getView().setModel(oModel);
		},
		_onButtonPress: function(oEvent) {

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
		_onFileUploaderUploadComplete: function() {
			// Please implement

		},
		_onFileUploaderChange: function() {
			// Please implement

		},
		_onFileUploaderTypeMissmatch: function() {
			// Please implement

		},
		_onFileUploaderFileSizeExceed: function() {
			// Please implement

		},
		_onMenuItemPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("InvoicePayment", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation,oEvent) {
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
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
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

				var sPath = oEvent.getParameter("listItem").getBindingContextPath();
				var ItmNumber = oEvent.getSource().getModel().getProperty(sPath).ItmNumber
	
				this.oRouter.navTo("ConditionDetails",{
					ItmNumber : ItmNumber
				});				
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onMenuItemPress1: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("InvoicePayment", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPress1: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("InsuranceRelationship_1", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onToggleButtonPress: function(oEvent) {

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
		_onTableItemPress: function(oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function(fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress1: function(oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function(fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress2: function(oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function(fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress3: function(oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function(fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onTableItemPress4: function(oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function(fnResolve) {
				this.doNavigate("ServiceDetail", oBindingContext, fnResolve, "", oEvent);
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("ServiceList1").attachMatched(this.getCaseItemData, this);
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
		onExit: function() {

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
