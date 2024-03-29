/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


//
//	Factory to create XModelItems from simple attributes (eg: from JS object literals or XML)
//

/**
 * 
 * This class is never instantiated.
 * 
 * @private
 */
XModelItemFactory = function() {}

XModelItemFactory.createItem = function (attributes, parentItem, xmodel) {
	// assign a modelItem to the item
	var type = attributes.type;
	var constructor = this.getItemTypeConstructor(type || _UNTYPED_);

	var item = new constructor();
	item._setAttributes(attributes);
	if (item.id != null && item.ref == null) item.ref = item.id;

	// idPath is mostly used for debugging...
	var idPath = this.getIdPath(attributes, parentItem);
	item.__idPath = idPath;

	item.__xmodel = xmodel;
	item.__parentItem = parentItem;

//DBG.println("XModelItemFactory.createItem(", attributes.id, ") idPath='", idPath, "' type='", item.type,"'");
	item.initModelItem();

	// add the item to its model's index
	xmodel.indexItem(item, idPath);

	return item;
}

XModelItemFactory.getIdPath = function (attributes, parentItem) {
	if (attributes.path) return attributes.path;
	return this.getFullPath(attributes.id, (parentItem ? parentItem.getIdPath() : ""));
}

XModelItemFactory.getFullPath = function (itemPath, parentPath) {
	if (itemPath == null) return null;
	if (parentPath == null) parentPath = "";
	
	var path = itemPath;
	if (itemPath == ".") {
		path = parentPath;

	} else if (itemPath == "..") {
		parentPath = parentPath.split("/");
		path = parentPath.slice(0, parentPath.length - 1).join("/");

	} else if (parentPath == "") {
		path = itemPath;

	} else {
		path = parentPath + "/" + itemPath;
	}
	return path;
}



XModelItemFactory.typeConstructorMap = {};

XModelItemFactory.createItemType = function (typeConstant, typeName, constructor, superClassConstructor) {
	if (constructor == null) constructor = new Function();
	if (typeof superClassConstructor == "string") superClassConstructor = this.getItemTypeConstructor(superClassConstructor);
	if (superClassConstructor == null) superClassConstructor = XModelItem;

	// initialize the constructor
	constructor.prototype = new superClassConstructor();	

	constructor.prototype.type = typeName;
	constructor.prototype.constructor = constructor;
	constructor.prototype.toString = new Function("return '[XModelItem:" + typeName + " path=\"' + this.getIdPath() + '\"]'");
	constructor.toString = new Function("return '[Class XModelItem:" + typeName + "]'");
	
	// put the item type into the typemap
	this.registerItemType(typeConstant, typeName, constructor);

	// return the prototype
	return constructor;
}

XModelItemFactory.registerItemType = function(typeConstant, typeName, constructor) {
	// assign the type constant to the window so everyone else can use it
	window[typeConstant] = typeName;
	this.typeConstructorMap[typeName] = constructor;	
}


XModelItemFactory.getItemTypeConstructor = function (typeName) {
	var typeConstructor = this.typeConstructorMap[typeName];
	if (typeConstructor == null) typeConstructor = this.typeConstructorMap["string"];
	return typeConstructor;
}







XModelItem = function() {}
XModelItemFactory.createItemType("_UNTYPED_", "untyped", XModelItem, Object);

// define the base class as the "object" class -- it works, but no type logic is applied
XModelItemFactory.registerItemType("_OBJECT_", "object", XModelItem);


// set base class defaults

XModelItem.prototype.__isXModelItem = true;
XModelItem.prototype.getterScope = _INHERIT_;
XModelItem.prototype.setterScope = _INHERIT_;

// methods
XModelItem.prototype._setAttributes = function (attributes) {
	this._attributes = attributes;
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}


XModelItem.prototype.initModelItem = function() {
	this._eventMgr = new AjxEventMgr();
}



// initialize sub-items for this item
XModelItem.prototype.initializeItems = function () {
	var items = this.getItems();
	if (items != null) {
		this.items = this.getModel().initItemList(items, this);
	}
}



//
//	accessors
//
XModelItem.prototype.getModel = function() 		{		return this.__xmodel;		}
XModelItem.prototype.getParentItem = function() 	{		return this.__parentItem;	}
XModelItem.prototype.getIdPath = function()	 	{		return this.__idPath;		}


