Module.register("MMM-Shelly-PM",{
	// Default module config.
	defaults: {
		//Just a mock API I used for development
		displayUpdated: true,
		horizontalView: true,
		negativeDisplay: false
	},
	// Initialize data after startup
	ShellyPDData: {
		tmp: "--",
		apower: "--",
		updated: "--",
		total: "--"
	},
	getStyles: function () {
		return ["MMM-Shelly-PM.css"]; //, "font-awesome.css"];
	},
	start: function() {
		var self = this;

		function setIntervalImmediately(func, interval) {
			func();
			return setInterval(func, interval);
		}

		// Schedule update timer.
		setIntervalImmediately(function() {
			var payload = {
				uri: self.config.ShellyApiPath
			}
			self.sendSocketNotification("GetShelly", payload);
			self.updateDom();
		}, this.config.refreshIntervalLAN);

		setIntervalImmediately(function() {
			var payload = {
				uri: self.config.cloudServerPath,
				deviceId: self.config.deviceId,
				authKey: self.config.authKey
			}
			self.sendSocketNotification("GetShellyCloud", payload);
			self.updateDom();
		}, this.config.refreshIntervalCloud);
		// update initial data
		self.sendSocketNotification("GetShelly");
		// self.sendSocketNotification("GetShellyCloud");
	},
	socketNotificationReceived: function (notification, payload) {
		if (notification == "ShellyPDData"){
			// Log.log(this.name + " received a socket notification: " + notification + " - Temp: " + payload.tmp + " Hum: " + payload.hum + "Updated: " + payload.updated);
			this.ShellyPDData.tmp = payload.tmp
			this.ShellyPDData.apower = payload.apower
			this.ShellyPDData.updated = payload.updated
		}
		if (notification == "ShellyCloudData") {
			this.ShellyPDData.total = payload.total
		}
	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var apower = this.translate("APOWER");
		var totalday = this.translate("TOTALDAY");
		if (this.config.negativeDisplay && this.ShellyPDData.apower > 0.4) {
			var apower_unit = this.translate("APOWER_UNIT", {"apower": -this.ShellyPDData.apower});
			var csstype = "generation"
		} else {
			var apower_unit = this.translate("APOWER_UNIT", {"apower": this.ShellyPDData.apower});
			var csstype = "consumption"
		}

		if (this.config.negativeDisplay && this.ShellyPDData.total > 0.004) {
			var total_unit = this.translate("TOTALDAY_UNIT", {"apower": -this.ShellyPDData.total})
			var totalcsstype = "generation"
		} else {
			var total_unit = this.translate("TOTALDAY_UNIT", {"apower": this.ShellyPDData.total})
			var totalcsstype = "consumption"
		}

		var tmp = this.translate("TEMPERATURE", {"tmp": this.ShellyPDData.tmp});
		var updated = this.translate("UPDATED", {"upd": this.ShellyPDData.updated})
		ihtml =  "<div class='container'>"
		if (this.config.horizontalView) {
			ihtml += "  <div class='right " + csstype + "'><sup>" + apower + "</sup> " + apower_unit + "</div>"
			ihtml += "  <div class='newline right " + totalcsstype + "'><sup>" + totalday + "</sup> " + total_unit + "</div>"
		} else {
			ihtml += "  <div class='newline " + csstype + "'><sup>" + apower + "</sup>" + apower_unit + "</div>"
			ihtml += "  <div class='newline " + totalcsstype + "'><sup>" + totalday + "</sup> " + total_unit + "</div>"
		}
		if (this.config.displayUpdated){
			ihtml += "  <p class='bottom'>" + tmp + "°C " + updated + "</p>"
		}
		ihtml += "</div><div class='newline'></div>"
		wrapper.innerHTML = ihtml
		return wrapper
	},
	getTranslations: function() {
        return  {
			en: 'translations/en.json',
			de: 'translations/de.json',
		};
	}
});
