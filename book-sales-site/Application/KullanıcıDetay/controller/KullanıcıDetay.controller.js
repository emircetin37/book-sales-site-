var userObj = [];
sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
], function (BaseController) {
    'use strict';
    return BaseController.extend("com.UI5Starter.Application.KullanıcıDetay.controller.KullanıcıDetay", {
        onInit: function () {
            this.byId("admin").setVisible(false)
            var that = this;
            db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM ACTIVEUSER,ROLLER WHERE ACTIVEUSER.rolid = ROLLER.rolid", [], function (tx, results) {
                    if (results.rows.length != 0) {
                        for(let i = 0;i<results.rows.length;i++){
                           
                            userObj.push(results.rows[0])
                            if(results.rows[0].rolid == 2){
                                that.byId("admin").setVisible(true)
                            }
                        }
                        
                       
                        
                        oModel.setProperty("/activeUser",userObj)
                        console.log(oModel.getProperty("/activeUser"))
                    }

                })
            })



            
        },
        anasayfa(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Anasayfa");
        },
        goToAdmin(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Admin");
        }
    })
});