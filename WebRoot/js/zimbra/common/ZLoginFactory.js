/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZLoginFactory = function() {}

ZLoginFactory.USER_ID = "ZLoginUserName";
ZLoginFactory.PASSWORD_ID = "ZLoginPassword";
ZLoginFactory.REMEMBER_ME_ID = "rememberMe";
ZLoginFactory.REMEMBER_ME_CONTAINER_ID = "ZLoginRememberMeContainer"
ZLoginFactory.NEW_PASSWORD_ID = "newpass1";
ZLoginFactory.NEW_PASSWORD_TR_ID = "ZLoginNewPassword1Tr";
ZLoginFactory.PASSWORD_CONFIRM_TR_ID = "ZLoginNewPassword2Tr";
ZLoginFactory.PASSWORD_CONFIRM_ID = "newpass2";
ZLoginFactory.LOGIN_BUTTON_ID = "ZLoginButton";
ZLoginFactory.MORE_ID = "ZLoginMore";
ZLoginFactory.TWO_FACTOR_CODE = "ZTwoFactorCode";
ZLoginFactory.TWO_FACTOR_CODE_FORM = "ZTwoFactorCodeForm";
ZLoginFactory.TWO_FACTOR_CODE_TR_ID = "ZTwoFactorCodeTd";
ZLoginFactory.TWO_FACTOR_CODE_LABEL = "ZTwoFactorCodeLabel";
ZLoginFactory.TWO_FACTOR_RESEND_CODE_LINK_A_ID = "ZTwoFactorResendCodeLinkA";
ZLoginFactory.TWO_FACTOR_CODE_RESENT_STATUS_SPAN_ID = "ZTwoFactorCodeResentStatusSpan";
ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_TR_ID = "ZTwoFactorChooseMethodTr";
ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_LINK_A_ID = "ZTwoFactorChooseMethodLinkA";
ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_FORM = "ZTwoFactorChooseMethodForm";
ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_NEXT_BUTTON = "ZTwoFactorChooseMethodNextButton";
ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_BACK_BUTTON = "ZTwoFactorChooseMethodBackButton";
ZLoginFactory.TWO_FACTOR_METHOD_OPTION_CONTAINER_TD_ID = "ZTwoFactorMethodOptionContainerTD";
ZLoginFactory.VERIFY_BUTTON_ID = "ZTwoFactorVerifyButton";

// Constants for tabbing through the login controls.
ZLoginFactory.TEXT_TYPE = 0;
ZLoginFactory.CHECKBOX_TYPE = 1;
ZLoginFactory.BUTTON_TYPE = 2;

ZLoginFactory.TAB_ORDER = [ZLoginFactory.USER_ID, ZLoginFactory.PASSWORD_ID, 
					 ZLoginFactory.NEW_PASSWORD_ID, ZLoginFactory.PASSWORD_CONFIRM_ID,
					 ZLoginFactory.REMEMBER_ME_ID, ZLoginFactory.LOGIN_BUTTON_ID, ZLoginFactory.VERIFY_BUTTON_ID];
ZLoginFactory.VISIBILITY = [ZLoginFactory.USER_ID, ZLoginFactory.PASSWORD_ID, 
					  ZLoginFactory.NEW_PASSWORD_TR_ID, ZLoginFactory.PASSWORD_CONFIRM_TR_ID,
					  ZLoginFactory.REMEMBER_ME_CONTAINER_ID, ZLoginFactory.LOGIN_BUTTON_ID, ZLoginFactory.VERIFY_BUTTON_ID];
ZLoginFactory.TAB_TYPE = [ZLoginFactory.TEXT_TYPE, ZLoginFactory.TEXT_TYPE, 
					ZLoginFactory.TEXT_TYPE, ZLoginFactory.TEXT_TYPE,
					ZLoginFactory.CHECKBOX_TYPE, ZLoginFactory.BUTTON_TYPE];
				
/**
 * Creates a copy of the default login parameters.
 * 
 * @param msgs	The class where localized messages are defined. ZmMsg for example.
 */
