var userLogin;
var isHasName = false;
var isHasPassword = false;
var activeUser;
var isOK = false;

sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'sap/m/MessageToast',
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"


], function (BaseController, MessageToast, Controller) {
    'use strict';
    return BaseController.extend("com.UI5Starter.Application.Login.controller.Login", {
        onInit: function () {
            userLogin = {
                name: "",
                password: ""
            }


            oModel.setProperty("/userLogin", userLogin);

        },
        login() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM KULLANICILAR", [], function (tx, results) {

                    for (let i = 0; i < results.rows.length; i++) {
                        isHasName = false;
                        isHasPassword = false;
                        if (results.rows[i].kullaniciadi == oModel.getProperty("/userLogin/name")) {
                            isHasName = true;

                        }
                        else if (results.rows[i].eposta == oModel.getProperty("/userLogin/name")) {
                            isHasName = true;
                        }
                        else if (results.rows[i].telefon == oModel.getProperty("/userLogin/name")) {
                            isHasName = true;
                        }
                        if (results.rows[i].parola == oModel.getProperty("/userLogin/password")) {
                            isHasPassword = true;
                            

                        }

                        if (isHasName == true && isHasPassword == true){
                            activeUser = results.rows[i];
                            isOK = true
                        }
                        
                        

                    }
                    if (isOK) {

                        isHasName = false;
                        isHasPassword = false;
                        oModel.setProperty("/activeUser", activeUser)
                        console.log(oModel.getProperty("/activeUser"))

                        db.transaction(function (tx) {
                            tx.executeSql("delete from activeuser");
                            tx.executeSql("INSERT INTO ACTIVEUSER (adsoyad,eposta,kullanicID,kullaniciadi,rolid,telefon) VALUES(?,?,?,?,?,?)", [oModel.getProperty("/activeUser").adsoyad, oModel.getProperty("/activeUser").eposta, oModel.getProperty("/activeUser").kullaniciID, oModel.getProperty("/activeUser").kullaniciadi, oModel.getProperty("/activeUser").rolid, oModel.getProperty("/activeUser").telefon])
                            tx.executeSql("SELECT * FROM ACTIVEUSER,ROLLER WHERE ACTIVEUSER.rolid = ROLLER.rolid", [], function (tx, results) {
                                console.log(results)
                                if (results.rows.length != 0) {

                                    oRouter.navTo("Anasayfa");
                                    window.location.reload(false)

                                }

                            })

                        })

                    }
                    else {
                        MessageToast.show("Hatalı Giriş Yaptınız Lütfen Tekrar Deneyiniz.")
                    }

                })
            })
        },
        anasayfa() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Anasayfa");
        }
    })
});