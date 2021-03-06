var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
db.transaction(function (tx) {

	tx.executeSql('CREATE TABLE IF NOT EXISTS kategoriler (kategoriID integer primary key, kategoriAdi)');




	tx.executeSql("CREATE TABLE IF NOT EXISTS yazarlar (yazarid integer primary key,yazarad)")




	tx.executeSql("CREATE TABLE IF NOT EXISTS kitaplar (kitapid integer primary key,kitapad,stok NUMBER,sayfa NUMBER,ebat,photo,yayinevi,aciklama,kitapfiyat NUMBER,kategoriID,yazarid, foreign key (kategoriID) references kategoriler(kategoriID),foreign key (yazarid) references yazarlar(yazarid))")

	//tx.executeSql("delete from kitaplar")

	tx.executeSql("CREATE TABLE IF NOT EXISTS sepet (sepetid integer primary key,kullaniciID,sepetfiyat NUMBER,sepetkitapadet,kitapid,foreign key (kitapid) references kitaplar(kitapid),foreign key(kullaniciID) references kullanicilar(kullaniciID)) ")

	//tx.executeSql("DROP TABLE SEPET")

	tx.executeSql("CREATE TABLE IF NOT EXISTS ROLLER (rolid integer primary key,rolad)");
	
	//tx.executeSql("INSERT INTO ROLLER (rolad) VALUES('Admin')")
	

	tx.executeSql("CREATE TABLE IF NOT EXISTS KULLANICILAR (kullaniciID integer primary key,rolid,adsoyad,kullaniciadi,eposta,parola,telefon,foreign key(rolid) references roller(rolid))")
	//tx.executeSql("drop table activeuser")
	tx.executeSql("CREATE TABLE IF NOT EXISTS ACTIVEUSER (adsoyad,eposta,kullanicID,kullaniciadi,rolid,telefon)");

	//tx.executeSql("INSERT INTO KULLANICILAR (adsoyad,kullaniciadi,eposta,parola,telefon,rolid) VALUES(?,?,?,?,?,?)",["admin","system","admin@gmail.com","adminadmin","05424192525",2])
	



});
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/routing/History',
	'sap/m/MessageBox',
], function (Controller, History, MessageBox) {
	return Controller.extend("com.UI5Starter.Application.Base.BaseController", {
		showBusyIndicator: function (createId, iDelay = 0) { /* delay in miliseconds, */
			if (createId) {
				var multiInput = sap.ui.getCore().byId(createId);
				if (!multiInput) {
					multiInput = this.byId(createId);
					if (!multiInput) return console.warn(createId, "bulunamad??.");
				}
				multiInput.setBusyIndicatorDelay(iDelay);
				multiInput.setBusy(true);
			} else sap.ui.core.BusyIndicator.show(iDelay);
		},
		hideBusyIndicator: function (createId) {
			if (createId) {
				var multiInput = sap.ui.getCore().byId(createId);
				if (!multiInput) {
					multiInput = this.byId(createId);
					if (!multiInput) return console.warn(createId, "bulunamad??.");
				}
				multiInput.setBusy(false);
			} else sap.ui.core.BusyIndicator.hide();
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("Dashboard", {}, true /*no history*/);
			}
		},
		/**
		 * 
		 * @param {String} name route name
		 * @param {Object} parameters route parametreleri
		 * @param {Boolean} replace taray??c?? ge??mi??i ayar??. true ise taray??c?? ge??mi??i olmadan
		 */
		navTo: function (name, parameters = {}, replace = false) {
			this.getOwnerComponent().getRouter().navTo(name, parameters, replace);
		},
		getMockData: function (fileName) {
			return new Promise(function (resolve, reject) {
				$.ajax("/Resources/mockdata/" + fileName + ".json", {
					dataType: "json",
					success: function (oData) {
						resolve(oData);
					},
					error: function () {
						reject("failed to load json")
					}
				})
			})
		},
		/**
		 * tabloda ge??ersiz filtre yap??lmas?? durumunda tablodaki t??m filteyi temizleyen event
		 * @param {Object} oEvent 
		 */
		clearAllTableFilters: function (oEvent) {
			oEvent.getSource().getParent().getBinding("rows").filter([]);
			oEvent.getSource().getParent().getColumns().forEach(col => {
				col.setFiltered(false)
				col.setFilterValue()
			})
		},
		/**
		 * enum ??eklinde gelen verinin formatter??
		 * @param {Object[]} list veri listesi
		 * @param {String} key veri listesindeki formatlanacak field
		 * @param {String} sPath indexlenecek enum listesinin model pathi
		 * @param {String} iteratee enum listesinin index keyi
		 * @param {String} propertyKey enum listesinin al??nacak fieldi 
		 */
		formatValues: function (list = [], key, sPath, iteratee, propertyKey) {
			var enumList = _.indexBy(oModel.getProperty(sPath), iteratee)
			list.forEach(d => {
				var data = d[key]
				var findedEnum = enumList[data]
				var formattedData = findedEnum ? findedEnum[propertyKey] : data
				d[key + 'TX'] = d[key + 'TX'] || formattedData
			})
			return list;
		},
		/** datetime ??eklinde gelen verinin tarih-saat ??eklinde formatter?? */
		formatDateTime: function (value) {
			return moment(value, "YYYY-MM-DDTHH:mm:ss").format("DD.MM.YYYY HH:mm:ss")
		},
		/** datetime ??eklinde gelen verinin tarih ??eklinde formatter?? */
		formatDate: function (value) {
			return moment(value, "YYYY-MM-DD").format("DD.MM.YYYY")
		},
		/**
		 * 
		 * @param {Array} tree 
		 * @param {String} childNode a??a?? hangi d??????mle ba??l??? 
		 */
		solveTree: function (tree, childNode) {   /** tree verisini tek array e ??evirir */
			const solvedList = [];

			tree.forEach(branch => {
				const element = Object.assign({}, branch);
				delete element[childNode]
				if (branch[childNode].length > 0) {
					solvedList.push(element)
					solvedList.push(...this.solveTree(branch[childNode], childNode));
				} else {
					solvedList.push(element);
				}
			});

			return solvedList;
		},
		/**
		 * inputlar??n livechange ve manuel check event??
		 * @param {Object} oEvent fonksiyonu manuel ??a????r??rken "" g??nderilir
		 * @param {String} inputId 
		 * @param {String} regexp farkl?? bir regexp kontrol?? i??in, iste??e ba??l??
		 * @param {String} errorText farkl?? bir hata mesaj?? i??in, iste??e ba??l??
		 */
		liveValidateValue: function (oEvent, inputId, regexp, errorText) {
			var input = inputId ? this.byId(inputId) || sap.ui.getCore().byId(inputId) : oEvent.getSource()
			var value = input.getValue()
			var maxLength = input.getMaxLength() || 30
			errorText = errorText || "L??tfen en az 2 karakterden olu??an bir de??er girin."

			if (value && value.trim()) {
				if (this.valueRegexpControl(value, regexp, maxLength)) {
					input.setValueState("None")
				} else {
					input.setValueState("Error")
					input.setValueStateText(errorText)
				}
			} else if (input.getRequired()) {
				input.setValueState("Error")
				input.setValueStateText("Bu alan??n doldurulmas?? zorunludur.")
			} else {
				//value bo??, required de??il
				input.setValueState("None")
			}
		},
		valueRegexpControl: function (value, regexp, maxLength) {
			regexp = regexp || "^[a-zA-Zw????????????????????????0-9. ]{2," + maxLength + "}$"
			regexp = new RegExp(regexp)
			return regexp.test(value)
		},
		/**
		 * selectbox lar??n change eventi
		 * @param {*} oEvent 
		 * @param {*} inputId 
		 */
		changeValidate: function (oEvent, inputId, errorText) {
			var input = inputId ? this.byId(inputId) || sap.ui.getCore().byId(inputId) : oEvent.getSource()
			var [, , elementName] = input.getMetadata().getElementName().split('.')

			switch (elementName) {
				case "MultiComboBox":
					var value = input.getSelectedItems()
					break;
				case "ComboBox":
				case "Select":
					var value = input.getSelectedItem() ? [input.getSelectedItem()] : []
					break;
			}
			errorText = errorText || "Bu alan??n se??ilmesi zorunludur."

			if (value && value.length) {
				input.setValueState("None")
				return true
			} else {
				input.setValueState("Error")
				input.setValueStateText("Bu alan??n se??ilmesi zorunludur.")
				return false
			}
		},
		/**
		 * mail inputlar??n??n onsapfocusleave ve livechange eventi
		 * @param {String} inputId 
		 */
		liveValidateMail: function (inputId) {
			var regexp = "^[a-z0-9][-a-z0-9._]+@([-a-z]+[.])+[a-z]{2,4}$"
			var errorText = "E-posta adresiniz yaln??zca harf, say??, nokta (.), k??sa ??izgi (-), ve alt ??izgi (_) i??erebilir."
			this.liveValidateValue("", inputId, regexp, errorText);
		},
		validateDate: function (oEvent, inputId, errorText) {
			var input = inputId ? this.byId(inputId) || sap.ui.getCore().byId(inputId) : oEvent.getSource()
			var value = input.getValue()
			var valid = input.isValidValue()
			errorText = errorText || "L??tfen ge??erli bir tarih girin."

			if (value) {
				if (valid) {
					input.setValueState("None")
				} else {
					input.setValueState("Error")
					input.setValueStateText(errorText)
				}
			} else if (input.getRequired()) {
				input.setValueState("Error")
				input.setValueStateText("Bu alan??n doldurulmas?? zorunludur.")
			} else {
				//value bo??, required de??il
				input.setValueState("None")
			}
		},
		/**
		 * mask inputlar??n change ve manuel check eventi
		 * @param {*} oEvent 
		 * @param {*} inputId 
		 * @param {*} errorText farkl?? bir hata mesaj?? i??in, iste??e ba??l??
		 */
		liveValidateGSM: function (oEvent, inputId, errorText) {
			var input = inputId ? this.byId(inputId) || sap.ui.getCore().byId(inputId) : oEvent.getSource()
			var value = input.getValue()
			errorText = errorText || "L??tfen ge??erli bir telefon numaras?? girin."

			if ((value && value.search("_") == -1) || (!value && !input.getRequired())) {
				input.setValueState("None")
			} else {
				input.setValueState("Error")
				input.setValueStateText(errorText)
			}
		},
		replaceGSM: function (gsm) {
			if (gsm) {
				gsm = gsm.replace("(", "")
				gsm = gsm.replace(")", "")
				gsm = gsm.replace(" ", "")
				gsm = gsm.replace(" ", "")
			}
			return gsm || "";
		},
		formatGSM: function (gsm) {
			if (gsm) {
				let cleaned = gsm.replace(/\D/g, '');
				let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
				if (match) gsm = '(' + match[1] + ') ' + match[2] + '-' + match[3]
			}
			return gsm
		},
		/**
		 * 'Error' durumunda input olup olmamas?? kontrol??
		 * @param {Array} inputs 
		 */
		getInputsState: function (inputs) {
			var state = false;
			if (inputs && inputs.length) {
				state = inputs.every(id => {
					var input = this.byId(id) || sap.ui.getCore().byId(id)
					if (input.getValueState() == "Error") return false
					else return true
				})
			}
			return state;
		},
		/**
		 * id'leri g??nderilen input statelerinin none durumuna ??ekilmesi
		 * @param {Array} inputs input id list
		 */
		clearInputsState: function (inputs) {
			if (inputs && inputs.length) {
				inputs.forEach(id => {
					var input = this.byId(id) || sap.ui.getCore().byId(id)
					input.setValueState("None")
				});
			}
		},
		bugNotifier: function (error) {
			MessageBox.error("Beklenmedik bir hata olu??tu.", {
				details: error,
			})
			throw error
		},
		/**
		 * t??m value'lar trim ediliyor
		 * @param {Object} model 
		 */
		trimValues: function (model) {
			for (let key in model) {
				if (typeof (model[key]) == "string") model[key] = model[key].trim()
			}
			return model
		},
		getConfirmDelete: function (title) {
			return new Promise(function (resolve) {
				MessageBox.confirm(title + " silinecektir. Onayl??yor musunuz?", {
					onClose: function (oAction) {
						if (oAction == "OK") resolve(true);
					}
				})
			})
		},
		/**
		 * multiInput filterlar?? i??in *varsa* se??ili token verilerini d??ner, yoksa bo?? key olu??turmaz
		 * @param {Object} filters t??m filtrelerin tutuldu??u obje
		 * @param {*} inputId multiInput idsi
		 * @param {*} key filtreye hangi key ile eklenecek
		 */
		getMultiInputValues: function (filters, inputId, key) {
			var values = this.byId(inputId).getTokens().map(token => token.getProperty("key"))
			if (values.length) filters[key] = values

			return filters;
		},
		/**
		 * string olarak gelen dosya i??eri??inden blob file olu??turup indirtiliyor
		 * @param {String} blob blob document 
		 * @param {String} name 
		 * @param {String} fileType 
		 */
		saveFile: function (blob, name, type) {
			var element = document.createElement('a');

			var element = document.createElement('a');
			var blob = new Blob([blob], { type: 'application/' + type });

			element.setAttribute('href', window.URL.createObjectURL(blob));
			window.URL.revokeObjectURL(blob)
			element.setAttribute('download', name + "." + type);

			element.dataset.downloadurl = ['text/plain', element.download, element.href].join(':');
			element.draggable = true;
			element.classList.add('dragout');

			element.click();
		},
		/**
		 * view'daki t??m nesneler gizleniyor
		 * @param {Object[]} elementIds gizlenecek nesne id listesi
		 */
		hideAllElements: function (elementIds) {
			elementIds.forEach(id => this.byId(id).setVisible(false))
		},
		/**
		 * view'da gizli olan nesneler aras??nda istenilen nesne g??r??n??r k??l??n??yor
		 * @param {Object[]} displayedElementIds g??r??nt??lenecek nesne id listesi
		 */
		showElementByIds: function (displayedElementIds) {
			displayedElementIds.forEach(id => this.byId(id).setVisible(true))
		},
		/**
		 * MultiComboBox nesnelerinin yan??ndaki t??m??n?? se??/kald??r butonunun fonksiyonu
		 * view'de press'ine bu fonksiyon verilip, 
		 * app:comboId ??zelli??ine de MultiComboBox'un id si yaz??lmal??.
		 * @param {Object} oEvent 
		 */
		onToggleSelectedItems: function (oEvent) {
			var icon = oEvent.getSource().getIcon()
			var comboId = oEvent.getSource().data("comboId")
			var combo = this.byId(comboId)
			if (icon == "sap-icon://multiselect-all") {
				var items = combo.getItems()
				combo.setSelectedItems(items)
			} else {
				combo.setSelectedItems()
			}
		},
		/**
		 * 
		 * @param {Number} bytes 
		 */
		getBytes: function (bytes) {
			if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
			else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
			else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
			else if (bytes > 1) { bytes = bytes + " bytes"; }
			else if (bytes == 1) { bytes = bytes + " byte"; }
			else { bytes = "0 bytes"; }
			return bytes;
		},
		/**
		 * 
		 * @param {Object} args input'un text propertyleri
		 * @param {String} inputId validatore ait input'un idsi
		 */
		filterInputValidator: function (args, inputId) {
			var input = this.byId(inputId)
			var text = args.text;
			if (text.length != input.getMaxLength()) {
				sap.m.MessageToast.show('L??tfen ' + input.getMaxLength() + ' karakterden olu??an bir de??er girin.')
				return null;
			} else {
				return new sap.m.Token({ key: text, text: text });
			}
		},
		/**
		 * object t??r??ndeki filtreleri query string'e ??evirir
		 * @param {Object} filter filter values
		 * @param {Object} operators EQ (=) d??????nda operatorleri belirtmek i??in. ??rn: { 'Begdt' : '<'}
		 */
		getQuery: function (filter, operations = {}) {
			var query = "&"
			for (let field in filter) {
				if (filter[field]) {
					var op = operations[field] || "="
					query += field + op + filter[field] + "&"
				}
			}

			return query;
		},
		/**
		 * selectDto kavram??na uygun Filter sonucu ??retir
		 * @param {String} query query string
		 * @param {String} group 
		 * @param {String} conversion 
		 */
		urlParse: function (query, group, conversion) {
			if (!query) return "";

			var params = query.split("&")
			return params.map(row => {
				var operators = {
					"=": "EQ",
					"<": "LT",
					">": "GT",
					"%": "CT",
					"!": "N"
				}
				for (let op in operators) {
					if (row.includes(op)) {
						var [field, value] = row.split(op)

						var filter = {
							PropertyName: field,
							Operation: operators[op],
							PropertyValue: value
						}

						if (op == "=" && value.includes(",")) filter.Operation = "IN"

						if (group) filter.Group = group;
						if (conversion) filter.ConversionMethodName = conversion;

						return filter;
					}
				}

			}).filter(f => f)
		},
		/**
		 * @param {String} type;
		 * yesterday, today, tomorrow, 
		 * lastWeek, currentWeek, nextWeek, 
		 * lastMonth, currentMonth, nextMonth, 
		 * lastYear, currentYear, nextYear
		 * @param {String} format 
		 */
		getDateRange: function (type, format) {
			format = format || "YYYY.MM.DD"
			var today = new Date(),
				begdt, enddt;
			switch (type) {
				/* D??n */
				case "yesterday":
					begdt = moment(today).add(-1, 'days');
					enddt = moment(today).add(-1, 'days');
					break;
				/* Bug??n */
				case "today":
					begdt = moment(today);
					enddt = moment(today);
					break;
				/* Yar??n */
				case "tomorrow":
					begdt = moment(today).add(1, 'days');
					enddt = moment(today).add(1, 'days');
					break;
				/* Ge??en Hafta */
				case "lastWeek":
					begdt = moment(today).add(-1, 'weeks').startOf('isoWeek');
					enddt = moment(today).add(-1, 'weeks').endOf('isoWeek');
					break;
				/* Cari Hafta */
				case "currentWeek":
					begdt = moment(today).startOf('isoWeek');
					enddt = moment(today).endOf('isoWeek');
					break;
				/* Gelecek Hafta */
				case "nextWeek":
					begdt = moment(today).add(1, 'weeks').startOf('isoWeek');
					enddt = moment(today).add(1, 'weeks').endOf('isoWeek');
					break;
				/* Ge??en Ay */
				case "lastMonth":
					begdt = moment(today).add(-1, 'month').startOf('month');
					enddt = moment(today).add(-1, 'month').endOf('month');
					break;
				/* Cari Ay */
				case "currentMonth":
					begdt = moment(today).startOf('month');
					enddt = moment(today).endOf('month');
					break;
				/* Gelecek Ay */
				case "nextMonth":
					begdt = moment(today).add(1, 'month').startOf('month');
					enddt = moment(today).add(1, 'month').endOf('month');
					break;
				/* Ge??en Y??l */
				case "lastYear":
					begdt = moment(today).add(-1, 'year').startOf('year');
					enddt = moment(today).add(-1, 'year').endOf('year');
					break;
				/* Cari Y??l */
				case "currentYear":
					begdt = moment(today).startOf('year');
					enddt = moment(today).endOf('year');
					break;
				/* Gelecek Y??l */
				case "nextYear":
					begdt = moment(today).add(1, 'year').startOf('year');
					enddt = moment(today).add(1, 'year').endOf('year');
					break;
			}
			begdt = begdt.format(format);
			enddt = enddt.format(format);
			return { begdt, enddt };
		},
	});
}, true)