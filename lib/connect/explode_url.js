var explode_url = exports = module.exports = function( req, resp, next ) {
	var url = req.url.split('?')[0],
		url_count = 0,
		data = {},
		i = 1;

	url = url.split('/');
	url.shift();

	url_count = url.length;

	for( ;i<url_count;i++ ) {
		if( parseInt( url[i-1] ) != url[i-1] ) {
			data[ url[i-1] ] = parseInt( url[i] ) == url[i] ? parseInt( url[i] ) : url[i];
		}
	}

	req.url_parts = url;
	req.url_data = data;

	next();
};