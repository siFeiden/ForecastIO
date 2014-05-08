var Forecast = function (apikey) {
	this._apikey = apikey;
};

Forecast.prototype = {
	constructor: Forecast,

	getForecast: function (lat, long, callback, options) {
		// the url the api request is sent to
		var endpoint = 'https://api.forecast.io/forecast/' + this._apikey;
		endpoint += '/' + lat + ',' + long;

		// if options parameter is initialised, check all possible parameters and modifiy endpoint
		if ( options ) {

			if ( options.time )
				endpoint += ',' + options.time;

			var delim = '?';
			if ( options.units ) {
				endpoint += delim + 'units=' + options.units;
				delim = '&';
			}

			if ( options.exclude ) {
				endpoint += delim + 'exclude=';
				if ( options.exclude instanceof Array )
					endpoint += options.exclude.join(',');
				else
					endpoint += options.exclude;
				delim = '&';
			}

			if ( options.extend ) {
				endpoint += delim + 'extend=' + options.extend;
				delim = '&';
			}

			if ( options.nocache )
				endpoint += delim + (new Date().getTime());

		}

		var req = new XMLHttpRequest();
		req.open('GET', endpoint, true);
		req.onload = function () {
			// The Forecast API sends a response header with an expiry date for the data for most combinations of parameters.
			// If the option is set and the expiry available, the option's callback will be called at expiration time.
			
			var expire = this.getResponseHeader('Expires');
			if ( expire != null && options && options.expired instanceof Function ) {
				var timeout = new Date(expire);
				timeout = new Date() - timeout;

				window.setTimeout(options.expired, timeout);
			}

			var res = new Forecast.Response(this.responseText);
			callback(res);
		};
		req.send();
	}
};


Forecast.Response = function (apiJson) {
	this._rawData = JSON.parse(apiJson);
	this._currently = null;
	this._minutely = null;
	this._hourly = null;
	this._daily = null;
	this._alerts = null;
};

Forecast.Response.prototype = {
	constructor: Forecast.Response,

	getLatitude: function () {
		return this._rawData.latitude;
	},

	getLongitude: function () {
		return this._rawData.longitude;
	},

	getTimezone: function () {
		return this._rawData.timezone;
	},

	getOffset: function () {
		return this._rawData.offset;
	},

	getCurrently: function () {
		if ( this._currently == null )
			this._currently = new Forecast.Data.Point(this._rawData.currently);
		return this._currently;
	},

	getMinutely: function () {
		if ( this._minutely == null )
			this._minutely = Forecast.Data.Block(this._rawData.minutely);
		return this._minutely;
	},

	getHourly: function () {
		if ( this._hourly == null )
			this._hourly = Forecast.Data.Block(this._rawData.hourly);
		return this._hourly;
	},

	getDaily: function () {
		if ( this._daily == null )
			this._daily = Forecast.Data.Block(this._rawData.daily);
		return this._daily;
	},

	getRawCurrently: function () {
		return this._rawData.currently;
	},

	getRawMinutely: function () {
		return this._rawData.minutely;
	},

	getRawHourly: function () {
		return this._rawData.hourly;
	},

	getRawDaily: function () {
		return this._rawData.daily;
	},

	getAlerts: function () {
		if ( this._alerts == null )
			this._alerts = this._rawData.alerts.map(function (v) {
					return new Forecast.Data.Alert(v);
				});

		return this._alerts;
	},

	getFlags: function () {
		return new Forecast.Data.Flags(this._rawData.flags);
	}

};

Forecast.Data = {};

Forecast.Data.Block = function (rawBlock) {
	var block = rawBlock.data.map( function (v) {
		return new Forecast.Data.Point(v);
	});
	block.summary = rawBlock.summary;
	block.icon = rawBlock.icon;

	return block;
};


Forecast.Data.Point = function (rawPoint) {
	this._rawPoint	= rawPoint;
};