XModelItem.prototype.getItems = function () 		{		return this.items;			}
XModelItem.prototype.addItem = function (item) {
	if (!item.__isXModelItem) item = this.xmodel.initItem(item, this);
	if (this.items == null) this.items = [];
	this.items.push(item);
}


XModelItem.prototype.getConstraints = function()	{		return this.constraints;	}
XModelItem.prototype.getRequired = function()		{		return this.required;		}
XModelItem.prototype.getReadonly = function()		{		return this.readonly;		}
XModelItem.prototype.getCustomRequiredMessage = function()	{		return this.customRequiredMessage;	}
XModelItem.prototype.getCustomErrorMessage = function()		{		return this.customErrorMessage;		}
XModelItem.prototype.getReadOnly = XModelItem.prototype.getReadonly;


XModelItem.prototype.getDefaultValue = function () {return new Object() };


//
//	validate this value (i.e. when a formitem that refers to it has changed)
//

XModel.registerErrorMessage("valueIsRequired", AjxMsg.valueIsRequired);
XModelItem.prototype.validate = function (value, form, formItem, instance) {

	// see if it's required
	if (value == null || value === "") {
		if (this.getRequired()) {
			var errorMessage = this.getCustomRequiredMessage() || "valueIsRequired";
			throw this.getModel().getErrorMessage(errorMessage, value);
		}
    }
    
	// next validate the type
	//	this will throw an exception if something went wrong
	//	also, value may be coerced to a particular type by the validator
	else {
		value = this.validateType(value);
	}
	
	// if they defined any constraints, 
	var constraints = this.getConstraints();
	if (constraints == null) return value;

	if (! (AjxUtil.isInstance(constraints, Array))) constraints = [constraints];
	for (var i = 0; i < constraints.length; i++) {
		var constraint = constraints[i];
		if (constraint.type == "method") {
			// The constraint method should either return a value, or throw an
			// exception.
			value = constraint.value.call(this, value, form, formItem, instance);
		}
// 		if (isValid == false) {
// 			throw this.getModel().getErrorMessage(constraint.errorMessageId, value);
// 		}
	}
	return value;
}

XModelItem.prototype.getDefaultErrorMessage = function () {
	return this.errorMessage;
}


// generic validators for different data types
//	we have them here so we can use them in the _LIST_ data type


XModelItem.prototype.validateType = function(value) {	return value;		}




//
//	for validating strings
//

/**
 * Datatype facet: length. If not null, the length of the data
 * value must be equal to this value. Specifying this attribute
 * ignores the values for {@link XModelItem.prototype.minLength}
 * and {@link XModelItem.prototype.maxLength}.
 */
XModelItem.prototype.length = null;

/**
 * Datatype facet: minimum length. If not null, the length of
 * the data value must not be less than this value.
 */
XModelItem.prototype.minLength = null;

/**
 * Datatype facet: maximum length. If not null, the length of
 * the data value must not exceed this value.
 */
XModelItem.prototype.maxLength = null;

/**
 * Datatype facet: pattern. If not null, specifies an array of
 * <code>RegExp</code> objects. The data value must match one of
 * the patterns or an error is signaled during validation.
 */
XModelItem.prototype.pattern = null;

/**
 * Datatype facet: enumeration. If not null, specifies an array of
 * literal string values. The data value must match one of the
 * literals or an error is signaled during validation.
 */
XModelItem.prototype.enumeration = null;

/**
 * Datatype facet: white space. If not null, specifies how white
 * space in the value should be processed before returning the
 * final value. Valid values are:
 * <ul>
 * <li>"preserve": leaves whitespace as-is (default)
 * <li>"replace": replaces tabs, newlines, and carriage-returns with a space
 * <li>"collapse": same as "replace"  but also trims leading and trailing whitespace and replaces sequences of spaces with a single space
 * </ul>
 */
XModelItem.prototype.whiteSpace = null;

