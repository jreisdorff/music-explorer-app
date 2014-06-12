#Introduction

App that allows you to look at bands you've liked on Facebook. 

Written using AngularJS, Facebook Graph API, and Twitter Bootstrap.

#General

##app.js

This is where I've layed out the angularJS code which makes calls to the Facebook graph API. 


Angular service functions:

##getMusicPics(FB, pagingUrl)

Arguments: 
FB - Used to check login status, then make the API call

pagingUrl - Used to get more recently liked bands

This function, when the pagingUrl variable is not present (on the first call), returns the user's 27 most recently liked Facebook music pages via the following graph API call (The number 27 is hardcoded simply for demonstration purposes):

###/v2.0/me?fields=music.limit(27)

The music field that is returned is an array that has the name, category, and id of each band.

If the user has more than 27 bands liked, the data returned on the first call includes a paging URL. Calling that paging URL retrieves the next 27 most recently liked bands. Both the initial call and each paging call use this same function to call the graph API.

Once returned, this data is set to the music scope. To access values in this scope we can simply write the following:

music.data.name (retrieves band name) or
music.data.category (retrieves band category)

##getMusicDetails(FB, bandId)

This function is used to retrieve details about a particular band/musician. The following graph API call is used:

###/v2.0/bandId?fields=about,name,cover

The fields returned by this call include about (usually a short description/tagline of the band), name (again), and cover array which includes a cover photo id, and a field called source which is a direct link to that pages cover photo.

The results are then set to the details scope, which we access in the html via:

details.about
details.cover.source (the direct link to the cover photo)
