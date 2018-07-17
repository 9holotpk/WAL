// DEV. EXTENTION BY iTON // => CONTENTSCRIPT.JS
// NOTE: butterbar-icon
chrome.extension.onMessage.addListener(
	function (request, sender) {
		if (request.line == 'countparas') {
			var paras = document.body.querySelectorAll('div.qrcode');
			var alert = document.body.querySelectorAll('div.butterbar'); //div.butterbar
			var icon = document.getElementById('favicon').href;
			if (paras.length > 0) {
				var theCount = paras.length + '';
				chrome.runtime.sendMessage({ count: theCount });
			} else if (alert.length > 0) {
				var theCount = paras.length + '';
				chrome.runtime.sendMessage({ alert: theCount });
			} else {
				//console.log('log: There does not seem to be any <div> elements in this page!');
			}
		}
	});

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	// If the received message has the expected format...
	if (msg.text === 'report_back') {
		// Call the specified callback, passing
		// แก้ไขตรงนี้นิดหน่อย เนื่องจากขณะที่แอพมีการแจ้งว่าไม่ารมารถเชื่อมต่อกับมือถือหรือ Internet ได้
		// จึงเพื่อมการแจ้งเตือนไปที่ icon ของ WhatsApp Launcher ด้วย
		// 10-11-2016

		// IDBCursorWithValue
		// the web-page's DOM content as argument
		var n = document.documentElement.outerHTML.indexOf("icon-alert icon-alert-phone");
		if (n > 0) {
			//console.log('network fail:'+n);
			sendResponse('icon-alert');
		} else {
			sendResponse('ok');
		}

	}
});