ZLoginFactory.copyDefaultParams = 
function(msgs) {
	return {
		showPanelBorder: true,
		
		companyURL : msgs["splashScreenCompanyURL"] || "",
	
		shortVersion : "",
		longVersion : "",
	
		appName : msgs["splashScreenAppName"] || "",
		productName : "",
	
		showError : false,
		errorMsg : "",
		
		showLongVersion:false,
		showAbout : false,
		aboutMsg : "",
	
		showLoading : false,
		loadingMsg : msgs["splashScreenLoading"] || "",
		
		showForm : false,
		
		showUserField : false,
		userNameMsg : msgs["username"] ? msgs["username"] + ':' : "",
		
		showMoreField : false,
				moreMsg : msgs["more"] || "",

		showPasswordField : false,
		passwordMsg : msgs["password"] ? msgs["password"] + ':' : "",
		
		showNewPasswordFields : false,
		newPassword1Msg : msgs["newPassword"] + ':'|| "",
		newPassword2Msg : msgs["confirm"] + ':'|| "",
	
		showLicenseMsg : false,
		licenseMsg : "",
		
		showRememberMeCheckbox : false,
		rememberMeMsg : msgs["rememberMe"] || "",
	
		showLogOff : false,
		logOffMsg : msgs["loginAsDiff"] || "",
		logOffAction : "",
		
		showButton : true,
		buttonName : msgs["login"] || "",
		
		copyrightText : msgs["splashScreenCopyright"] || "",

		twoFactorCodeTitle: msgs["twoFactorCodeTitle"] || "",
		twoFactorCodeLabel: msgs["twoFactorCodeLabel"] + ':' || "",
		twoFactorCodeButton: msgs["twoFactorCodeButton"] || "",
	};
};

// show and hide various things
ZLoginFactory.getLoginPanel = function () 			{												
	var retval = document.getElementsByName("loginForm");

	return retval;
	
}

ZLoginFactory.showErrorMsg = function (msg) {
	this.setHTML("ZLoginErrorMsg", msg);
	this.show("ZLoginErrorPanel");
	this._flickerErrorMessagePanel();
}
ZLoginFactory.hideErrorMsg = function () 			{												this.hide("ZLoginErrorPanel");	}
ZLoginFactory.getErrorMsgPanel = function () 		{												return this.get("ZLoginErrorPanel");	}

ZLoginFactory.showAboutMsg = function (msg) 		{	this.setHTML("ZLoginAboutPanel", msg);		this.show("ZLoginAboutPanel");	}
ZLoginFactory.hideAboutMsg = function () 			{												this.hide("ZLoginAboutPanel");	}
ZLoginFactory.getAboutMsg = function () 			{												return this.get("ZLoginAboutPanel");	}

ZLoginFactory.showLoadingMsg = function (msg)		{	this.setHTML("ZLoginLoadingMsg", msg);		this.show("ZLoginAboutPanel");	}
ZLoginFactory.hideLoadingMsg = function () 		{													this.hide("ZLoginAboutPanel");	}
ZLoginFactory.getLoadingMsg = function () 		{													return this.get("ZLoginAboutPanel");	}

ZLoginFactory.showForm = function ()				{												this.show("ZLoginFormPanel");	}
ZLoginFactory.hideForm = function () 				{												this.hide("ZLoginFormPanel");	}
ZLoginFactory.getForm = function () 				{												return this.get("ZLoginFormPanel");	}

ZLoginFactory.showMoreField = function (name)		   {	   this.setValue(ZLoginFactory.MORE_ID, name);							 this.show(ZLoginFactory.MORE_ID);	   }
ZLoginFactory.hideMoreField = function ()					   {																							   this.hide(ZLoginFactory.MORE_ID);	   }
ZLoginFactory.getMoreField = function ()						{																							   return this.get(ZLoginFactory.MORE_ID); }

ZLoginFactory.showUserField = function (name)		{	this.setValue(ZLoginFactory.USER_ID, name);				this.show(ZLoginFactory.USER_ID);	}
ZLoginFactory.hideUserField = function () 			{												this.hide(ZLoginFactory.USER_ID);	}
ZLoginFactory.getUserField = function () 			{												return this.get(ZLoginFactory.USER_ID);	}