XModelItem.prototype.getLength = function() 		{ return this.length; }
XModelItem.prototype.getMinLength = function () 	{	return this.minLength;				}
XModelItem.prototype.getMaxLength = function () 	{	return this.maxLength;				}
XModelItem.prototype.getPattern = function() {
	if (this.pattern != null && this.pattern.checked == null) {
		if (AjxUtil.isString(this.pattern)) {
			this.pattern = [ new RegExp(this.pattern) ];
		}
		else if (AjxUtil.isInstance(this.pattern, RegExp)) {
			this.pattern = [ this.pattern ];
		}
		else if (AjxUtil.isArray(this.pattern)) {
			for (var i = 0; i < this.pattern.length; i++) {
				var pattern = this.pattern[i];
				if (AjxUtil.isString(pattern)) {
					this.pattern[i] = new RegExp(this.pattern[i]);
				}
			}
		}
		else {
			// REVISIT: What to do in this case? Do we just
			//          assume that it was specified correctly?
		}
		this.pattern.checked = true;
	}
	return this.pattern;
}
XModelItem.prototype.getEnumeration = function() { return this.enumeration; }
XModelItem.prototype.getWhiteSpace = function() { return this.whiteSpace; }

XModel.registerErrorMessage("notAString",		AjxMsg.notAString);
XModel.registerErrorMessage("stringLenWrong",   AjxMsg.stringLenWrong);
XModel.registerErrorMessage("stringTooShort", 	AjxMsg.stringTooShort);
XModel.registerErrorMessage("stringTooLong",	AjxMsg.stringTooLong);
XModel.registerErrorMessage("stringMismatch",   AjxMsg.stringMismatch);

XModelItem.prototype.validateString = function(value) {
	if (value == null) return;
	
	if (!AjxUtil.isString(value)) {
		throw this.getModel().getErrorMessage("notAString", value);
	}

	value = this._normalizeAndValidate(value);

    var length = this.getLength();
    if (length !== null) {
        if (value.length !== length) {
            throw this.getModel().getErrorMessage("stringLenWrong", length);
        }
    }
    else {
		var maxLength = this.getMaxLength();
		if (maxLength !== null && value.length > maxLength) {
			throw this.getModel().getErrorMessage("stringTooLong", maxLength);
		}
	
		var minLength = this.getMinLength();
		if (minLength !== null && value.length < minLength) {
			throw this.getModel().getErrorMessage("stringTooShort", minLength);
		}
    }
    
    return value;
}

XModel.registerErrorMessage("invalidEmailAddr",   AjxMsg.invalidEmailAddr);
XModelItem.prototype.validateEmailAddress = function(value) {
	if (value == null) return;
	
	if (!AjxUtil.isString(value)) {
		throw this.getModel().getErrorMessage("notAString", value);
	}

	value = this._normalizeAndValidate(value);

    var length = this.getLength();
    if (length !== null) {
        if (value.length !== length) {
            throw this.getModel().getErrorMessage("stringLenWrong", length);
        }
    } else {
		var maxLength = this.getMaxLength();
		if (maxLength !== null && value.length > maxLength) {
			throw this.getModel().getErrorMessage("stringTooLong", maxLength);
		}
	
		var minLength = this.getMinLength();
		if (minLength !== null && value.length < minLength) {
			throw this.getModel().getErrorMessage("stringTooShort", minLength);
		}
	    var parts = value.split('@');
		if (!parts || parts[0] == null || parts[0] == ""){
		   // set the name, so that on refresh, we don't display old data.
			throw this.getModel().getErrorMessage("invalidEmailAddr");
		 } else {
			if(!AjxUtil.isValidEmailNonReg(value)) {
			   throw this.getModel().getErrorMessage("invalidEmailAddr");
			}
	  	 }
	}
    return value;
}

/**
 * Normalizes value against whiteSpace facet and then validates 
 * against pattern and enumeration facets.
 * @private
 */
