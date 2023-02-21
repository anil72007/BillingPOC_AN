sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./PaymentDistribution",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, PaymentDistribution, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.pocPatientServiceAndInvoice.controller.ServiceDetail", {
		handleRouteMatched: function(oEvent) {
			// var sAppId = "App6352534280e30701c54b4b6b";

			// var oParams = {};

			// this._oRootView = this.getOwnerComponent().getAggregation("rootControl");
			// this._oRootView.getController().setMode(sap.m.SplitAppMode.HideMode);

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
			// 	this.sContext = "Clinical_ServiceSet('S1')";
			// }

			// var oPath;

			// if (this.sContext) {
			// 	oPath = {
			// 		path: "/" + this.sContext,
			// 		parameters: oParams
			// 	};
			// 	this.getView().bindObject(oPath);
			// }

		},
		getConditionData: function(oEvent){
			debugger;
			var cData = this.getOwnerComponent().getCompData();
			var ItmNumber = oEvent.getParameters().arguments.ItmNumber;
			this.itemCondTab = this.getView().byId("idItemCond");
			this.listitem = this.getView().byId("idListItem");
			if(this.listitem){
				this.oTemplate = this.listitem.clone();
			}

			this.itemCond = new sap.ui.model.json.JSONModel();
			this.itemCond.setData(cData.results[0].To_ItemCond.results.filter(item => item.ItmNumber === ItmNumber ));
			this.itemCondTab.setModel(this.itemCond);
			this.itemCondTab.bindAggregation("items", {
				path: "/",
				template: this.oTemplate
			});
		},
		_onButtonPress: function() {
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
		getQueryParameters: function(oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		_onButtonPress1: function(oEvent) {

			var sDialogName = "PaymentDistribution";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new PaymentDistribution(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("ConditionDetails").attachMatched(this.getConditionData, this);
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getTarget("ServiceDetail").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			// var oView = this.getView();
			// oView.addEventDelegate({
			// 	onBeforeShow: function() {
			// 		if (sap.ui.Device.system.phone) {
			// 			var oPage = oView.getContent()[0];
			// 			if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
			// 				oPage.setShowNavButton(true);
			// 				oPage.attachNavButtonPress(function() {
			// 					this.oRouter.navTo("ServiceList", {}, true);
			// 				}.bind(this));
			// 			}
			// 		}
			// 	}.bind(this)
			// });

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-1-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_Table-1666932571303",
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
