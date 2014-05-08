Forecast.io.js
==========

A javascript library for customised requests to the Forecast.io weather API.
For a documentation of the API refer to [Forecast.io][docs].

[docs]: https://developer.forecast.io/docs/v2

<b>Forecast (</b><i> apikey </i><b>)</b><br>
Creates a new Forecast object that manages your API key.

<b>Forecast.getForecast (</b><i> lat, long, callback, options </i><b>)</b><br>
Send a request to the Forecast.io servers.<br>
* <code>lat</code>  The latitude for the forecast<br>
* <code>long</code>  The longitude for the forecast<br>
* <code>callback( Forecast.Response )</code> The callback to be invoked when a response is received<br>
* <code>options</code> An object with options to customise the request:

<b>Options</b><br>
* <code>time</code> The time for the forecast<br>
* <code>units</code> The unit of the forecast<br>
* <code>exclude</code> Comma separated String or Array of fields to exclude from the response<br>
* <code>extend</code> Flag if the extend parameter should be appended to the request<br>
* <code>nocache</code> Try to prevent the browser from caching request results. This not part of the Forecast API and might not work for all browsers.<br>

<b>Forecast.Response</b><br>
An object containing all data of a Forecast request.
 * The <code>hourly, daily</code> and <code>minutely</code> properties contain <code>Data.Block</code> objects.
 * The <code>flags</code> property contains a <code>Data.Flags</code> object.

<b>Forecast.Data.Block</b><br>
An array containing <code>Data.Point</code> objects. The array has the additional properties <code>summary</code> and <code>icon</code>.

<b>Forecast.Data.Point</b><br>
An object with all the properties described in the [Forecast.io Docs][docs] (e.g. <code>temperature</code>, <code>humidity</code>, <code>windspeed</code> etc.).

<b>Forecast.Data.Flags</b><br>
Contains all properties described in the documentation. Properties with hyphen are camel-cased for easier access:
<code>darkskyUnavailable</code> instead of <code>darksky-unavailable</code>

<b>Usage</b>

    var lat, long;
    ...
    var f = new Forecast("your api key");
    f.getForecast(lat, long, updateWeather, { units: 'si', nocache: true, exclude: ['hourly', 'flags'] });
    
    function updateWeather(forecast) {
        var today = forecast.daily[0];
    
        var div = document.getElementById('weather');
        div.innerHTML = '<span>' + today.temperatureMax + '&deg;</span>';
    
        var summary = document.getElementById('summary');
        summary.innerText = forecast.daily.summary;
    }
