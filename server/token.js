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

'use strict'; // http://www.w3schools.com/js/js_strict.asp

function Token(session) {
  this._session = session;
}

Token.prototype.getInternalOAuth = function () {
  return this._session.internalOAuth;
};

Token.prototype.setInternalOAuth = function (internalOAuth) {
  this._session.internalOAuth = internalOAuth;
};

Token.prototype.getPublicOAuth = function () {
  return this._session.publicOAuth;
};

Token.prototype.setPublicOAuth = function (publicOAuth) {
  this._session.publicOAuth = publicOAuth;
};

Token.prototype.getInternalCredentials = function () {
  return this._session.internalCredentials;
};

Token.prototype.setInternalCredentials = function (internalCredentials) {
  this._session.internalCredentials = internalCredentials;
};

Token.prototype.getPublicCredentials = function () {
  return this._session.publicCredentials;
};

Token.prototype.setPublicCredentials = function (publicCredentials) {
  this._session.publicCredentials = publicCredentials;
};

Token.prototype.isAuthorized = function () {
  // !! converts value into boolean
  return (!!this._session.publicCredentials);
};

// google token handling

Token.prototype.getGoogleToken = function () {
  return this._session.googletoken;
};

Token.prototype.setGoogleToken = function (token) {
  this._session.googletoken = token;
};

Token.prototype.isGoogleAuthorized = function () {
  return (this._session != null && this._session.googletoken != null);
};

module.exports = Token;