XModelItem.prototype._normalizeAndValidate = function(value) {

	var whiteSpace = this.getWhiteSpace();
	var stringMismatchErrorMessage;
	if (whiteSpace !== null) {
		if (whiteSpace === "replace" || whiteSpace === "collapse") {
			value = value.replace(/[\t\r\n]/g, " ");
		}
		if (whiteSpace === "collapse") {
			value = value.replace(/^\s+/, "").replace(/\s+$/, "").replace(/[ ]+/, " ");
		}
	}

    var pattern = this.getPattern();
    if (pattern != null) {
    	var matched = false;
    	for (var i = 0; i < pattern.length; i++) {
    		if (pattern[i].test(value)) {
    			matched = true;
    			break;
    		}
    	}
		if (!matched) {
			stringMismatchErrorMessage = this.getCustomErrorMessage() || "stringMismatch";
			throw this.getModel().getErrorMessage(stringMismatchErrorMessage, value);
		}    	
    }
    
    var enumeration = this.getEnumeration();
    if (enumeration !== null) {
    	var matched = false;
    	for (var i = 0; i < enumeration.length; i++) {
    		if (enumeration[i] === value) {
    			matched = true;
    			break;
    		}
    	}
    	if (!matched) {
			stringMismatchErrorMessage = this.getCustomErrorMessage() || "stringMismatch";
			throw this.getModel().getErrorMessage(stringMismatchErrorMessage, value);
    	}
    }
    
	return value;
}


//
//	for validating numbers
//

/**
 * Datatype facet: total digits. If not null, the number of
 * digits before the decimal point in the data value must not
 * be greater than this value.
 */
XModelItem.prototype.totalDigits = null;
 
/** 
 * Datatype facet: fraction digits. If not null, the number of
 * digits after the decimal point in the data value must not be
 * greater than this value.
 */
XModelItem.prototype.fractionDigits = null;

/** 
 * Datatype facet: maximum value (inclusive). If not null, the
 * data value must be less than or equal to this value.
 */
XModelItem.prototype.maxInclusive = null;

/** 
 * Datatype facet: maximum value (exclusive). If not null, the
 * data value must be less than this value.
 */
XModelItem.prototype.maxExclusive = null;

/** 
 * Datatype facet: minimum value (inclusive). If not null, the
 * data value must be greater than or equal to this value.
 */
XModelItem.prototype.minInclusive = null;

/** 
 * Datatype facet: minimum value (exclusive). If not null, the
 * data value must be greater than or equal to this value.
 */
XModelItem.prototype.minExclusive = null;


XModelItem.prototype.getTotalDigits = function() { return this.totalDigits; }
XModelItem.prototype.getFractionDigits = function () 	{	return this.fractionDigits;			}
XModelItem.prototype.getMinInclusive = function () 			{	return this.minInclusive;				}
XModelItem.prototype.getMinExclusive = function() { return this.minExclusive; }
XModelItem.prototype.getMaxInclusive = function () 			{	return this.maxInclusive;				}
XModelItem.prototype.getMaxExclusive = function() { return this.maxExclusive; }

/**
 * Registers a listener with the control. The listener will be call when events
 * of type <code>eventType</code> fire
 *
 * @param {String} eventType Event type for which to listen (required)
 * @param {AjxListener} listener Listener to be registered (required)
 * @param index		[int]*			index at which to add listener
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #removeListener
 * @see #removeAllListeners
 * @see #notifyListeners
 */
XModelItem.prototype.addListener =
function(eventType, listener, index) {
	return this._eventMgr.addListener(eventType, listener, index);
};

/**
 * Removes a listener from the control.
 *
 * @param {String} eventType Event type for which to remove the listener (required)
 * @param {AjxListener} listener Listener to be removed (required)
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #addListener
 * @see #removeAllListeners
 */
XModelItem.prototype.removeListener =
function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
};


/**
 * Removes all listeners for a particular event type.
 *
 * @param {String} eventType Event type for which to remove listeners (required)
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #addListener
 * @see #removeListener
 */
XModelItem.prototype.removeAllListeners =
function(eventType) {
	return this._eventMgr.removeAll(eventType);
};

/**
 * Queries to see if there are any listeners registered for a particular event type
 *
 * @param {String} eventType Event type for which to check for listener registration (required)
 *
 * @return True if there is an listener registered for the specified event type
 *
 * @see DwtEvent
 */
XModelItem.prototype.isListenerRegistered =
function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
};

/**
 * Notifys all listeners of type <code>eventType</code> with <code>event</code>
 *
 * @param {String} eventType Event type for which to send notifications (required)
 * @param {DwtEvent} event Event with which to notify. Typically a subclass of
 * 		DwtEvent
 *
 * @see DwtEvent
 */
XModelItem.prototype.notifyListeners =
function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
};