Forecast.Data.Point.prototype = {
	constructor: Forecast.Data.Point,

	getTime: function () {
		return this._rawPoint.time;
	},

	getSummary: function () {
		return this._rawPoint.summary;
	},

	getIcon: function () {
		return this._rawPoint.icon;
	},

	getSunriseTime: function () {
		return this._rawPoint.sunriseTime;
	},

	getSunsetTime: function () {
		return this._rawPoint.sunsetTime;
	},

	getMoonPhase: function () {
		return this._rawPoint.moonPhase;
	},

	getNearestStormDistance: function () {
		return this._rawPoint.nearestStormDistance;
	},

	getNearestStormBearing: function () {
		return this._rawPoint.nearestStormBearing;
	},

	getPrecipIntensity: function () {
		return this._rawPoint.precipIntensity;
	},

	getPrecipIntensityMax: function () {
		return this._rawPoint.precipIntensityMax;
	},

	getPrecipIntensityMaxTime: function () {
		return this._rawPoint.precipIntensityMaxTime;
	},

	getPrecipProbability: function () {
		return this._rawPoint.precipProbability;
	},

	getPrecipType: function () {
		return this._rawPoint.precipType;
	},

	getPrecipAccumulation: function () {
		return this._rawPoint.precipAccumulation;
	},

	getTemperature: function () {
		return this._rawPoint.temperature;
	},

	getTemperatureMin: function () {
		return this._rawPoint.temperatureMin;
	},

	getTemperatureMinTime: function () {
		return this._rawPoint.temperatureMinTime;
	},

	getTemperatureMax: function () {
		return this._rawPoint.temperatureMax;
	},

	getTemperatureMaxTime: function () {
		return this._rawPoint.temperatureMaxTime;
	},

	getApparentTemperature: function () {
		return this._rawPoint.apparentTemperature;
	},

	getApparentTemperatureMin: function () {
		return this._rawPoint.apparentTemperatureMin;
	},

	getApparentTemperatureMinTime: function () {
		return this._rawPoint.apparentTemperatureMinTime;
	},

	getApparentTemperatureMax: function () {
		return this._rawPoint.apparentTemperatureMax;
	},

	getApparentTemperatureMaxTime: function () {
		return this._rawPoint.apparentTemperatureMaxTime;
	},

	getDewPoint: function () {
		return this._rawPoint.dewPoint;
	},

	getWindSpeed: function () {
		return this._rawPoint.windSpeed;
	},

	getWindBearing: function () {
		return this._rawPoint.windBearing;
	},

	getCloudCover: function () {
		return this._rawPoint.cloudCover;
	},

	getHumidity: function () {
		return this._rawPoint.humidity;
	},

	getPressure: function () {
		return this._rawPoint.pressure;
	},

	getVisibility: function () {
		return this._rawPoint.visibility;
	},

	getOzone: function () {
		return this._rawPoint.ozone;
	}
};



Forecast.Data.Alert = function (rawAlert) {
	this._rawAlert = rawAlert;
};

Forecast.Data.Alert.prototype = {
	constructor: Forecast.Data.Alert,

	getTitle: function () {
		return this._rawAlert.title;
	},

	getExpires: function () {
		return this._rawAlert.expires;
	},

	getDescription: function () {
		return this._rawAlert.description;
	},

	getUri: function () {
		return this._rawAlert.uri;
	}
};



Forecast.Data.Flags = function (rawFlags) {
	this._rawFlags = rawFlags;
};

Forecast.Data.Flags.prototype = {
	constructor: Forecast.Data.Flags,

	getDarkskyUnavailable: function () {
		return this._rawFlags['darksky-unavailable'];
	},

	getDarkskyStations: function () {
		return this._rawFlags['darksky-stations'];
	},

	getDatapointStations: function () {
		return this._rawFlags['datapoint-stations'];
	},

	getIsdStations: function () {
		return this._rawFlags['isd-stations'];
	},

	getLampStations: function () {
		return this._rawFlags['lamp-stations'];
	},

	getMetarStations: function () {
		return this._rawFlags['metar-stations'];
	},

	getMetnoLicense: function () {
		return this._rawFlags['metno-license'];
	},

	getSources: function () {
		return this._rawFlags.sources;
	},

	getUnits: function () {
		return this._rawFlags.units;
	}
};