var TOPIC_EMPTY = 'topic为空！'
var MSG_EMPTY = '消息内容为空！'
var DISCONNECT_MSG = '当前尚未连接'
var userName = 'konva'
let localHost = ['tcloudbaseapp.com', 'gitee.io', 'github.io']

if (process.env.NODE_ENV == 'development') {
  localHost.push('localhost', '127.0.0.1')
}
var clientssession = getToken(tokenTableName, storage)
var info = {
  topic: 'web/' + clientssession,
  qos: 2,
}
import { tokenTableName, storage } from '@/config'
import globalUrl from '@/utils/globalUrl'
import { getToken } from '@/utils/vuex'
const { hostname } = window.location
function getsession(session) {
  clientssession = session
  info = {
    topic: 'web/' + clientssession,
    qos: 2,
  }
}

function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      var str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}
const didata = []
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
var sendInfo = {
  topic: '/test',
  text: 'Hello world!',
  qos: 0,
  retained: true,
}
// if (process.env.NODE_ENV == 'development') {
//   localHost.push('localhost', '127.0.0.1')
// }
let _scokethost = ''
var result = localHost.some((i) => {
  return hostname.indexOf(i) > -1
})
if (result) {
  console.log(process.env.VUE_APP_URL)
  _scokethost = process.env.VUE_APP_URL.split('//')[1]
} else {
  _scokethost = ''
}
console.log(_scokethost)
// eslint-disable-next-line no-unused-vars
var Websocket = {
  modName: 'websocket',
  client: null,
  connState: false,
  cInfo: {
    host: _scokethost,
    port: 8083,
    clientId: 'C_' + new Date().getTime(),
    userName: userName,
    password: 'test123',
    keepAlive: null,
    keepAliveInterval: 10,
    cleanSession: false,
  },
  sendInfo: '{}',
  hooks: [],
  tablelist: [],
  subInfo: info,
  originrecivedata: [],
  send: function () {
    var _this = this
    var sendInfo = JSON.parse(_this.sendInfo)
    console.log(sendInfo)
    _this.sendMessage(sendInfo)
  },
  log: function (Msg) {
    try {
      Msg = JSON.parse(Msg)
      // eslint-disable-next-line no-empty
    } catch (e) {}
    // eslint-disable-next-line no-undef
  },
  newClient: function () {
    var _this = this
    // eslint-disable-next-line no-undef
    _this.client = new Paho.MQTT.Client(
      _this.cInfo.host,
      Number(_this.cInfo.port),
      _this.cInfo.clientId
    )
  },
  sslPort: function () {
    var _this = this
    var useSSL = _this.cInfo.useSSL
    if (useSSL) {
      _this.cInfo.port = 8084
    } else {
      _this.cInfo.port = 5080
    }
  },
  recive: function (msg) {
    console.log(msg)
  },

  add_hook: function (Re, Callback) {
    var _this = this
    if (_this.hooks.length > 0) {
      for (var i = 0; i < _this.hooks.length; i++) {
        if (_this.hooks[i].re.toString() == Re.toString()) {
          _this.hooks[i].re = Re
          _this.hooks[i].callback = Callback
          return
        }
      }
    }
    _this.hooks.push({ re: Re, callback: Callback })
  },

  dispatch: function (message) {
    console.log('message', message)
    var _this = this
    var topic = message.destinationName
    const hooks = _this.hooks
    hooks.map((item) => {
      if (item.re.test(topic)) {
        item.callback(message.payloadString)
      }
    })
  },

  connect: function () {
    var _this = this
    // eslint-disable-next-line no-undef
    if (_this.client && _this.client.isConnected()) {
      return
    } else {
      _this.newClient()
    }
    _this.client.onConnectionLost = function (responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost: ' + responseObject.errorMessage)
        setTimeout(function () {
          _this.connect()
        }, 1000)
      } else {
        window.clearTimeout()
      }
      // return
    }
    _this.client.onMessageArrived = function (message) {
      try {
        message.msgString = message.payloadString
      } catch (e) {
        message.msgString =
          'Binary message(' + message.payloadBytes.length + ')'
      }
      _this.dispatch(message)
    }

    var options = {
      onFailure: function (err) {
        _this.connState = false
        console.log('连接失败 ' + err.errorMessage)
        setTimeout(function () {
          _this.connect()
        }, 5000)
      },
      onSuccess: function () {
        _this.connState = true
        _this.subscribe(_this.subInfo, function (res) {
          if (res.result) {
            console.log(_this.subInfo)
            console.log('订阅成功')
          }
        })
      },
    }
    var userName = _this.cInfo.userName
    var password = _this.cInfo.password
    var keepAlive = _this.cInfo.keepAlive
    var cleanSession = _this.cInfo.cleanSession
    // var useSSL = _this.cInfo.useSSL
    if (userName) {
      options.userName = userName
    }
    if (password) {
      options.password = password
    }
    if (keepAlive) {
      options.keepAliveInterval = Number(keepAlive)
    }
    options.cleanSession = cleanSession
    // options.useSSL = useSSL
    _this.client.connect(options)
  },

  disconnect: function () {
    var _this = this
    if (_this.client && this.client.isConnected()) {
      _this.client.disconnect()
      _this.client = null
    }
    console.log('已经断开连接！')
    _this.connState = false
    setTimeout(function () {
      _this.connect()
    }, 5000)
  },
  subscribe: function (subInfo, callback) {
    var _this = this
    if (!_this.client || !_this.client.isConnected()) {
      console.log(DISCONNECT_MSG)
      // _this.connect()
      return
    }
    if (!subInfo.topic) {
      console.log(TOPIC_EMPTY)
      return
    }
    _this.client.subscribe(subInfo.topic, {
      qos: Number(subInfo.qos),
      onSuccess: function (msg) {
        subInfo.msg = msg
        console.log(subInfo.msg)
        subInfo.result = true
        callback && callback(subInfo)
      },
      onFailure: function (err) {
        if (err.errorCode[0] === 128) {
          console.log('The topic cannot SUBSCRIBE for ACL Deny')
        }
        subInfo.msg = err
        console.log(err)
        subInfo.result = false
        callback && callback(subInfo)
      },
    })
  },
  unsubscribe: function (subInfo, callback) {
    var _this = this
    if (!_this.client || !_this.client.isConnected()) {
      _this.tablelist.push({
        date: formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
        content: DISCONNECT_MSG,
      })
      console.log(DISCONNECT_MSG)
      _this.connect()
      return
    }
    if (!subInfo.topic) {
      _this.tablelist.push({
        date: formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
        content: TOPIC_EMPTY,
      })
      console.log(TOPIC_EMPTY)
      return
    }
    _this.client.unsubscribe(subInfo.topic, {
      onSuccess: function (msg) {
        subInfo.msg = msg
        console.log(subInfo)
        subInfo.result = true
        callback && callback(subInfo)
      },
      onFailure: function (err) {
        subInfo.msg = err
        console.log(err)
        subInfo.result = true
        callback && callback(subInfo)
      },
    })
  },
  sendMessage: function (sendInfo) {
    var _this = this
    var text = sendInfo.text
    if (!_this.client || !_this.client.isConnected()) {
      console.log(DISCONNECT_MSG)
      _this.connect()
      return
    }
    if (!sendInfo.topic) {
      console.log(TOPIC_EMPTY)
      return
    }
    if (!text) {
      console.log(MSG_EMPTY)
      return
    }
    // eslint-disable-next-line no-undef
    var message = new Paho.MQTT.Message(text)
    message.destinationName = sendInfo.topic
    message.qos = Number(sendInfo.qos)
    message.retained = sendInfo.retained
    _this.client.send(message)
    console.log(sendInfo)
  },
}
export {
  // eslint-disable-next-line no-undef
  Websocket,
  sendInfo,
  TOPIC_EMPTY,
  MSG_EMPTY,
  DISCONNECT_MSG,
  didata,
  getsession,
  _scokethost,
}
