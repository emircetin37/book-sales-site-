var userObj;
sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'sap/m/MessageToast', 'sap/ui/core/mvc/Controller'
], function (BaseController, MessageToast) {
    'use strict';
    return BaseController.extend("com.UI5Starter.Application.Register.controller.Register", {
        onInit: function () {
            userObj = {
                userName: "",
                mail: "",
                number: "",
                name: "",
                password: "",
                againPassword: ""
            }
            oModel.setProperty("/userInformation", userObj);

        },
        saveUser: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            db.transaction(function (tx) {
                var isHas = false;
                if (userObj.userName.length > 5 && userObj.name.length > 7 && userObj.mail.length > 8 && userObj.password.length > 6 && userObj.againPassword.length > 6 && userObj.password == userObj.againPassword) {
                    tx.executeSql("select  * from kullanicilar", [], function (tx, results) {
                        for (let i = 0; i < results.rows.length; i++) {
                            if (results.rows[i].kullaniciadi == userObj.userName) {
                                MessageToast.show("Böyle bir kullanıcı adına sahip biri zaten var.")
                                isHas = true;

                            }
                            else if (results.rows[i].eposta == userObj.mail) {
                                MessageToast.show("Bu E-mail adresine kayıtlı bir kullanıcı zaten var.")
                                isHas = true;
                            }
                            else if (results.rows[i].telefon == userObj.number) {
                                MessageToast.show("Bu telefon numarasına kayıtlı bir kullanıcı zaten var.")
                                isHas = true;
                            }


                        }
                        if (isHas == false) {
                            tx.executeSql("INSERT INTO KULLANICILAR (rolid,kullaniciadi,adsoyad,eposta,telefon,parola) VALUES(?,?,?,?,?,?)", [1, userObj.userName, userObj.name, userObj.mail, userObj.number, userObj.password])
                            MessageToast.show("Kaydınız başarıyla oluşturulmuştur. Detay Kitap İyi Alışverişler Diler :)")
                            oRouter.navTo("Login");
                        }



                    })
                }
                else {
                    MessageToast.show("Lütfen Kurallara Uygun Doldurunuz.")
                }
            })
        },
        anasayfa() {
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Anasayfa");
        }
    })

},
);
