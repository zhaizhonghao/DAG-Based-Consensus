// source: event.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
goog.exportSymbol('proto.Event', null, global);
goog.exportSymbol('proto.Message', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Event = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Event, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Event.displayName = 'proto.Event';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Message = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.Message.repeatedFields_, null);
};
goog.inherits(proto.Message, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Message.displayName = 'proto.Message';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Event.prototype.toObject = function(opt_includeInstance) {
  return proto.Event.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Event} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Event.toObject = function(includeInstance, msg) {
  var f, obj = {
    selfparent: jspb.Message.getFieldWithDefault(msg, 1, ""),
    parent: jspb.Message.getFieldWithDefault(msg, 2, ""),
    timestamp: (f = msg.getTimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    clientid: jspb.Message.getFieldWithDefault(msg, 4, 0),
    eventid: jspb.Message.getFieldWithDefault(msg, 5, 0),
    stable: jspb.Message.getBooleanFieldWithDefault(msg, 6, false),
    hash: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Event}
 */
proto.Event.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Event;
  return proto.Event.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Event} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Event}
 */
proto.Event.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSelfparent(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setParent(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setTimestamp(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setClientid(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setEventid(value);
      break;
    case 6:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setStable(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Event.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Event.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Event} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Event.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSelfparent();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getParent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTimestamp();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getClientid();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = message.getEventid();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getStable();
  if (f) {
    writer.writeBool(
      6,
      f
    );
  }
  f = message.getHash();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string selfParent = 1;
 * @return {string}
 */
proto.Event.prototype.getSelfparent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.Event} returns this
 */
proto.Event.prototype.setSelfparent = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string parent = 2;
 * @return {string}
 */
proto.Event.prototype.getParent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.Event} returns this
 */
proto.Event.prototype.setParent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp timestamp = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.Event.prototype.getTimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.Event} returns this
*/
proto.Event.prototype.setTimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.Event} returns this
 */
proto.Event.prototype.clearTimestamp = function() {
  return this.setTimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.Event.prototype.hasTimestamp = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional int32 clientID = 4;
 * @return {number}
 */
proto.Event.prototype.getClientid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.Event} returns this
 */
proto.Event.prototype.setClientid = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional int32 eventID = 5;
 * @return {number}
 */
proto.Event.prototype.getEventid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.Event} returns this
 */
proto.Event.prototype.setEventid = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional bool stable = 6;
 * @return {boolean}
 */
proto.Event.prototype.getStable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 6, false));
};


/**
 * @param {boolean} value
 * @return {!proto.Event} returns this
 */
proto.Event.prototype.setStable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 6, value);
};


/**
 * optional string hash = 7;
 * @return {string}
 */
proto.Event.prototype.getHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.Event} returns this
 */
proto.Event.prototype.setHash = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.Message.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Message.prototype.toObject = function(opt_includeInstance) {
  return proto.Message.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Message} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Message.toObject = function(includeInstance, msg) {
  var f, obj = {
    eventsList: jspb.Message.toObjectList(msg.getEventsList(),
    proto.Event.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Message}
 */
proto.Message.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Message;
  return proto.Message.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Message} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Message}
 */
proto.Message.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Event;
      reader.readMessage(value,proto.Event.deserializeBinaryFromReader);
      msg.addEvents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Message.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Message.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Message} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Message.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.Event.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Event events = 1;
 * @return {!Array<!proto.Event>}
 */
proto.Message.prototype.getEventsList = function() {
  return /** @type{!Array<!proto.Event>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.Event, 1));
};


/**
 * @param {!Array<!proto.Event>} value
 * @return {!proto.Message} returns this
*/
proto.Message.prototype.setEventsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.Event=} opt_value
 * @param {number=} opt_index
 * @return {!proto.Event}
 */
proto.Message.prototype.addEvents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.Event, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.Message} returns this
 */
proto.Message.prototype.clearEventsList = function() {
  return this.setEventsList([]);
};


goog.object.extend(exports, proto);