XModel.registerErrorMessage("notANumber",		 AjxMsg.notANumber);
XModel.registerErrorMessage("numberTotalExceeded", AjxMsg.numberTotalExceeded);
XModel.registerErrorMessage("numberFractionExceeded", AjxMsg.numberFractionExceeded);
XModel.registerErrorMessage("numberMoreThanMax", AjxMsg.numberMoreThanMax);
XModel.registerErrorMessage("numberMoreThanEqualMax", AjxMsg.numberMoreThanEqualMax);
XModel.registerErrorMessage("numberLessThanMin", AjxMsg.numberLessThanMin);
XModel.registerErrorMessage("numberLessThanEqualMin", AjxMsg.numberLessThanEqualMin);

XModelItem.prototype.validateNumber = function(value) {
	value = this._normalizeAndValidate(value);

	var nvalue = parseFloat(value);

	if (isNaN(nvalue) || !AjxUtil.FLOAT_RE.test(value)) {
		throw this.getModel().getErrorMessage("notANumber", value);
	}

	var totalDigits = this.getTotalDigits();
	if (this.totalDigits !== null) {
		var wholePart = Math.floor(nvalue);
		if (wholePart.toString().length > totalDigits) {
			throw this.getModel().getErrorMessage("numberTotalExceeded", value, totalDigits);
		}
	}

	var fractionDigits = this.getFractionDigits();
	if (this.fractionDigits !== null) {
		var fractionPart = String(nvalue - Math.floor(nvalue));
		if (fractionPart.indexOf('.') != -1 && fractionPart.replace(/^\d*\./,"").length > fractionDigits) {
			throw this.getModel().getErrorMessage("numberFractionExceeded", value, fractionDigits);
		}
	}

	var maxInclusive = this.getMaxInclusive();
	if (maxInclusive !== null && nvalue > maxInclusive) {
		throw this.getModel().getErrorMessage("numberMoreThanMax", maxInclusive);
	}
	
	var maxExclusive = this.getMaxExclusive();
	if (maxExclusive !== null && nvalue >= maxExclusive) {
		throw this.getModel().getErrorMessage("numberMoreThanEqualMax", maxExclusive);
	}

	var minInclusive = this.getMinInclusive();
	if (minInclusive !== null && nvalue < minInclusive) {
		throw this.getModel().getErrorMessage("numberLessThanMin",  minInclusive);
	}
	
	var minExclusive = this.getMinExclusive();
	if (minExclusive !== null && nvalue <= minExclusive) {
		throw this.getModel().getErrorMessage("numberLessThanEqualMin", minExclusive);
	}

	return nvalue;
}

XModel.registerErrorMessage("notAnInteger",		 AjxMsg.notAnInteger);
XModelItem.prototype.validateInt = function (value) {
    var fvalue = this.validateNumber (value) ; //parseFloat value
    var nvalue = parseInt (value) ;   //parseInt value
    if (nvalue != fvalue ) {
        throw this.getModel().getErrorMessage("notAnInteger", value) ;        
    }

    return nvalue ;
}


//
//	for validating dates and times
//

XModelItem.prototype.msecInOneDay = (1000 * 60 * 60 * 24);
XModel.registerErrorMessage("invalidDateString", AjxMsg.invalidDateString);

// methods
XModelItem.prototype.validateDate = function(value) {
	
	if (AjxUtil.isInstance(value, Date)) return value;
	if (AjxUtil.isString(value)) {
		value = value.toLowerCase();
		var date = new Date();

		if (value.indexOf("/") > -1) {
			var dateStrs = value.split("/");
			if (dateStrs.length == 3){
				var month = dateStrs[0];
				var day = dateStrs[1];
				var year = dateStrs[2];							
					
				if (month.length <= 2 && day.length <= 2 && year.length == 4) {
					//remove the preceeding 0 of the date value,
					//otherwise parseInt will evaluate it as 0
					month = parseInt(XModel.removePreceedingZero(month));
					day = parseInt(XModel.removePreceedingZero(day));
					year = parseInt(XModel.removePreceedingZero(year));							
					
					if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
						month -= 1;
						date.setFullYear(year, month, day);
						date.setHours(0,0,0,0);
						return date; 
											
						/*
						month -= 1;
						if (year < 1900) {
							if (year < 50) year += 2000;
							year += 1900;
						}
						date.setFullYear(year, month, day);
						date.setHours(0,0,0,0);
						return date; */
					}
				}
			}
		} else {
			// set to midnight today according to local time
			date.setHours(0,0,0,0);
			
			if (value == AjxMsg.today) {
				return date;
			} else if (value == AjxMsg.yesterday) {
				date.setTime(date.getTime() - this.msecInOneDay);
				return date;
			} else if (value == AjxMsg.tomorrow) {
				date.setTime(date.getTime() + this.msecInOneDay);
				return date;
			}
		}
	}
	throw this.getModel().getErrorMessage("invalidDateString", value);
	return value;
}