ZLoginFactory.showPasswordField = function (msg)	{	this.show(ZLoginFactory.PASSWORD_ID);	}
ZLoginFactory.hidePasswordField = function () 		{	this.hide(ZLoginFactory.PASSWORD_ID);	}
ZLoginFactory.getPasswordField = function () 		{	return this.get(ZLoginFactory.PASSWORD_ID);	}

ZLoginFactory.showNewPasswordFields = function ()	{	this.show(ZLoginFactory.NEW_PASSWORD_TR_ID); this.show(ZLoginFactory.PASSWORD_CONFIRM_TR_ID);	}
ZLoginFactory.hideNewPasswordFields = function () 	{	this.hide(ZLoginFactory.NEW_PASSWORD_TR_ID); this.hide(ZLoginFactory.PASSWORD_CONFIRM_TR_ID);	}
ZLoginFactory.areNewPasswordFieldsShown = function (){	return this.isShown(ZLoginFactory.NEW_PASSWORD_TR_ID); }

ZLoginFactory.getNewPasswordField = function () 	{	return this.get(ZLoginFactory.NEW_PASSWORD_ID); }
ZLoginFactory.getPasswordConfirmField = function () {	return this.get(ZLoginFactory.PASSWORD_CONFIRM_ID); }

ZLoginFactory.showRememberMeCheckbox = function ()	{	this.show(ZLoginFactory.REMEMBER_ME_CONTAINER_ID);	}
ZLoginFactory.hideRememberMeCheckbox = function ()	{	this.hide(ZLoginFactory.REMEMBER_ME_CONTAINER_ID);	}

ZLoginFactory.showLogOff = function ()	{	this.show("ZLoginLogOffContainer");	}
ZLoginFactory.hideLogOff = function ()	{	this.hide("ZLoginLogOffContainer");	}

ZLoginFactory.setLoginButtonName = function (name) 	{	this.setHTML("ZLoginButtonText", name);	}
ZLoginFactory.setLoginButtonAction = function (method) {	var el = document.getElementById(ZLoginFactory.LOGIN_BUTTON_ID); if (el) el.onclick = method	}
ZLoginFactory.getLoginButton = function () 		{	return this.get(ZLoginFactory.LOGIN_BUTTON_ID);	}

ZLoginFactory.showTwoFactorCodeForm = function () { this.show(ZLoginFactory.TWO_FACTOR_CODE_FORM); }
ZLoginFactory.hideTwoFactorCodeForm = function () { this.hide(ZLoginFactory.TWO_FACTOR_CODE_FORM); }

ZLoginFactory.showTwoFactorChooseMethod = function () { this.show(ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_FORM); }
ZLoginFactory.hideTwoFactorChooseMethod = function () { this.hide(ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_FORM); }

ZLoginFactory.showTwoFactorCode = function () {
	this.hideForm();
	this.showTwoFactorCodeForm();
}

