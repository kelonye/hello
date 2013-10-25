//
// FourSquare
//
(function(){

function formatError(o){
	if(o.meta&&o.meta.code===400){
		o.error = {
			code : "access_denied",
			message : o.meta.errorDetail
		};
	}
}

function formatUser(o){
	if(o&&o.id){
		o.thumbnail = o.photo.prefix + '100x100'+ o.photo.suffix;
		o.name = o.firstName + ' ' + o.lastName;
		o.first_name = o.firstName;
		o.last_name = o.lastName;
		if(o.contact){
			if(o.contact.email){
				o.email = o.contact.email;
			}
		}
	}
}

function paging(res){
	
}


hello.init({
	foursquare : {

		name : 'FourSquare',

		oauth : {
			version : 2,
			auth : 'https://foursquare.com/oauth2/authenticate'
		},

		// Alter the querystring
		querystring : function(qs){
			var token = qs.access_token;
			delete qs.access_token;
			qs.oauth_token = token;
			qs.v = 20121125;
		},

		base : 'https://api.foursquare.com/v2/',

		get : {
			'me' : 'users/self',
			'me/friends' : 'users/self/friends',
			'me/followers' : 'users/self/friends',
			'me/following' : 'users/self/friends'
		},
		wrap : {
			me : function(o){
				formatError(o);
				if(o && o.response){
					o = o.response.user;
					formatUser(o);
				}
				return o;
			},
			'default' : function(o){
				formatError(o);

				// Format Friends
				if(o && "response" in o && "friends" in o.response && "items" in o.response.friends ){
					o.data = o.response.friends.items;
					delete o.response;
					for(var i=0;i<o.data.length;i++){
						formatUser(o.data[i]);
					}
				}
				return o;
			}
		}
	}
});

})();