//remove the preceeding zero of a string, it is useful when evaluate a date item
XModel.removePreceedingZero =
function (dStr){
	var pattern = /^[0]*(.*)$/ ;
	var result = dStr.match(pattern) ;
	if (result != null) {
		return result[1];
	}else{
		return dStr ;
	}
}


XModel.registerErrorMessage("invalidTimeString",		 AjxMsg.invalidTimeString);
// time is returned as a number of milliseconds since
XModelItem.prototype.validateTime = function (value) {

	if (AjxUtil.isNumber(value)) return value;
	
	if (AjxUtil.isInstance(value, Date)) {
		return ((value.getHours() * 360) + (value.getMinutes() * 60) + value.getSeconds()) * 1000;
	}
	
	if (AjxUtil.isString(value)) {
		value = value.toLowerCase();
		if (value.indexOf(":") > -1) {
			value = value.split(":");

			var isPM = false;
			var lastPiece = value[value.length - 1];
			isPM = (lastPiece.indexOf(I18nMsg.periodPm.toLowerCase()) > -1);

			var hour = parseInt(value[0]);
			var min = parseInt(value[1]);
			var sec = (value.length == 3 ? parseInt(value[2]) : 0);
			if (!isNaN(hour) && !isNaN(min) && !isNaN(sec)) {
				hour -= 1;
				if (isPM && hour > 11) hour += 12;
				
				return ((hour * 360) + (min * 60) + sec) * 1000;
			}
		}
	}
	throw this.getModel().getErrorMessage("invalidTimeString", value);
}


XModel.registerErrorMessage("invalidDatetimeString",		 AjxMsg.invalidDatetimeString);
XModelItem.prototype.validateDateTime = function (value) {

	if (AjxUtil.isInstance(value, Date)) return value;
	if (AjxUtil.isNumber(value)) return value;
	if (AjxUtil.isString(value)) {
		// try to get the value as a date
		//  (this will ignore time fields, and will throw an exeception if we couldn't parse a date)
		var date = this.validateDate(value);
		
		// if it has a time component
		if (value.indexOf(":") > -1) {
			var time = value.split(" ")[1];
			// this will validate the time string and will throw an exception if it doesn't match
			time = this.validateTimeString(time);
			
			date.setTime(date.getTime() + time);
		}
		return date;
	}
	// probably should never get here...
	throw this.getModel().getErrorMessage("invalidDatetimeString", value);
}






//
//	XModelItem class: "string"
//
String_XModelItem = function(){}
XModelItemFactory.createItemType("_STRING_", "string", String_XModelItem)  ;
String_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
String_XModelItem.prototype.getDefaultValue = function () {	return ""; };


//
//	XModelItem class: "number"
//
Number_XModelItem = function(){}
XModelItemFactory.createItemType("_NUMBER_", "number", Number_XModelItem);
Number_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
Number_XModelItem.prototype.getDefaultValue = function () {	return 0; };

//XModelItem class: "int"
Integer_XModelItem = function(){}
XModelItemFactory.createItemType("_INT_", "int", Integer_XModelItem);
Integer_XModelItem.prototype.validateType = XModelItem.prototype.validateInt;
Integer_XModelItem.prototype.getDefaultValue = function () {	return 0; };




//
//	XModelItem class: "date"
//
Date_XModelItem = function(){}
XModelItemFactory.createItemType("_DATE_", "date", Date_XModelItem);
Date_XModelItem.prototype.validateType = XModelItem.prototype.validateDate;
Date_XModelItem.prototype.getDefaultValue = function () {	return new Date(); };