ZLoginFactory.getLoginDialogHTML = function (params) {
	var html = [
		"<div ", (params.showAbout ? " " : "class='center'"), ">",
			"<div class='contentBox'>",
				"<h1><a href='" + params.companyURL + "' id='bannerLink' target='_new'>",
					"<span class='ImgLoginBanner'></span>",
				"</a></h1>",
				"<div id='ZLoginErrorPanel' ", (params.showError ? " " :  "style='display:none'"), ">",
					"<table><tr><td width='40'><div class='ImgCritical_32'></div></td><td width='*'><span class='errorText' id='ZLoginErrorMsg'></span></td></tr></table>",
				"</div>",
				"<form name='loginForm' method='POST'>",
					"<table class='form' id='ZLoginFormPanel'", (params.showForm ? " " : "style='display:none'"),">",
					"<tr ", (params.showMoreField ? " " : "style='display:none'"), ">",
						"<td></td>",
						"<td><span class='Img ImgInformation_xtra_small'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><label for='", ZLoginFactory.MORE_ID, "'>",params.moreMsg,"</label></td>",
					"</tr>",
					"<tr ", (params.showLoading ? " " : "style='display:none'"), ">",
						"<td colspan=2 class='ZLoadingMessage'>" , params.loadingMsg, "</td>",
					"</tr>",
					"<tr id='ZLoginLicenseMsgContainer' ", (params.showLicenseMsg ? " " : "style='display:none'"), ">",
						"<td colspan=3 id='ZLoginLicenseMsg'>", params.licenseMsg, "</td>",
					"</tr>",
					"<tr ", (params.showUserField ? " " : "style='display:none'"), ">",
						"<td><label for='", ZLoginFactory.USER_ID, "'>",params.userNameMsg,"</label></td>",
						"<td><input id='", ZLoginFactory.USER_ID, "' name='", ZLoginFactory.USER_ID, "' class='zLoginField' type='text' size='40' autocomplete=OFF/></td>",
					"</tr>",
					"<tr ", (params.showPasswordField ? " " : "style='display:none'"), ">",
						"<td><label for=",ZLoginFactory.PASSWORD_ID,">", params.passwordMsg,"</label></td>",
						"<td><input id=",ZLoginFactory.PASSWORD_ID," class='zLoginField' name=",ZLoginFactory.PASSWORD_ID," type='password' autocomplete=OFF size='40'/></td>",
					"</tr>",
					"<tr id=", ZLoginFactory.NEW_PASSWORD_TR_ID, (params.showNewPasswordFields ? " " : " style='display:none'"), ">",
						"<td><label for='", ZLoginFactory.NEW_PASSWORD_ID, "'>", params.newPassword1Msg, "</label></td>",
						"<td><input id='", ZLoginFactory.NEW_PASSWORD_ID, "' class='zLoginField' name='", ZLoginFactory.NEW_PASSWORD_ID, "' type='password' autocomplete=OFF size='40'/></td>",
					"</tr>",
					"<tr id=", ZLoginFactory.PASSWORD_CONFIRM_TR_ID, (params.showNewPasswordFields ? " " : " style='display:none'"), ">",
						"<td><label for='", ZLoginFactory.PASSWORD_CONFIRM_ID, "'>", params.newPassword2Msg, "</label></td>",
						"<td><input id='", ZLoginFactory.PASSWORD_CONFIRM_ID, "' class='zLoginField' name='", ZLoginFactory.PASSWORD_CONFIRM_ID, "' type='password' autocomplete=OFF size='40'/></td>",
					"</tr>",
					"<tr>",
						"<td>&nbsp;</td>",
						"<td class='submitTD'>",
							"<input id='", ZLoginFactory.LOGIN_BUTTON_ID, "' class='ZLoginButton DwtButton' type='button' onclick='", params.loginAction, ";return false' value='",params.buttonName,(params.showButton ?"'/>" :"' style='display:none'/>"),
							"<input id='", ZLoginFactory.REMEMBER_ME_ID, "' value='1' type='checkbox' name='", ZLoginFactory.REMEMBER_ME_ID, "'  ", (params.showRememberMeCheckbox ? "" : "style='display:none'"), "/>",
							"<label ", (params.showRememberMeCheckbox ? "" : "style='display:none'"), " for='", ZLoginFactory.REMEMBER_ME_ID, "'>", params.rememberMeMsg, "</label>",
						"</td>",
					"</tr>",	
					"</table>",
					"<table class='form' id='", ZLoginFactory.TWO_FACTOR_CODE_FORM, "'", (params.showTwoFactorForm ? " " : "style='display:none'"), " >",
						"<tr>",
							"<td colspan=2 class='ZTwoFactorMessage'>" , params.twoFactorCodeTitle, "</td>",
						"</tr>",
						"<tr id='", ZLoginFactory.TWO_FACTOR_CODE_TR_ID, "' style='display:none'>",
							"<td style='text-align:left'><label id='", ZLoginFactory.TWO_FACTOR_CODE_LABEL, "' for='", ZLoginFactory.TWO_FACTOR_CODE, "'>", params.twoFactorCodeLabel, "</label></td>",
							"<td style='text-align:right'>",
								"<a id='", ZLoginFactory.TWO_FACTOR_RESEND_CODE_LINK_A_ID, "' class='ZTwoFactorResendCode' href='#' style='display:none'>", ZaMsg.twoFactorAuthResendEmail, "</a>",
								"<span id='", ZLoginFactory.TWO_FACTOR_CODE_RESENT_STATUS_SPAN_ID, "' class='ZTwoFactorCodeResent' href='#' style='display:none'>", ZaMsg.twoFactorAuthResendEmailDone, "</span>",
							"</td>",
						"</tr>",
						"<tr>",
							"<td colspan=2'><input id='", ZLoginFactory.TWO_FACTOR_CODE, "' name='", ZLoginFactory.TWO_FACTOR_CODE, "' class='zLoginField' type='text' autocomplete='off' size='40' ></td>",
						"</tr>",
						"<tr id='" , ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_TR_ID, "' style='text-align:right; display:none'>",
							"<td colspan=2><a id='", ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_LINK_A_ID, "' class='ZTwoFactorChooseMethodLink' href='#'>", ZaMsg.twoFactorAuthChooseOtherMethod, "</a></td>",
						"</tr>",
						"<tr>",
							"<td>&nbsp;</td>",
							"<td class='submitTD'>",
								"<input id='", ZLoginFactory.VERIFY_BUTTON_ID, "' class='ZLoginButton DwtButton' type='button' onclick='", params.loginAction, ";return false' value='", params.twoFactorCodeButton, "' />",
							"</td>",
						"</tr>",
					"</table>",
					"<table class='form' id='", ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_FORM, "' style='display:none'>",
						"<tr>",
							"<td colspan=2 class='ZTwoFactorMessage'>" , params.twoFactorCodeTitle, "</td>",
						"</tr>",
						"<tr class='ZTwoFactorMethodDescription'>",
							"<td colspan=2>", ZaMsg.twoFactorAuthChooseOtherMethodDescription, "</td>",
						"</tr>",
						"<tr class='ZTwoFactorMethodOptionContainer'>",
							"<td colspan=2 id='", ZLoginFactory.TWO_FACTOR_METHOD_OPTION_CONTAINER_TD_ID, "'</td>",
						"</tr>",
						"<tr>",
							"<td class='submitTD ZTwoFactorNextButton'>",
								"<input id='", ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_NEXT_BUTTON, "' class='ZLoginButton DwtButton' type='button' value='", ZaMsg.Next, "' />",
							"</td>",
							"<td class='submitTD ZTwoFactorBackButton'>",
								"<input id='", ZLoginFactory.TWO_FACTOR_CHOOSE_METHOD_BACK_BUTTON, "' class='ZLoginButton DwtButton' type='button' value='", ZaMsg.twoFactorAuthChooseMethodBack, "' />",
							"</td>",
						"</tr>",
					"</table>",
				"</form>",
				"<div id='ZLoginAboutPanel' ", (params.showAbout ? "" : "style='display:none'"), ">", params.aboutMsg,
				"</div>",	
				"<div id='ZLoginLongVersion' class='version' ", (params.showLongVersion ? "" : "style='display:none'"), ">", params.longVersion, "</div>",
			"</div>",
			"<div class='decor1'></div>",
		"</div>",
		"<div class='Footer'>",
			"<div id='ZLoginNotice'>",params.clientLevelNotice,"</div>",
			"<div class='copyright'>",params.copyrightText,"</div>",
	"</div>",
	"<div class='decor2'></div>"
	].join("");
	return html;
}


