const Schema = require('./transaction_pb');

const transaction = new Schema.Transaction();

/**
 * message Timestamp {
  // Represents seconds of UTC time since Unix epoch
  // 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
  // 9999-12-31T23:59:59Z inclusive.
  int64 seconds = 1;

  // Non-negative fractions of a second at nanosecond resolution. Negative
  // second values with fractions must still have non-negative nanos values
  // that count forward in time. Must be from 0 to 999,999,999
  // inclusive.
  int32 nanos = 2;
}
 */

// const timeMS = Date.now();

// const timestamp = new proto.google.protobuf.Timestamp()
// timestamp.setSeconds(timeMS / 1000);
// timestamp.setNanos((timeMS % 1000) * 1e6);

// transaction.setTimestap(timestamp);
// let result = transaction.getTimestap();

// console.log(timestamp);
// console.log(result);
// console.log(result.getSeconds())
// console.log(result.getNanos())

// let binary = transaction.serializeBinary();
// console.log(binary);
let timestamp = Date.now();
console.log(timestamp);
transaction.setTimestap(Date.now());
let binary = transaction.serializeBinary();
console.log(binary);