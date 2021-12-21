var myList = []
var control = true;
var isHas = true;
sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/IconPool",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/m/HBox"
], function (BaseController, Controller, JSONModel, IconPool, Dialog, DialogType, Button, ButtonType, List, StandardListItem, Text, MessageToast, HBox) {
    'use strict';
    return BaseController.extend("com.UI5Starter.Application.Anasayfa.controller.Anasayfa", {
        onBeforeRendering() {

            var loginButton = this.byId("login")
            var registerButton = this.byId("register")
            var logOutButton = this.byId("logOut")
            var userButton = this.byId("user")
            db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM ACTIVEUSER,KULLANICILAR WHERE ACTIVEUSER.kullanicID = KULLANICILAR.kullaniciID", [], function (tx, results) {
                    if (results.rows.length > 0) {
                        loginButton.setVisible(false);
                        registerButton.setVisible(false);
                        logOutButton.setVisible(true)
                        userButton.setVisible(true)
                        userButton.setText(results.rows[0].kullaniciadi)

                    }
                    else {
                        loginButton.setVisible(true);
                        registerButton.setVisible(true);
                        logOutButton.setVisible(false)
                        userButton.setVisible(false)
                    }
                })
            })





            db.transaction(function (tx) {
                var myList = []
                tx.executeSql("SELECT * FROM KITAPLAR,YAZARLAR WHERE KITAPLAR.yazarid = YAZARLAR.yazarid", [], function (tx, results) {
                    if (results.rows.length > 0) {
                        // if (results.rows[0].stok > 0) {
                        //     myList.push(results.rows[0])
                        // }
                        for (let element in results.rows) {
                            if (results.rows[element].stok != "0") {
                                myList.push(results.rows[element])
                            }
                        }
                        oModel.setProperty("/bookList", myList)
                        oModel.getProperty("/bookList").pop()
                        oModel.getProperty("/bookList").pop()
                        oModel.setProperty("/bookList", oModel.getProperty("/bookList"))
                    }
                    else {
                        oModel.setProperty("/bookList", "");
                    }
                })
            })

        },
        onAfterRendering() {
            var oButton = new Button({
                text: "Click"
            })
            console.log(oButton)
        },
        onInit: function () {

            db.transaction(function (tx) {
                var myList = []
                var userObj = {}
                tx.executeSql("SELECT * FROM KATEGORILER", [], function (tx, results) {
                    for (let element in results.rows) {
                        myList.push(results.rows[element])
                    }
                    oModel.setProperty("/categoryList", myList)
                    oModel.getProperty("/categoryList").pop()
                    oModel.getProperty("/categoryList").pop()
                    oModel.setProperty("/categoryList", oModel.getProperty("/categoryList"))
                })
                tx.executeSql("delete from sepet")
            })


        },
        changeCategory() {

            var list = this.byId("listCategory");
            var selected = list.getSelectedItem();
            var kategoriID = selected.getBindingContext().getPath().substr(14)

            db.transaction(function (tx) {
                var myList = []
                tx.executeSql("SELECT * FROM KITAPLAR,YAZARLAR WHERE KITAPLAR.yazarid = YAZARLAR.yazarid and KITAPLAR.kategoriID =?", [(Number(kategoriID) + 1).toString()], function (tx, results) {
                    if (results.rows.length > 0) {
                        // if (results.rows[0].stok > 0) {
                        //     myList.push(results.rows[0])
                        // }
                        for (let element in results.rows) {
                            if (results.rows[element].stok != "0") {
                                myList.push(results.rows[element])
                            }
                        }
                        oModel.setProperty("/bookList", myList)
                        oModel.getProperty("/bookList").pop()
                        oModel.getProperty("/bookList").pop()
                        oModel.setProperty("/bookList", oModel.getProperty("/bookList"))
                    }
                    else {
                        oModel.setProperty("/bookList", "");
                    }
                })
            })

        },
        sepeteEkle(oEvent) {

            var path = (oEvent.getSource().getBindingContext().getPath())

            db.transaction(function (tx) {
                var toplam = 0;
                var kid;
                var userid;

                tx.executeSql("SELECT * FROM YAZARLAR,KITAPLAR WHERE YAZARLAR.yazarid = KITAPLAR.yazarid AND KITAPLAR.kitapid=?", [oModel.getProperty(path).kitapid], function (tx, results) {
                    kid = results.rows[0].kitapid
                    var kitapstok = results.rows[0].stok;

                    tx.executeSql("SELECT * FROM SEPET", [], function (tx, results) {
                        if (results.rows.length == 0) {


                            tx.executeSql("INSERT INTO SEPET (kitapid,kullaniciID) VALUES(?,?)", [kid, userid])
                            tx.executeSql("delete from sepet where sepetid=?", [1])

                        }
                        else {
                            for (let i = 0; i < results.rows.length; i++) {
                                if (kid == results.rows[i].kitapid) {
                                    control = false;

                                }
                            }
                        }


                        if (control == true) {
                            tx.executeSql("SELECT * FROM ACTIVEUSER", [], function (tx, results) {
                                
                                if (results.rows.length == 1) {
                                    userid = results.rows[0].kullanicID

                                    tx.executeSql("INSERT INTO SEPET (kitapid,sepetfiyat,sepetkitapadet,kullaniciID) VALUES(?,?,?,?)", [oModel.getProperty(path).kitapid, oModel.getProperty(path).kitapfiyat, 1, userid])
                                    
                                    var myList2 = []

                                    tx.executeSql("SELECT*FROM SEPET,YAZARLAR,KITAPLAR WHERE sepet.kitapid = kitaplar.kitapid and yazarlar.yazarid = kitaplar.yazarid", [], function (tx, results) {
                                        for (let i = 0; i < results.rows.length; i++) {
                                            myList2.push(results.rows[i])
                                            toplam = toplam + results.rows[i].sepetfiyat
                                        }
                                        oModel.setProperty("/sepet", myList2)
                                        console.log(toplam)
                                        oModel.setProperty("/toplam", toplam)
                                    })


                                }
                                else{
                                    MessageToast.show("Lütfen giriş yapınız.")
                                }

                            })

                        }
                        else if (control == false) {
                            control = true;
                            var kitapadet = 0;

                            console.log(oModel.getProperty(path).kitapfiyat)
                            tx.executeSql("select * from sepet,kitaplar where sepet.kitapid = kitaplar.kitapid and kitaplar.kitapid =?", [oModel.getProperty(path).kitapid], function (tx, results) {
                                kitapadet = results.rows[0].sepetkitapadet;
                                if (kitapstok > kitapadet) {

                                    MessageToast.show("Sepetinize Kitap Eklendi.")
                                    tx.executeSql("UPDATE SEPET SET sepetkitapadet=? where sepetid=?", [++kitapadet, results.rows[0].sepetid])
                                    tx.executeSql("UPDATE SEPET SET sepetfiyat=? where sepetid=?", [kitapadet * results.rows[0].kitapfiyat, results.rows[0].sepetid])

                                    var myList2 = []

                                    tx.executeSql("SELECT*FROM SEPET,YAZARLAR,KITAPLAR WHERE sepet.kitapid = kitaplar.kitapid and yazarlar.yazarid = kitaplar.yazarid", [], function (tx, results) {
                                        for (let i = 0; i < results.rows.length; i++) {
                                            myList2.push(results.rows[i])
                                            toplam = toplam + results.rows[i].sepetfiyat
                                        }
                                        oModel.setProperty("/sepet", myList2)
                                        console.log(toplam)
                                        oModel.setProperty("/toplam", toplam)
                                    })
                                }
                                else {
                                    MessageToast.show("Yetersiz Stok.")
                                }
                            })


                        }


                    })
                })
            })

        },
        onDefaultDialogPress: function () {

            if (!this.oDefaultDialog) {

                this.oDefaultDialog = new Dialog({

                    title: "Sepet | Toplam : {/toplam} TL",

                    content: [new List({
                        id: "sepetID",
                        mode: "SingleSelectMaster",
                        items: {

                            path: "/sepet",

                            template: new StandardListItem({
                                title: "Ürün Adı : {kitapad}",
                                icon: "{photo}",
                                description: "Yazar : {yazarad} | Fiyat : {sepetfiyat} TL | Adet : {sepetkitapadet}",


                            }),
                        },

                    }),

                    ],
                    buttons: [

                        new Button({
                            text: "+",
                            press: function () {

                                var list = sap.ui.getCore().byId("sepetID")
                                var selected = list.getSelectedItem();
                                if (selected != null) {
                                    var kitapad = selected.mProperties.title.substr(11)
                                }

                                if (selected != null) {


                                    db.transaction(function (tx) {
                                        var toplam = 0;
                                        tx.executeSql("SELECT * FROM KITAPLAR WHERE kitapad=?", [kitapad], function (tx, results) {
                                            var kitapstok = results.rows[0].stok;
                                            var kitapfiyat = results.rows[0].kitapfiyat

                                            tx.executeSql("SELECT * FROM SEPET WHERE kitapid =?", [results.rows[0].kitapid], function (tx, results) {
                                                var sepetstok = results.rows[0].sepetkitapadet;
                                                if (kitapstok > sepetstok) {
                                                    tx.executeSql("UPDATE SEPET SET sepetkitapadet=?,sepetfiyat=? where kitapid =?", [++results.rows[0].sepetkitapadet, ++results.rows[0].sepetkitapadet * kitapfiyat, results.rows[0].kitapid])
                                                    var myList2 = []

                                                    tx.executeSql("SELECT*FROM SEPET,YAZARLAR,KITAPLAR WHERE sepet.kitapid = kitaplar.kitapid and yazarlar.yazarid = kitaplar.yazarid", [], function (tx, results) {
                                                        for (let i = 0; i < results.rows.length; i++) {
                                                            myList2.push(results.rows[i])
                                                            toplam = toplam + results.rows[i].sepetfiyat
                                                        }
                                                        oModel.setProperty("/sepet", myList2)
                                                        console.log(toplam)
                                                        oModel.setProperty("/toplam", toplam)
                                                    })
                                                }
                                                else {
                                                    MessageToast.show("Yetersiz Stok.")
                                                }
                                            })

                                        })
                                    })
                                }
                                else {
                                    MessageToast.show("Lütfen listeden seçim yapınız.")
                                }
                            }
                        }),
                        new Button({
                            text: "-",
                            press: function () {

                                var list = sap.ui.getCore().byId("sepetID")
                                var selected = list.getSelectedItem();
                                if (selected != null) {
                                    var kitapad = selected.mProperties.title.substr(11)
                                }

                                if (selected != null) {
                                    var kitapad = selected.mProperties.title.substr(11)
                                    db.transaction(function (tx) {
                                        var toplam = 0;
                                        tx.executeSql("SELECT * FROM KITAPLAR WHERE kitapad=?", [kitapad], function (tx, results) {



                                            var kitapstok = results.rows[0].stok;
                                            var kitapfiyat = results.rows[0].kitapfiyat
                                            tx.executeSql("SELECT * FROM SEPET WHERE kitapid =?", [results.rows[0].kitapid], function (tx, results) {
                                                var sepetstok = results.rows[0].sepetkitapadet;


                                                if (kitapstok >= sepetstok && sepetstok > 1) {




                                                    tx.executeSql("UPDATE SEPET SET sepetkitapadet=?,sepetfiyat=? where kitapid =?", [--results.rows[0].sepetkitapadet, --results.rows[0].sepetkitapadet * kitapfiyat, results.rows[0].kitapid])
                                                    var myList2 = []

                                                    tx.executeSql("SELECT*FROM SEPET,YAZARLAR,KITAPLAR WHERE sepet.kitapid = kitaplar.kitapid and yazarlar.yazarid = kitaplar.yazarid", [], function (tx, results) {
                                                        for (let i = 0; i < results.rows.length; i++) {
                                                            myList2.push(results.rows[i])
                                                            toplam = toplam + results.rows[i].sepetfiyat
                                                        }
                                                        oModel.setProperty("/sepet", myList2)
                                                        console.log(toplam)
                                                        oModel.setProperty("/toplam", toplam)
                                                    })
                                                }
                                                else {

                                                    // for (let i = 0; i < oModel.getProperty("/sepet").length; i++) {

                                                    //     if (oModel.getProperty("/sepet")[i].sepetkitapadet == 1) {
                                                    //         tx.executeSql("delete from sepet where sepetid =?", [oModel.getProperty("/sepet")[i].sepetid], function (tx, results) {
                                                    //             var myList2 = []

                                                    //             tx.executeSql("SELECT*FROM SEPET,YAZARLAR,KITAPLAR WHERE sepet.kitapid = kitaplar.kitapid and yazarlar.yazarid = kitaplar.yazarid", [], function (tx, results) {
                                                    //                 for (let i = 0; i < results.rows.length; i++) {
                                                    //                     myList2.push(results.rows[i])
                                                    //                     toplam = toplam + results.rows[i].sepetfiyat
                                                    //                 }
                                                    //                 oModel.setProperty("/sepet", myList2)
                                                    //                 console.log(toplam)
                                                    //                 oModel.setProperty("/toplam", toplam)
                                                    //             })
                                                    //         })


                                                    //     }

                                                    // }
                                                }


                                            })


                                        })
                                    })
                                }
                                else {
                                    MessageToast.show("Lütfen listeden seçim yapınız.")
                                }
                            }
                        }),
                        new Button({
                            type: ButtonType.Emphasized,
                            text: "Satın Al",
                            press: function () {
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                this.oDefaultDialog.close();
                                db.transaction(function (tx) {
                                    tx.executeSql("SELECT * FROM ACTIVEUSER", [], function (tx, results) {
                                        if (results.rows.length > 0) {
                                            for (let i = 0; i < oModel.getProperty("/sepet").length; i++) {
                                                tx.executeSql("SELECT * FROM KITAPLAR WHERE kitapid =?", [oModel.getProperty("/sepet")[i].kitapid], function (tx, results) {
                                                    if (results.rows[0].stok >= oModel.getProperty("/sepet")[i].sepetkitapadet) {


                                                        tx.executeSql("UPDATE KITAPLAR SET STOK =? WHERE  kitapid =?", [results.rows[0].stok - oModel.getProperty("/sepet")[i].sepetkitapadet, oModel.getProperty("/sepet")[i].kitapid], function (tx, results) {
                                                            tx.executeSql("delete from sepet", [], function (tx, results) {

                                                                oModel.setProperty("/sepet", "")
                                                                oModel.setProperty("/toplam", "")
                                                                oRouter.navTo("SiparişBaşarılı");

                                                                var myList = []
                                                                tx.executeSql("SELECT * FROM KITAPLAR,YAZARLAR WHERE KITAPLAR.yazarid = YAZARLAR.yazarid", [], function (tx, results) {
                                                                    if (results.rows.length > 0) {
                                                                        // if (results.rows[0].stok > 0) {
                                                                        //     myList.push(results.rows[0])
                                                                        // }
                                                                        for (let element in results.rows) {
                                                                            if (results.rows[element].stok != "0") {
                                                                                myList.push(results.rows[element])
                                                                            }
                                                                        }
                                                                        oModel.setProperty("/bookList", myList)
                                                                        oModel.getProperty("/bookList").pop()
                                                                        oModel.getProperty("/bookList").pop()
                                                                        oModel.setProperty("/bookList", oModel.getProperty("/bookList"))
                                                                    }
                                                                    else {
                                                                        oModel.setProperty("/bookList", "");
                                                                    }
                                                                })



                                                            })

                                                        })
                                                    }
                                                    else {
                                                        sap.m.MessageToast.show(results.rows[0].kitapad + " Adlı kitabın seçilen adetten az stoğu var. Stok : " + results.rows[0].stok)

                                                    }

                                                })

                                            }
                                        }
                                        else {
                                            sap.m.MessageToast.show("Lütfen Giriş Yapınız.")
                                        }
                                    })

                                })

                            }.bind(this)
                        }),
                        new Button({
                            text: "Sepeti Boşalt",
                            press: function () {
                                this.oDefaultDialog.close();

                                db.transaction(function (tx) {
                                    tx.executeSql("delete from sepet")
                                    oModel.setProperty("/sepet", "")
                                    oModel.setProperty("/toplam", "")

                                })
                            }.bind(this)
                        }),

                        new Button({
                            text: "Kapat",
                            press: function () {
                                this.oDefaultDialog.close();
                            }.bind(this)
                        }),
                    ]

                },

                );

                // to get access to the controller's model
                this.getView().addDependent(this.oDefaultDialog);

            }

            this.oDefaultDialog.open();

        },
        login() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Login");
        },
        register() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Register");
        },
        logOut() {
            db.transaction(function (tx) {
                tx.executeSql("delete from activeuser");

            })
            this.byId("login").setVisible(true);
            this.byId("register").setVisible(true);
            this.byId("logOut").setVisible(false)
            this.byId("user").setVisible(false)
            oModel.setProperty("/sepet","");
            oModel.setProperty("/toplam","")


        },
        user() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("KullanıcıDetay");
        },
        allCategory() {
            window.location.reload(false);
        }
    })
});