// simple API to show/hide elements (can be replaced with Dwt if desired)
ZLoginFactory.setHTML = function (id, newContent) {
	var el = document.getElementById(id);
	if (el && newContent != null) el.innerHTML = newContent;
}

ZLoginFactory.setValue = function (id, newContent) {
	var el = document.getElementById(id);
	if (el && newContent != null) el.value = newContent;
}

ZLoginFactory.show = function (id, newContent) {
	var el = document.getElementById(id);
	if (el) el.style.display = "";
}

ZLoginFactory.isShown = function (id) {
	var el = document.getElementById(id);
	return el ? (el.style.display != "none") : false;
}

ZLoginFactory.hide = function (id) {
	var el = document.getElementById(id);
	if (el) el.style.display = "none";
}

ZLoginFactory.get = function (id) {
	return document.getElementById(id);
}

ZLoginFactory.handleKeyPress =
function(ev) {
	ev = ev || window.event;
	if (ev == null) {
		return true;
	}
	var target = ev.target ? ev.target: ev.srcElement;
	if (!target) {
		return true;
	}
	var keyCode = ev.keyCode;
	var fakeTabKey = false;
	if (keyCode == 13) { // Enter
		if (target.id == ZLoginFactory.USER_ID || target.id == ZLoginFactory.NEW_PASSWORD_ID) {
			fakeTabKey = true;
		} else {
			// Call the login action
			var loginAction = ZLoginFactory.get(ZLoginFactory.LOGIN_BUTTON_ID).onclick;
			if (loginAction) {
				loginAction.call(target);
			}
			ZLoginFactory._cancelEvent(ev);
			return false;
		}
	}
	if (fakeTabKey || (keyCode == 9)) { // Tab
		var startIndex = ZLoginFactory.TAB_ORDER.length - 1;
		for (var i = 0; i < ZLoginFactory.TAB_ORDER.length; i++) {
			if (ZLoginFactory.TAB_ORDER[i] == target.id) {
				startIndex = i;
				break;
			}
		}
		var forward = !ev.shiftKey;
		var tabToIndex = ZLoginFactory._getTabToIndex(startIndex, forward);
		var tabToId = ZLoginFactory.TAB_ORDER[tabToIndex];
		var tabToType = ZLoginFactory.TAB_TYPE[tabToIndex];
		ZLoginFactory._onFocusChange(tabToType, tabToId, target);
		ZLoginFactory._cancelEvent(ev);
	}
}

