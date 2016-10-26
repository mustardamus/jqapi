//http://devthought.com/blog/client-side/2009/04/javascript-regexp-based-highlighting-function-for-mootools-and-jquery/

jQuery.fn.extend({
	highlight: function(search, insensitive, klass){
		var regex = new RegExp('(<[^>]*>)|(\\b'+ search.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1") +')', insensitive ? 'ig' : 'g');
		return this.html(this.html().replace(regex, function(a, b, c){
			return (a.charAt(0) == '<') ? a : '<strong class="'+ klass +'">' + c + '</strong>'; 
		}));
	}
});