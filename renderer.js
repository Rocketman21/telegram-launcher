const {exec} = require('child_process')
const $ = window.jQuery

$('#btn-launch').click(() => {
  launchApp($('#input-path').val())
  $('#tl-message').transition('browse', function () {
    setTimeout(() => { $(this).transition('browse') }, 1000)
  })
})

// Создаем обработчик бота
class Telegram {
  constructor (token) {
    this.token = token
    this.prevOffset = 0
  }

  getUpdates () {
    $.ajax({
      async: false,
      url: `https://api.telegram.org/bot${this.token}/getUpdates?offset=${this.prevOffset + 1}`,
      success: (msg) => {
        if (msg.ok !== true || msg.result.length === 0) return
        msg.result.forEach((v) => {
          // обновляем offset
          this.prevOffset = v.update_id
          launchApp(v.message.text)
        })
      }
    })
  }
}

const tlg = new Telegram('412774532:AAFvGG4nJlMTddR5-inhg3KEbhiB5vl3EPk')
setInterval(() => { tlg.getUpdates() }, 300)

function launchApp (msg) {
  let command = ''

  if (process.platform === 'darwin') {
    command = 'open -a '
  }

  exec(command + msg)
  // console.log(command + msg)
}