// Private / protected methods

ZLoginFactory._cancelEvent =
function(ev) {
	if (ev.stopPropagation)
		ev.stopPropagation();

	if (ev.preventDefault)
		ev.preventDefault();

	ev.cancelBubble = true;
	ev.returnValue = false;
}

ZLoginFactory._onFocusChange =
function(type, id, target) {
	if (type == ZLoginFactory.TEXT_TYPE) {
		var edit = ZLoginFactory.get(id);
		edit.focus();
		edit.select();
	} else if (type == ZLoginFactory.CHECKBOX_TYPE) {
		var checkbox = ZLoginFactory.get(id);
		checkbox.focus();
	}
	else {
		var button = ZLoginFactory.get(id);
		button.focus();
	}
};

ZLoginFactory._getTabToIndex =
function(startIndex, forward) {
	var testIndex = startIndex;
	do {
		var tabToIndex;
		if (forward) {
			testIndex = (testIndex == (ZLoginFactory.TAB_ORDER.length - 1)) ? 0 : testIndex + 1;
		} else {
			testIndex = (testIndex == 0) ? (ZLoginFactory.TAB_ORDER.length - 1) : testIndex - 1;
		}
		var id = ZLoginFactory.TAB_ORDER[testIndex];
		var visibilityId = ZLoginFactory.VISIBILITY[testIndex];
		var control = ZLoginFactory.get(id);
		if (ZLoginFactory.isShown(visibilityId) && !ZLoginFactory.get(id).disabled) {
			return testIndex
		}
	} while (testIndex != startIndex);
	return 0; // Should never get here.
}
					 
ZLoginFactory._loginButtonFocus =
function(border) {
	border.className = "DwtButton-focused";
};

/*
* Hide error panel very briefly, making it look like something happened if
* user has successive errors.
*/
ZLoginFactory._flickerErrorMessagePanel =
function() {
	ZLoginFactory.getErrorMsgPanel().style.visibility = "hidden";
	window.setTimeout(ZLoginFactory._showErrorMessagePanel, 8);
};

ZLoginFactory._showErrorMessagePanel =
function() {
	ZLoginFactory.getErrorMsgPanel().style.visibility = "visible";
};
