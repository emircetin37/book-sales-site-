sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
], function (BaseController) {
    'use strict';
    return BaseController.extend("com.UI5Starter.Application.SiparişBaşarılı.controller.SiparişBaşarılı", {
        onInit: function () {
            
            
        },
        anasayfa(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Anasayfa");
        }
    })
});