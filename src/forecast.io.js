var Forecast = function (apikey) {
	this._apikey = apikey;
};

Forecast.prototype = {
	constructor: Forecast,

	getForecast: function (lat, long, callback, options) {
		// the url the api request is sent to
		var endpoint = 'https://api.forecast.io/forecast/' + this._apikey;
		endpoint += '/' + lat + ',' + long;

		// if options parameter is initialised, check all possible parameters and modify endpoint
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
				if ( Array.isArray(options.exclude) )
					endpoint += options.exclude.join(',');
				else
					endpoint += options.exclude;
				delim = '&';
			}

			if ( options.extend ) {
				endpoint += delim + 'extend=hourly';
				delim = '&';
			}

			// Not part of the forecast API!
			// The current date is added as a GET parameter to the request URL to prevent the browser from caching results.
			// If it works depends on the browser, do not rely on it.
			if ( options.nocache )
				endpoint += delim + 'nocache=' + (new Date().getTime());

		}

		var req = new XMLHttpRequest();
		req.open('GET', endpoint, true);
		req.onload = function () {
			/* The Forecast API sends a response header with an expiry date for the data for most combinations of parameters.
			// If the option is set and the expiry available, the option's callback will be called at expiration time.
			
			var expire = this.getResponseHeader('Expires');
			if ( expire != null && options && typeof options.expired === 'function' ) {
				var timeout = new Date(expire);
				timeout = new Date() - timeout;

				window.setTimeout(options.expired, timeout);
			}
			*/

			var res = Forecast.Response(this.responseText);
			callback(res);
		};
		req.send();
	}
};


/**
 * Response - An object containing all data of a Forecast request.
 * The <code>hourly, daily</code> and <code>minutely</code> properties contain Data.Block objects.
 * The <code>flags</code> property contains a Data.Flags object.
 */
Forecast.Response = function (apiJson) {
	var data = JSON.parse(apiJson);

	if ( data.minutely )
		data.minutely = Forecast.Data.Block(data.minutely);

	if ( data.hourly )
		data.hourly = Forecast.Data.Block(data.hourly);

	if ( data.daily )
		data.daily = Forecast.Data.Block(data.daily);

	if ( data.flags )
		data.flags = Forecast.Data.Flags(data.flags);

	return data;
};


Forecast.Data = {};

/**
 * Data.Block - An array containing Data.Point objects. The array has the additional properties summary and icon.
 */
Forecast.Data.Block = function (rawBlock) {
	var block = rawBlock.data;
	block.summary = rawBlock.summary;
	block.icon = rawBlock.icon;

	return block;
};

/*
Forecast.Data.Point = function (rawPoint) {
	return rawPoint;
};


Forecast.Data.Alert = function (rawAlert) {
	return rawAlert;
};
*/


/**
 * Data.Flags - Contains all properties described in the documentation. Properties with hyphen are camel-cased:
 * <code>darkskyUnavailable, darkskyStations, datapointStations, isdStations, lampStations, metarStations, metnoLicense</code>
 */
Forecast.Data.Flags = function (rawFlags) {
	this._rawFlags = rawFlags;

	rawFlags.darkskyUnavailable = rawFlags['darksky-unavailable'];
	rawFlags.darkskyStations = rawFlags['darksky-stations'];
	rawFlags.datapointStations = rawFlags['datapoint-stations'];
	rawFlags.isdStations = rawFlags['isd-stations'];
	rawFlags.lampStations = rawFlags['lamp-stations'];
	rawFlags.metarStations = rawFlags['metar-stations'];
	rawFlags.metnoLicense = rawFlags['metno-license'];
};