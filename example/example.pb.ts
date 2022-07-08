/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal.js'
import { OtherMessage } from './other/other.pb.js'

export const protobufPackage = 'example'

/** EchoMsg is the message body for Echo. */
export interface EchoMsg {
  /** Body is the body of the message. */
  body: string
  /** OtherMessage is an example of a protobuf imported type. */
  otherMessage: OtherMessage | undefined
}

function createBaseEchoMsg(): EchoMsg {
  return { body: '', otherMessage: undefined }
}

export const EchoMsg = {
  encode(
    message: EchoMsg,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.body !== '') {
      writer.uint32(10).string(message.body)
    }
    if (message.otherMessage !== undefined) {
      OtherMessage.encode(
        message.otherMessage,
        writer.uint32(18).fork()
      ).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EchoMsg {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseEchoMsg()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.body = reader.string()
          break
        case 2:
          message.otherMessage = OtherMessage.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  // encodeTransform encodes a source of message objects.
  // Transform<EchoMsg, Uint8Array>
  async *encodeTransform(
    source: AsyncIterable<EchoMsg | EchoMsg[]> | Iterable<EchoMsg | EchoMsg[]>
  ): AsyncIterable<Uint8Array> {
    for await (const pkt of source) {
      if (Array.isArray(pkt)) {
        for (const p of pkt) {
          yield* [EchoMsg.encode(p).finish()]
        }
      } else {
        yield* [EchoMsg.encode(pkt).finish()]
      }
    }
  },

  // decodeTransform decodes a source of encoded messages.
  // Transform<Uint8Array, EchoMsg>
  async *decodeTransform(
    source:
      | AsyncIterable<Uint8Array | Uint8Array[]>
      | Iterable<Uint8Array | Uint8Array[]>
  ): AsyncIterable<EchoMsg> {
    for await (const pkt of source) {
      if (Array.isArray(pkt)) {
        for (const p of pkt) {
          yield* [EchoMsg.decode(p)]
        }
      } else {
        yield* [EchoMsg.decode(pkt)]
      }
    }
  },

  fromJSON(object: any): EchoMsg {
    return {
      body: isSet(object.body) ? String(object.body) : '',
      otherMessage: isSet(object.otherMessage)
        ? OtherMessage.fromJSON(object.otherMessage)
        : undefined,
    }
  },

  toJSON(message: EchoMsg): unknown {
    const obj: any = {}
    message.body !== undefined && (obj.body = message.body)
    message.otherMessage !== undefined &&
      (obj.otherMessage = message.otherMessage
        ? OtherMessage.toJSON(message.otherMessage)
        : undefined)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<EchoMsg>, I>>(object: I): EchoMsg {
    const message = createBaseEchoMsg()
    message.body = object.body ?? ''
    message.otherMessage =
      object.otherMessage !== undefined && object.otherMessage !== null
        ? OtherMessage.fromPartial(object.otherMessage)
        : undefined
    return message
  },
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string }
  ? { [K in keyof Omit<T, '$case'>]?: DeepPartial<T[K]> } & {
      $case: T['$case']
    }
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never
    }

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
