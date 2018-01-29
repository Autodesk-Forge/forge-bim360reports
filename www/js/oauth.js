/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

$(document).ready(function () {
  var currentToken = getForgeToken();

  if (window.location.href.indexOf('herokuapp') > 0) {
        $("a").attr("href", 'https://bim360reports.autodesk.io');
        $('#testinEnvWarning').modal('toggle');
  }

  if (currentToken === '')
    $('#signInButton').click(forgeSignIn);
  else {
    getForgeUserProfile(function (profile) {
      $('#signInProfileImage').removeClass(); // remove glyphicon-user
      $('#signInProfileImage').html('<img src="' + profile.picture + '"/>')
      $('#signInButtonText').text(profile.name);
      $('#signInButtonText').attr('title', 'Click to Sign Out');
      $('#signInButton').click(forgeLogoff);
    });
  }
});

function forgeSignIn() {
  jQuery.ajax({
    url: '/user/authenticate',
    success: function (rootUrl) {
      location.href = rootUrl;
    }
  });
}

function forgeLogoff() {
  jQuery.ajax({
    url: '/user/logoff',
    success: function (oauthUrl) {
      location.href = oauthUrl;
    }
  });
}

function getForgeToken() {
  var token = '';
  jQuery.ajax({
    url: '/user/token',
    success: function (res) {
      token = res;
    },
    async: false // this request must be synchronous for the Forge Viewer
  });
  if (token != '') console.log('3 legged token (User Authorization): ' + token); // debug
  return token;
}

function getForgeUserProfile(onsuccess) {
  var profile = '';
  jQuery.ajax({
    url: '/user/profile',
    success: function (profile) {
      onsuccess(profile);
    }
  });
}