//
//	XModelItem class: "time"
//
Time_XModelItem = function(){}
XModelItemFactory.createItemType("_TIME_", "time", Time_XModelItem);
Time_XModelItem.prototype.validateType = XModelItem.prototype.validateTime;
Time_XModelItem.prototype.getDefaultValue = function () {	return new Date(); };





//
//	XModelItem class: "datetime"
//
Datetime_XModelItem = function(){}
XModelItemFactory.createItemType("_DATETIME_", "datetime", Datetime_XModelItem);
Datetime_XModelItem.prototype.validateType = XModelItem.prototype.validateDateTime;
Datetime_XModelItem.prototype.getDefaultValue = function () {	return new Date(); };





//
//	XModelItem class: "list"
//
List_XModelItem = function(){}
XModelItemFactory.createItemType("_LIST_", "list", List_XModelItem);
List_XModelItem.prototype.getDefaultValue = function () {	return new Array(); };

// type defaults and accessors
List_XModelItem.prototype.outputType = _LIST_;	// 	_STRING_ == convert to a string
													//	_LIST_ == convert to an array
List_XModelItem.prototype.itemDelimiter = ","; 		//	delimiter for converting string values to arrays
List_XModelItem.prototype.inputDelimiter = /[\s,\r\n]+/;		//	delimiter for converting string values to arrays
List_XModelItem.prototype.listItem = {type:_UNTYPED_};

List_XModelItem.prototype.getOutputType = function () 	{	return this.outputType;			}
List_XModelItem.prototype.getItemDelimiter = function() {	return this.itemDelimiter		}
List_XModelItem.prototype.getInputDelimiter = function() {	return this.inputDelimiter		}
List_XModelItem.prototype.getListItem = function () 	{	return this.listItem;			}
List_XModelItem.prototype.getterScope = _MODELITEM_;
List_XModelItem.prototype.setterScope = _MODELITEM_;
List_XModelItem.prototype.getter = "getValue";
List_XModelItem.prototype.setter = "setValue";



//	methods
List_XModelItem.prototype.getValue =  function(ins, current, ref) {
	var value = eval("ins."+ref);
	if(value && this.getOutputType() ==_STRING_ && value instanceof Array) {
		return value.join(this.getItemDelimiter());
	} else {
		return value;
	}
}

List_XModelItem.prototype.setValue = function(val, ins, current, ref) {
	if(val && this.getOutputType() == _STRING_ && !(val instanceof Array)) {
		var value = val.split(this.getInputDelimiter());
		eval("ins."+ref+" = value");
		return value;
	} else {
        var value = eval("ins."+ref+" = val");
        return value;
	}
}

List_XModelItem.prototype.initializeItems = function () {
	var listItem = this.listItem;
	listItem.ref = listItem.id = "#";	
	this.listItem = XModelItemFactory.createItem(listItem, this, this.getModel());
	this.listItem.initializeItems();
}


List_XModelItem.prototype.validateType = function (value) {
	return value;
//XXX REWORK THIS TO USE THE listItem MODEL ITEM FOR EACH SUB-ITEM
}








//
//	XModelItem class: "enum"
//
Enum_XModelItem = function(){
    XModel.registerErrorMessage("didNotMatchChoice",	AjxMsg.didNotMatchChoice);

}
XModelItemFactory.createItemType("_ENUM_", "enum", Enum_XModelItem);
//XXXX
Enum_XModelItem.prototype.getDefaultValue = function () {	return this.getChoices()[0]; };

Enum_XModelItem.prototype.getChoices = function()		 {
    if (typeof this.choices == "function") {  //due to the i18n complexity, we have to define the choices use the function
        this.choices = this.choices.call (this) ;
    }
    return this.choices;
}
Enum_XModelItem.prototype.getSelection = function() 	{		return this.selection;		}


Enum_XModelItem.prototype.validateType = function (value) {
	// if the selection is open, they can enter any value they want
	var selectionIsOpen = this.getSelection() == _OPEN_;
	if (selectionIsOpen) return value;
	
	// selection is not open: it must be one of the supplied choices
	var choices = this.getChoices();
	for (var i = 0; i < choices.length; i++) {
		var choice = choices[i];
		if (AjxUtil.isInstance(choice, Object)) {
			if (choice.value == value) return value;
		} else {
			if (choice == value) return value;
		}
	}
	
	// if we get here, we didn't match any of the choices
	throw this.getModel().getErrorMessage("didNotMatchChoice", value);
}

