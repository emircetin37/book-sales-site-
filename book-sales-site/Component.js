jQuery.sap.require('com.UI5Starter.Resources.utils.Router')
sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/resource/ResourceModel',
    'com/UI5Starter/Resources/utils/StorageControls',
    'sap/ui/Device',
    'sap/base/Log',
    'sap/ui/core/IconPool'
], function (UIComponent, ResourceModel, StorageControls, Device, Log, IconPool) {
    'use strict';

    return UIComponent.extend('com.UI5Starter.Component', {
        metadata: {
            version: "1.0.0",
            routing: {
                config: {
                    routerClass: com.UI5Starter.Resources.utils.Router,
                    viewType: 'XML',
                    targetAggregation: 'pages',
                    clearTarget: false
                },
                routes: [{
                    pattern: 'Anasayfa',
                    viewPath: 'com.UI5Starter.Application.Anasayfa.view',
                    view: 'Anasayfa',
                    name: 'Anasayfa',
                    targetControl: 'masterAppView',
                    
                },
                {
                    pattern: 'Register',
                    viewPath: 'com.UI5Starter.Application.Register.view',
                    view: 'Register',
                    name: 'Register',
                    targetControl: 'masterAppView'
                },
                {
                    pattern: 'Login',
                    viewPath: 'com.UI5Starter.Application.Login.view',
                    view: 'Login',
                    name: 'Login',
                    targetControl: 'masterAppView'
                },
                {
                    viewPath: "com.UI5Starter.Application.Kitaplar.view",
                    pattern: "Kitaplar",
                    name: "Kitaplar",
                    view: "Kitaplar",
                    targetControl: "masterAppView",

                },
                {
                    viewPath: "com.UI5Starter.Application.Admin.view",
                    pattern: "Admin",
                    name: "Admin",
                    view: "Admin",
                    targetControl: "masterAppView",

                },
                {
                    viewPath: "com.UI5Starter.Application.KullanıcıDetay.view",
                    pattern: "KullanıcıDetay",
                    name: "KullanıcıDetay",
                    view: "KullanıcıDetay",
                    targetControl: "masterAppView",

                },
                {
                    viewPath: "com.UI5Starter.Application.SiparişBaşarılı.view",
                    pattern: "SiparişBaşarılı",
                    name: "SiparişBaşarılı",
                    view: "SiparişBaşarılı",
                    targetControl: "masterAppView",
                },
                {
                    viewPath: "com.UI5Starter.Application.NotFound.view",
                    pattern: ":all*:",
                    name: "NotFound",
                    view: "NotFound",
                    targetControl: "masterAppView",
                    transition: "show",
                },




                ]
            }
        },
        init: function () {
            sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
            var mConfig = this.getMetadata().getConfig();

            oModel.setProperty("/device", Device);  // set device model

            this.seti18nModel();
            this.registerFonts();
            this.setLogTracer();

            // UserHelper.checkSession()
            //     .then(res => this.getRouter().initialize())
            //     .catch(err => {
            //         if (err.name == "UserError" || err.name == "ServerError") {
            //             UserHelper.goLogin(true)
            //         } else {
            //             Log.error(err, err.stack)
            //         }
            this.getRouter().initialize();
            // })
        },
        seti18nModel: function () {
            var lang = StorageControls.getItem("LANG") || "TR";
            sap.ui.getCore().getConfiguration().setLanguage(lang)
            var i18nModel = new ResourceModel({
                bundleName: "com.UI5Starter.i18n.i18n"
            });
            /** custom lang data binding */
            i18nModel.getResourceBundle().aPropertyFiles[0].setProperty("Custom", "value")
            this.setModel(i18nModel, "i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");
        },
        registerFonts: function () {
            IconPool.registerFont({
                fontFamily: "SAP-icons-TNT",
                fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/"),
            });

            IconPool.registerFont({
                fontFamily: "BusinessSuiteInAppSymbols",
                fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/"),
            });
        },
        setLogTracer: function () {
            Log.addLogListener({
                onLogEntry: function (oLogEntry) {
                    if (oLogEntry.level === 1) {
                        oLogEntry.details = (typeof oLogEntry.details == 'string') ? oLogEntry.details : JSON.stringify(oLogEntry.details)
                        Logger.client(oLogEntry.message, oLogEntry.details, myuser.username)
                    }
                }
            });
        },
        createContent: function () {
            var oViewData = {
                component: this
            }
            return sap.ui.view({
                viewName: 'com.UI5Starter.Application.App.RootApp',
                type: sap.ui.core.mvc.ViewType.XML,
                id: 'app',
                viewData: oViewData,
            })
        },

    })
});