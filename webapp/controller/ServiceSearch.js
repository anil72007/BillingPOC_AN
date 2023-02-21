sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.pocPatientServiceAndInvoice.controller.ServiceSearch", {
		constructor: function (oView) {

			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.pocPatientServiceAndInvoice.view.ServiceSearch", this);
			this._bInit = false;


		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			debugger;
			var oView = this._oView;
			var oControl = this._oControl;

			// var aData = 
			// [
			// 	{
			// 		"NodeID": 1,
			// 		"HierarchyLevel": 0,
			// 		"Description": "1",
			// 		"ParentNodeID": null,
			// 		"DrillState": "expanded"
			// 	},
			// 	{
			// 		"NodeID": 2,
			// 		"HierarchyLevel": 0,
			// 		"Description": "2",
			// 		"ParentNodeID": null,
			// 		"DrillState": "expanded"
			// 	},
			// 	{
			// 		"NodeID": 3,
			// 		"HierarchyLevel": 0,
			// 		"Description": "3",
			// 		"ParentNodeID": null,
			// 		"DrillState": "expanded"
			// 	},
			// 	{
			// 		"NodeID": 4,
			// 		"HierarchyLevel": 1,
			// 		"Description": "1.1",
			// 		"ParentNodeID": 1,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 5,
			// 		"HierarchyLevel": 1,
			// 		"Description": "1.2",
			// 		"ParentNodeID": 1,
			// 		"DrillState": "expanded"
			// 	},
			// 	{
			// 		"NodeID": 6,
			// 		"HierarchyLevel": 2,
			// 		"Description": "1.2.1",
			// 		"ParentNodeID": 5,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 7,
			// 		"HierarchyLevel": 2,
			// 		"Description": "1.2.2",
			// 		"ParentNodeID": 5,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 8,
			// 		"HierarchyLevel": 1,
			// 		"Description": "2.1",
			// 		"ParentNodeID": 2,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 9,
			// 		"HierarchyLevel": 1,
			// 		"Description": "2.2",
			// 		"ParentNodeID": 2,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 10,
			// 		"HierarchyLevel": 1,
			// 		"Description": "2.3",
			// 		"ParentNodeID": 2,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 11,
			// 		"HierarchyLevel": 1,
			// 		"Description": "3.1",
			// 		"ParentNodeID": 3,
			// 		"DrillState": "expanded"
			// 	},
			// 	{
			// 		"NodeID": 12,
			// 		"HierarchyLevel": 2,
			// 		"Description": "3.1.1",
			// 		"ParentNodeID": 11,
			// 		"DrillState": "expanded"
			// 	},
			// 	{
			// 		"NodeID": 13,
			// 		"HierarchyLevel": 3,
			// 		"Description": "3.1.1.1",
			// 		"ParentNodeID": 12,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 14,
			// 		"HierarchyLevel": 3,
			// 		"Description": "3.1.1.2",
			// 		"ParentNodeID": 12,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 15,
			// 		"HierarchyLevel": 3,
			// 		"Description": "3.1.1.3",
			// 		"ParentNodeID": 12,
			// 		"DrillState": "leaf"
			// 	},
			// 	{
			// 		"NodeID": 16,
			// 		"HierarchyLevel": 3,
			// 		"Description": "3.1.1.4",
			// 		"ParentNodeID": 12,
			// 		"DrillState": "leaf"
			// 	}
			// ];

			// var jModel = new sap.ui.model.json.JSONModel();
			// jModel.setData(aData);
			// // jModel.loadData("Nodes.json",false);
			// this.srvTab = this.getView().byId("treeTable1");

			// this.srvTab.setModel(jModel);

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},
		_onButtonPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function (fnResolve) {

				this.doNavigate("ServiceDetailSearchSearch", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			debugger;
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
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onButtonPress1: function () {

			this.close();

		},
		filterPrice: function (oEvent) {
			debugger;
			var oTreeTable = this.getView().byId("treeTable");

			var oBinding = oTreeTable.getBinding("rows");
			var oFilter = new sap.ui.model.Filter("Object", sap.ui.model.FilterOperator.EQ, "000000000000000016");

			// oTreeTable.bindRows({
			// 		path: "/GetServiceSet",
			// 		parameters : {
			// 			countMode: "Inline",
			// 			treeAnnotationProperties : {
			// 				hierarchyLevelFor : 'TreeLevel',
			// 				hierarchyNodeFor : 'Node',
			// 				hierarchyParentNodeFor : 'Parent',
			// 				hierarchyDrillStateFor : 'Drillstate'
			// 			}
			// 		}
			// 	});

			// oTreeTable.bindAggregation("rows", {
			// 	path: "/GetServiceSet",
			// 	filters: [
			// 		new sap.ui.model.Filter("Object", sap.ui.model.FilterOperator.EQ, "000000000000000016")
			// 	],
			// 	parameters: {
					
			// 		treeAnnotationProperties: {
			// 			hierarchyLevelFor: 'TreeLevel',
			// 			hierarchyNodeFor: 'Node',
			// 			hierarchyParentNodeFor: 'Parent',
			// 			hierarchyDrillStateFor: 'Drillstate'
			// 		}
			// 	}
			// });
			oBinding.filter([oFilter]);
		},
		onInit: function () {
			debugger;
			this._oDialog = this.getControl();


			// var url = "/sap/opu/odata/sap/ZGW_BILLING_APP_SRV/";
			// var oModel = new sap.ui.model.odata.ODataModel(url, true);
			// this.service = new sap.ui.model.json.JSONModel();
			// this.srvTab = this.getView().byId("treeTable");
	// 		rows="{ path:'/GetServiceSet' , parameters : 
	// 		{ treeAnnotationProperties : 
	// { hierarchyLevelFor : 'TreeLevel', hierarchyNodeFor : 'Node', hierarchyParentNodeFor : 'Parent', hierarchyDrillStateFor : 'Drillstate' } }}"
	// 		// this.srvTab.setModel(oModel);
			// var that = this;
			// oModel.read("/GetServiceSet",null, null,null,
			// 	function onSuccess(oData, oResponse){
			// 		debugger;
			// 		that.service.setData(oData.results);
			// 		that.srvTab.setModel(that.service);
			// 		that.srvTab.bindRows({
			// 			path: "/",
			// 			parameters : {
			// 				arrayNames: ['children']
			// 			}
			// 		});
			// 	},
			// 	function _onError(oError){
			// 		debugger;
			// 	}
			// );
		},
		onExit: function () {
			this._oDialog.destroy();

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_m_Dialog_0-content-sap_m_ScrollContainer-1670309517575-content-build_simple_Table-1670309559486",
				"groups": ["items"]
			}, {
				"controlId": "sap_m_Dialog_0-content-sap_m_VBox-1670308591528-items-build_simple_Table-1670309239976",
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
