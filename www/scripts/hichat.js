// 如何保持与服务器端的长连接，而不是http协议这种断开式的链接
// 实时响应用户界面 TCP/IP，pc端叫做WebSocket
window.onload = function () {
    var hichat = new HiChat()
    hichat.init()
}
let HiChat = function () {
}
HiChat.prototype = {
    init: function () {
        var that = this
        // 前端的socket连接就此形成
        this.socket = io.connect()
        this.socket.on('connect', function () {
            document.getElementById('info').textContent = "get yourself a nickname";
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus()
        })
        this.socket.on('loginSuccess', function () {
            document.title = 'hichat | ' + document.getElementById('nicknameInput').value
            document.getElementById('loginWrapper').style.display = 'none'
            document.getElementById('messageInput').focus()
        })
        this.socket.on('system', function (nickName, userCount, type) {
            var msg = nickName + (type === 'login'?' joined':' left')
            that._dispalyNewMsg('system', msg, 'red')
            document.getElementById('status').textContent = userCount + (userCount>1?'users': ' user') + 'online'

        })
        document.getElementById('loginBtn').addEventListener('click', function () {
            var nickName = document.getElementById('nicknameInput').value
            if (!nickName) {
                document.getElementById('nicknameInput').focus()
            } else {
                // emit 向服务器端发出一个请求 ()中为事件名，自定义
                that.socket.emit('login', nickName)
            }
        })
    },
    // _表示私有方法
    _dispalyNewMsg: function (user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8)
        msgToDisplay.style.color = color || '#000'
        msgToDisplay.innerHTML = user + `<span class="timespan">(` + date + `):</span>` + msg
        container.appendChild(msgToDisplay)
    }
}
