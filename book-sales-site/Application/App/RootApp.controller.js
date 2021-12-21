sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/IconPool",
  "sap/m/Dialog",
  "sap/m/DialogType",
  "sap/m/Button",
  "sap/m/ButtonType",
  "sap/m/List",
  "sap/m/StandardListItem",
  "sap/m/Text"
], function (Controller, JSONModel, IconPool, Dialog, DialogType, Button, ButtonType, List, StandardListItem, Text) {
  "use strict";
  var base;
  return Controller.extend("com.UI5Starter.Application.App.RootApp", {
    onInit: function () {
      base = this;
      base.getView().setModel(oModel);
    },
   

  });
});
