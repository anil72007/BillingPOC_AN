sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
    'use strict';
    return BaseController.extend("com.sap.build.standard.pocPatientServiceAndInvoice.controller.OpenCases",{

		_smartFilterBar: null,
		_oModel: null,

        onInit: function(){
            // this._oModel = new ODataModel("LineItemsSet", true);
			this.oRouter = this.getOwnerComponent().getRouter();
			this.getView().setModel(this.getOwnerComponent().getModel());
			
			this._smartFilterBar = this.getView().byId("smartFilterBar");
        },

		toggleUpdateMode: function() {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}

			this._smartFilterBar.setLiveMode(!bLiveMode);
		},
		onItemPressSupp: function(oEvent){
			debugger;

			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			var myId = sPath.split("/")[sPath.split("/").length - 1];

			this.oRouter.navTo("ServiceList1",{
				OrdNumber : myId
			});
		},
		_setButtonText: function() {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}
		},

		onExit: function () {
			if (this._oModel) {
				this._oModel.destroy();
				this._oModel = null;
			}
		}        

    });
});