//
// Model Item Class: "bool"
// Can only be used with checkbox
//
Bool_XModelItem = function(){};
XModelItemFactory.createItemType("_BOOL_", "bool", Bool_XModelItem);
Bool_XModelItem.prototype = new Enum_XModelItem();
Bool_XModelItem.prototype.choices = ["FALSE", "TRUE", null];

FileSize_XModelItem = function (){}
XModelItemFactory.createItemType("_FILE_SIZE_", "file_size", FileSize_XModelItem);
FileSize_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
FileSize_XModelItem.prototype.getterScope = _MODELITEM_;
FileSize_XModelItem.prototype.setterScope = _MODELITEM_;
FileSize_XModelItem.prototype.getter = "getValue";
FileSize_XModelItem.prototype.setter = "setValue";
FileSize_XModelItem.prototype.units = AjxUtil.SIZE_MEGABYTES;
FileSize_XModelItem.prototype.minInclusive = 0;
FileSize_XModelItem.prototype.maxInclusive = 922337203685477;
FileSize_XModelItem.prototype.maxLength = 15;

FileSize_XModelItem.prototype.getValue =  function(ins, current, ref) {
	var value = eval("ins."+ref);
	return value ? AjxUtil.formatSizeForUnits(value, AjxUtil.SIZE_KILOBYTES, false, 2) : 1;
}

FileSize_XModelItem.prototype.setValue = function(val, ins, current, ref) {
        var value = eval("ins."+ref+" = AjxUtil.parseSize(val, this.units)");
	return isNaN(value) ? 1 : value;
}

HostNameOrIp_XModelItem = function() {}
XModelItemFactory.createItemType("_HOSTNAME_OR_IP_", "hostname_or_ip", HostNameOrIp_XModelItem);
HostNameOrIp_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
HostNameOrIp_XModelItem.prototype.maxLength = 256;
HostNameOrIp_XModelItem.prototype.pattern = [
	AjxUtil.HOST_NAME_RE,
	AjxUtil.IPv4_ADDRESS_RE,
	AjxUtil.IPv6_ADDRESS_RE,
	AjxUtil.HOST_NAME_WITH_PORT_RE,
	AjxUtil.IPv4_ADDRESS_WITH_PORT_RE,
	AjxUtil.IPv6_ADDRESS_WITH_PORT_RE
];

ShortURL_XModelItem = function() {}
XModelItemFactory.createItemType("_SHORT_URL_", "short_url", ShortURL_XModelItem);
ShortURL_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
ShortURL_XModelItem.prototype.maxLength = 256;
ShortURL_XModelItem.prototype.pattern = [AjxUtil.SHORT_URL_RE,AjxUtil.IP_SHORT_URL_RE];

Port_XModelItem = function() {}
XModelItemFactory.createItemType("_PORT_", "port", Port_XModelItem);
Port_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
Port_XModelItem.prototype.minInclusive = 0;
Port_XModelItem.prototype.maxInclusive = 65535;

Percent_XModelItem = function() {}
XModelItemFactory.createItemType("_PERCENT_", "percent", Percent_XModelItem);
Percent_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
Percent_XModelItem.prototype.minInclusive = 0;
Percent_XModelItem.prototype.maxInclusive = 100;

EmailAddress_XModelItem = function() {}
XModelItemFactory.createItemType("_EMAIL_ADDRESS_", "email_address", EmailAddress_XModelItem);
EmailAddress_XModelItem.prototype.validateType = XModelItem.prototype.validateEmailAddress;
EmailAddress_XModelItem.prototype.maxLength = 256;

FullUrl_XModelItem = function() {}
XModelItemFactory.createItemType("_FULL_URL_", "full_url", FullUrl_XModelItem);
FullUrl_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
FullUrl_XModelItem.prototype.maxLength = 1024;
FullUrl_XModelItem.prototype.pattern = [AjxUtil.FULL_URL_RE, AjxUtil.IP_FULL_URL_RE];
