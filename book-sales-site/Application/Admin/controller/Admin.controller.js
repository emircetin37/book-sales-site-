var author;
var category;
var book;
var myDialog;
sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'sap/m/MessageToast', 'sap/ui/core/mvc/Controller', "sap/ui/layout/HorizontalLayout",
    "sap/ui/layout/VerticalLayout",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/m/Input",
    "sap/m/Select",
    "sap/ui/core/Fragment"
], function (BaseController, MessageToast, Controller, HorizontalLayout, VerticalLayout, Dialog, DialogType, Button, ButtonType, Label, Text, TextArea, Input, Select, Fragment) {
    'use strict';
    return BaseController.extend("com.UI5Starter.Application.Admin.controller.Admin", {
        onInit: function () {
            this.byId("authorInput").setVisible(false)
            this.byId("categoryInput").setVisible(false)

            this.byId("author").setVisible(false);
            this.byId("category").setVisible(false);
            this.byId("books").setVisible(true)


            this.byId("editSaveAuthor").setVisible(false);
            this.byId("deleteAuthor").setVisible(false)

            this.byId("editSaveCategory").setVisible(false);
            this.byId("deleteCategory").setVisible(false);

            // this.byId("editSaveBook").setVisible(false);
            // this.byId("deleteBook").setVisible(false);

            db.transaction(function (tx) {
                var myList = [];
                var myList2 = [];
                var myList3 = [];
                tx.executeSql("SELECT * FROM YAZARLAR", [], function (tx, results) {


                    for (let element in results.rows) {
                        myList.push(results.rows[element])
                    }

                    oModel.setProperty("/authorList", myList)
                    oModel.getProperty("/authorList").pop();
                    oModel.getProperty("/authorList").pop()
                    oModel.setProperty("/authorList", oModel.getProperty("/authorList"))


                })
                tx.executeSql("SELECT * FROM KATEGORILER", [], function (tx, results) {
                    for (let element in results.rows) {
                        myList2.push(results.rows[element])
                    }
                    oModel.setProperty("/categoryList", myList2)
                    oModel.getProperty("/categoryList").pop()
                    oModel.getProperty("/categoryList").pop()
                    oModel.setProperty("/categoryList", oModel.getProperty("/categoryList"))
                })
                tx.executeSql("SELECT KATEGORILER.kategoriadi,YAZARLAR.yazarad,KITAPLAR.kitapid,KITAPLAR.kitapad,KITAPLAR.stok,KITAPLAR.sayfa,KITAPLAR.ebat,KITAPLAR.photo,KITAPLAR.aciklama,KITAPLAR.kitapfiyat,KITAPLAR.yayinevi,KITAPLAR.kategoriID,KITAPLAR.yazarid FROM KITAPLAR,YAZARLAR,KATEGORILER WHERE KITAPLAR.yazarid = YAZARLAR.yazarid AND KITAPLAR.kategoriID = KATEGORILER.kategoriID", [], function (tx, results) {
                    for (let element in results.rows) {
                        myList3.push(results.rows[element])
                        console.log(results.rows[element].yazarad)
                    }

                    oModel.setProperty("/bookList", myList3)
                    console.log(oModel.getProperty("/bookList"))
                    oModel.getProperty("/bookList").pop();
                    oModel.getProperty("/bookList").pop();
                    oModel.setProperty("/bookList", oModel.getProperty("/bookList"))

                })

            })


            author = {
                yazarad: ""
            }

            oModel.setProperty("/author", author)

            category = {
                kategoriadi: ""
            }
            oModel.setProperty("/category", category)

            book = {
                kitapad: "",
                stok: null,
                sayfa: null,
                aciklama: "",
                kitapfiyat: null,
                kategoriID: null,
                yazarid: null,
                ebat: "",
                yayinevi: ""
            }
            oModel.setProperty("/book", book)
        },
        //*************AUTHOR**************** */
        addAuthor: function () {
            this.byId("author").setVisible(true);
            this.byId("category").setVisible(false);
            this.byId("books").setVisible(false);
        },
        saveAuthor: function () {


            if (oModel.getProperty("/author/yazarad/length") > 3) {

                var isHas = false;
                var myList = [];
                db.transaction(function (tx) {
                    tx.executeSql("select * from yazarlar", [], function (tx, results) {
                        for (let i = 0; i < results.rows.length; i++) {
                            if (results.rows[i].yazarad == oModel.getProperty("/author/yazarad")) {
                                isHas = true;
                            }
                        }
                        if (isHas == false) {


                            tx.executeSql("INSERT INTO YAZARLAR (yazarad) VALUES(?)", [author.yazarad])
                            tx.executeSql("SELECT * FROM YAZARLAR", [], function (tx, results) {


                                for (let element in results.rows) {
                                    myList.push(results.rows[element])
                                }

                                oModel.setProperty("/authorList", myList)
                                oModel.getProperty("/authorList").pop();
                                oModel.getProperty("/authorList").pop()
                                oModel.setProperty("/authorList", oModel.getProperty("/authorList"))
                                oModel.setProperty("/author/yazarad", "")

                            })
                        }
                        else {
                            MessageToast.show("Böyle bir yazar zaten kayıtlarda var.")
                        }
                    })

                })

            }
            else {
                MessageToast.show("Lütfen daha uzun bir isim giriniz.")
            }

        },
        deleteAuthor: function () {
            var list = this.byId("authorList");
            var selected = list.getSelectedItem();
            var path = selected.getBindingContext().getPath();
            var count = path.substr(12)
            var yazarid = oModel.getProperty(path).yazarid
            db.transaction(function (tx) {
                tx.executeSql("DELETE FROM YAZARLAR WHERE yazarid=?", [yazarid])

            })
            oModel.getProperty("/authorList").splice(count, 1)
            oModel.setProperty("/authorList", oModel.getProperty("/authorList"))
            this.byId("authorInput").setVisible(false)
            this.byId("deleteAuthor").setVisible(false);
            this.byId("editSaveAuthor").setVisible(false);
            this.byId("editAuthor").setVisible(true);
            this.byId("authorSave").setVisible(true)
            oModel.setProperty("/author/yazarad", "")



        },
        editAuthor: function () {
            this.byId("authorInput").setVisible(true)
            this.byId("editSaveAuthor").setVisible(true);
            this.byId("authorSave").setVisible(false);
            this.byId("editAuthor").setVisible(false);
            this.byId("deleteAuthor").setVisible(true)
            var list = this.byId("authorList");
            var selected = list.getSelectedItem();
            var path = selected.getBindingContext().getPath();
            oModel.setProperty("/author/yazarad", oModel.getProperty(path).yazarad)
        },
        editSaveAuthor: function () {
            if (oModel.getProperty("/author/yazarad/length") > 6) {
                this.byId("authorInput").setVisible(false)
                this.byId("editSaveAuthor").setVisible(false);
                this.byId("authorSave").setVisible(true);
                this.byId("editAuthor").setVisible(true);
                this.byId("deleteAuthor").setVisible(false)
                var list = this.byId("authorList")
                var selected = list.getSelectedItem();
                var path = selected.getBindingContext().getPath();
                var yazarid = oModel.getProperty(path).yazarid

                oModel.setProperty(path + "/yazarad", oModel.getProperty("/author/yazarad"));
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE YAZARLAR SET YAZARAD =? WHERE yazarid =?", [oModel.getProperty("/author/yazarad"), yazarid])
                    oModel.setProperty("/author/yazarad", "")
                })

            }
            else {
                MessageToast.show("Lütfen daha uzun bir isim giriniz.")
            }
        },
        // ******************CATEGORY******************//
        addCategory: function () {
            this.byId("author").setVisible(false);
            this.byId("category").setVisible(true);
            this.byId("books").setVisible(false);
        },
        saveCategory: function () {
            if (oModel.getProperty("/category/kategoriadi/length") > 4) {
                var myList = []
                var isHas = false;
                db.transaction(function (tx) {
                    tx.executeSql("select * from kategoriler", [], function (tx, results) {
                        for (let i = 0; i < results.rows.length; i++) {
                            if (results.rows[i].kategoriAdi == oModel.getProperty("/category/kategoriadi")) {
                                isHas = true
                            }
                        }
                        if (isHas == false) {
                            tx.executeSql("INSERT INTO KATEGORILER (kategoriadi) VALUES(?)", [category.kategoriadi])
                            tx.executeSql("SELECT * FROM KATEGORILER", [], function (tx, results) {
                                for (let element in results.rows) {
                                    myList.push(results.rows[element])
                                }
                                oModel.setProperty("/categoryList", myList)
                                oModel.getProperty("/categoryList").pop()
                                oModel.getProperty("/categoryList").pop()
                                oModel.setProperty("/categoryList", oModel.getProperty("/categoryList"))
                                oModel.setProperty("/category/kategoriadi", "")
                            })
                        }
                        else {
                            MessageToast.show("Böyle bir kategori zaten kayıtlarda var.")
                        }
                    })


                })
            }
            else {
                MessageToast.show("Lütfen belirlenen uzunlukta bir kategori giriniz.")
            }

        },
        deleteCategory: function () {
            var list = this.byId("categoryList");
            var selected = list.getSelectedItem();
            var path = selected.getBindingContext().getPath();
            console.log(path)
            var count = path.substr(14)
            var kategoriID = oModel.getProperty(path).kategoriID;
            db.transaction(function (tx) {
                tx.executeSql("DELETE FROM KATEGORILER WHERE kategoriID =?", [kategoriID])
            })
            oModel.getProperty("/categoryList").splice(count, 1)
            oModel.setProperty("/categoryList", oModel.getProperty("/categoryList"))

            oModel.setProperty("/category/kategoriadi", "")
            this.byId("categoryInput").setVisible(false)
            this.byId("categorySave").setVisible(true);
            this.byId("editCategory").setVisible(true);
            this.byId("editSaveCategory").setVisible(false);
            this.byId("deleteCategory").setVisible(false);

        },
        editCategory: function () {
            this.byId("categoryInput").setVisible(true)
            this.byId("categorySave").setVisible(false);
            this.byId("editCategory").setVisible(false);
            this.byId("editSaveCategory").setVisible(true);
            this.byId("deleteCategory").setVisible(true);

            var list = this.byId("categoryList");
            var selected = list.getSelectedItem();
            var path = selected.getBindingContext().getPath();
            console.log(oModel.getProperty(path))
            oModel.setProperty("/category/kategoriadi", oModel.getProperty(path).kategoriAdi)


        },
        editSaveCategory: function () {
            if (oModel.getProperty("/category/kategoriadi/length") > 3) {
                var list = this.byId("categoryList")
                var selected = list.getSelectedItem();
                var path = selected.getBindingContext().getPath();
                var kategoriID = oModel.getProperty(path).kategoriID
                oModel.setProperty(path + "/kategoriAdi", oModel.getProperty("/category/kategoriadi"))
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE KATEGORILER SET KATEGORIADI =? WHERE kategoriID =?", [oModel.getProperty("/category/kategoriadi"), kategoriID])

                })
                this.byId("categoryInput").setVisible(false)
                this.byId("categorySave").setVisible(true);
                this.byId("editCategory").setVisible(true);
                this.byId("editSaveCategory").setVisible(false);
                this.byId("deleteCategory").setVisible(false);
            }
            else {
                MessageToast.show("Lütfen belirlenen uzunlukta kategori giriniz.")
            }
        },
        // ********************BOOK********************** //
        addBook: function () {
            this.byId("author").setVisible(false);
            this.byId("category").setVisible(false);
            this.byId("books").setVisible(true)
            this.byId("books").setVisible(true);
            this.byId("deleteBook").setVisible(false);
            this.byId("editBook").setVisible(false);
            this.byId("editSaveBook").setVisible(false);
            this.byId("saveBook").setVisible(true);
        },
        saveBook: function () {
            if (oModel.getProperty("/book/kitapad/length") > 3 && oModel.getProperty("/book/kitapfiyat") > 0 && oModel.getProperty("/book/sayfa") >
                0 && oModel.getProperty("/book/ebat/length") > 2 && oModel.getProperty("/book/yayinevi/length") > 3 && oModel.getProperty("/book/aciklama/length") > 7 && oModel.getProperty("/book/stok") > 0) {

                var myList = []
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO KITAPLAR  (kitapad,stok,sayfa,aciklama,kitapfiyat,kategoriID,yazarid,ebat,photo,yayinevi) VALUES(?,?,?,?,?,?,?,?,?,?)", [book.kitapad, book.stok, book.sayfa, book.aciklama, book.kitapfiyat, book.kategoriID, book.yazarid, book.ebat, book.photo, book.yayinevi])
                    tx.executeSql("SELECT KATEGORILER.kategoriadi,YAZARLAR.yazarad,KITAPLAR.kitapid,KITAPLAR.kitapad,KITAPLAR.stok,KITAPLAR.sayfa,KITAPLAR.aciklama,KITAPLAR.ebat,KITAPLAR.photo,KITAPLAR.kitapfiyat,KITAPLAR.yayinevi,KITAPLAR.kategoriID,KITAPLAR.yazarid FROM KITAPLAR,YAZARLAR,KATEGORILER WHERE KITAPLAR.yazarid = YAZARLAR.yazarid AND KITAPLAR.kategoriID = KATEGORILER.kategoriID", [], function (tx, results) {
                        console.log(results)
                        for (let element in results.rows) {
                            myList.push(results.rows[element])
                            console.log(results.rows[element].yazarad)
                        }

                        oModel.setProperty("/bookList", myList)
                        console.log(oModel.getProperty("/bookList"))
                        oModel.getProperty("/bookList").pop();
                        oModel.getProperty("/bookList").pop();
                        oModel.setProperty("/bookList", oModel.getProperty("/bookList"))

                    })
                })
            }
            else {
                MessageToast.show("Lütfen kitabın bilgilerini belirlenen uzunluklarda giriniz.");
            }


        },
        deleteBook: function () {
            var list = this.byId("bookList");
            var selected = list.getSelectedItem();
            if (selected != null) {
                var path = selected.getBindingContext().getPath();
                var count = path.substr(10)

                var kitapid = oModel.getProperty(path).kitapid;
                db.transaction(function (tx) {
                    tx.executeSql("DELETE FROM KITAPLAR WHERE kitapid = ?", [kitapid])
                })
                oModel.getProperty("/bookList").splice(count, 1);
                oModel.setProperty("/bookList", oModel.getProperty("/bookList"))
            }
            else {
                MessageToast.show("Lütfen Slmek İstediğiniz Kitabı Listeden Seçiniz.")
            }

        },
        editBook: function () {

            this.byId("deleteBook").setVisible(true);
            this.byId("editSaveBook").setVisible(true);
            this.byId("editBook").setVisible(false)
            this.byId("saveBook").setVisible(false)

            var list = this.byId("bookList");
            var selected = list.getSelectedItem();
            var path = selected.getBindingContext().getPath();
            oModel.setProperty("/book", oModel.getProperty(path))
            this.byId("fileUploader").setValue(oModel.getProperty(path).photo)
        },
        editSaveBook: function () {
            myDialog.close();
            if (oModel.getProperty("/book/kitapad/length") > 3 && oModel.getProperty("/book/kitapfiyat") > 0 && oModel.getProperty("/book/stok") > length && oModel.getProperty("/book/sayfa") >
                0 && oModel.getProperty("/book/ebat/length") > 2 && oModel.getProperty("/book/yayinevi/length") > 3 && oModel.getProperty("/book/aciklama/length") > 7) {

                var list = this.byId("bookList")
                var selected = list.getSelectedItem();
                var path = selected.getBindingContext().getPath();
                var kitapid = oModel.getProperty(path).kitapid


                this.byId("deleteBook").setVisible(false);
                this.byId("editSaveBook").setVisible(false);
                this.byId("editBook").setVisible(true)
                this.byId("saveBook").setVisible(true)
                oModel.setProperty(path, oModel.getProperty("/book"))
                var myList = []
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE KITAPLAR SET kitapad=?,stok=?,sayfa=?,aciklama=?,kitapfiyat=?,kategoriID=?,yazarid=?,ebat=?,photo=?,yayinevi=?  WHERE kitapid =?", [oModel.getProperty(path).kitapad, oModel.getProperty(path).stok, oModel.getProperty(path).sayfa, oModel.getProperty(path).aciklama, oModel.getProperty(path).kitapfiyat, oModel.getProperty(path).kategoriID, oModel.getProperty(path).yazarid, oModel.getProperty(path).ebat, oModel.getProperty(path).photo, oModel.getProperty(path).yayinevi, kitapid])
                    tx.executeSql("SELECT KATEGORILER.kategoriadi,YAZARLAR.yazarad,KITAPLAR.kitapid,KITAPLAR.kitapad,KITAPLAR.stok,KITAPLAR.sayfa,KITAPLAR.ebat,KITAPLAR.photo,KITAPLAR.aciklama,KITAPLAR.kitapfiyat,KITAPLAR.yayinevi,KITAPLAR.kategoriID,KITAPLAR.yazarid FROM KITAPLAR,YAZARLAR,KATEGORILER WHERE KITAPLAR.yazarid = YAZARLAR.yazarid AND KITAPLAR.kategoriID = KATEGORILER.kategoriID", [], function (tx, results) {
                        console.log(results)
                        for (let element in results.rows) {
                            myList.push(results.rows[element])
                            console.log(results.rows[element].yazarad)
                        }

                        oModel.setProperty("/bookList", myList)
                        console.log(oModel.getProperty("/bookList"))
                        oModel.getProperty("/bookList").pop();
                        oModel.getProperty("/bookList").pop();
                        oModel.setProperty("/bookList", oModel.getProperty("/bookList"))

                    })
                })
            }
            else {
                MessageToast.show("Lütfen kitabın bilgilerini belirlenen uzunluklarda giriniz.");
            }
        },
        fileChange: function (oEvent) {
            var oModel = this.getView().getModel();
            var oReader = new FileReader()
            oReader.readAsDataURL(oEvent.getParameter("files")[0]);
            oReader.onload = function () {
                oModel.setProperty("/book/photo", oReader.result);

            }
        },
        changeCategoryList: function (oEvent) {
            var selectedItem = oEvent.getParameter("selectedItem");
            oModel.setProperty("/book/kategoriID", selectedItem.getKey())
        },
        changeAuthorList: function (oEvent) {
            var selectedItemm = oEvent.getParameter("selectedItem");
            oModel.setProperty("/book/yazarid", selectedItemm.getKey())
        },
        authorAddDialog: function () {
            if (!this.oDefaultDialog) {

                this.oDefaultDialog = new Dialog({
                    title: "Yazar Ekle",
                    content: [
                        new Input({
                            placeholder: "Yazarın Adı",
                            value: "{/author/yazarad}"
                        }),
                    ],
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Ekle",
                        press: function () {
                            this.saveAuthor()
                            this.oDefaultDialog.close();

                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Kapat",
                        press: function () {
                            this.oDefaultDialog.close();
                            oModel.setProperty("/author/yazarad", "")
                        }.bind(this)
                    })
                });

                // to get access to the controller's model
                this.getView().addDependent(this.oDefaultDialog);
            }

            this.oDefaultDialog.open();
        },

        categoryAddDialog: function () {
            if (!this.DefaultDialog) {
                this.DefaultDialog = new Dialog({
                    title: "Kategori Ekle",
                    content: [
                        new Input({
                            value: "{/category/kategoriadi}"
                        })
                    ],
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Kategori Ekle",
                        press: function () {
                            this.saveCategory();
                            this.DefaultDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Close",
                        press: function () {
                            this.DefaultDialog.close();
                            oModel.setProperty("/category/kategoriadi", "")
                        }.bind(this)
                    })
                });

                // to get access to the controller's model
                this.getView().addDependent(this.DefaultDialog);
            }

            this.DefaultDialog.open();
        },
        onOpenDialog: function (oEvent) {
            // create popover
            var that = this.getView()
            if (!this._oDialog) {
                this._oDialog = Fragment.load({
                    id: that.getId(),
                    name: "com.UI5Starter.Application.Admin.fragments.SampleDialog",
                    controller: this
                }).then(function (oDialog) {
                    that.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._oDialog.then(function (oDialog) {
                oDialog.open()
                myDialog = oDialog;


            });
        },
        onEditDialog: function () {
            var list = this.byId("bookList");
            var selected = list.getSelectedItem();
            if (selected != null) {
                this.onOpenDialog()
                setTimeout(() => {
                    this.editBook()
                }, 50);
            }
            else {
                MessageToast.show("Bu işlemi yapmak için listeden bir kitabı seçmelisiniz.");
            }


        },
        onSaveDialog: function () {

            this.onOpenDialog()
            setTimeout(() => {
                oModel.setProperty("/book/stok", "")
                oModel.setProperty("/book/sayfa", "")
                oModel.setProperty("/book/aciklama", "")
                oModel.setProperty("/book/kitapfiyat", "")
                oModel.setProperty("/book/kategoriID", "")
                oModel.setProperty("/book/yazarid", "")
                oModel.setProperty("/book/ebat", "")
                oModel.setProperty("/book/yayinevi", "")
                oModel.setProperty("/book/kitapad", "")
                this.addBook();
            }, 50)
        },
        closeDialogBook() {
            myDialog.close()
        },
        goToAnasayfa(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Anasayfa");
        }
    })
});
