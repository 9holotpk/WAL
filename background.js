// DEV. EXTENTION BY TON // => BACKGROUND.JS
var whatsAppURL = "https://web.whatsapp.com/";
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?web\.whatsapp\.com/; // https://web.whatsapp.com/
var readTitle;
var tabID;
var res = "";
var status = ''; // 'contact' default
chrome.browserAction.setBadgeText({ text: "" });

function checkQR (what){
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {line: 'countparas'});
	});
	var nicon = '';
	chrome.runtime.onMessage.addListener(
		function (request, sender) {
			if(request.count){
				//console.log('log: (' +request.count+ ') tab ID: (' +sender.tab.id+ ') Waiting Scan QR Code.');
				chrome.browserAction.setBadgeText({ text: "QR" });
				chrome.browserAction.setTitle({ title: 'Please Scan QR Code' })
				chrome.browserAction.setBadgeBackgroundColor({ color: "#777777" });
			}
			if(request.alert){
				//console.log('log: (' +request.alert+ ') tab ID: (' +sender.tab.id+ ') Something Alert!');
				chrome.browserAction.setBadgeText({ text: "!" });
				chrome.browserAction.setTitle({ title: 'Something Alert!'})
				chrome.browserAction.setBadgeBackgroundColor({ color: "#F27F03" });
			}
			if(request.icon){
				//console.log('log: (' +request.icon+ ')');
				nicon = request.icon;
				if(what=="ckicon"){
					chrome.browserAction.setIcon({
						path : nicon
					});
				}else {
					chrome.browserAction.setIcon({
						path : "icons/whatsapp_48.png"
					});
				}
			}
		}
	);
        
}

chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
        if(tabs.length > 0){
        	var winID = tabs[0].windowId;
    		chrome.windows.update(winID, { focused: true });   		
            //chrome.tabs.update(tabs[0].id, { active: true });
            tabID = tabs[0].id;
            checkQR();
        }else{
        	chrome.windows.create({url: whatsAppURL, type: "popup", width: 685, height: 620, top: 50, left: 50});
        	//console.log('log: Created new Window chat!');
        }
    });	
});

chrome.tabs.onUpdated.addListener(function(tabsU, changeInfo, tab){
	chrome.tabs.query({ url: whatsAppURL + "*" }, function(tabs){
		if(tabs.length > 0){
			tabID = tabs[0].id;
			//console.log('TabID='+tabID);
			if(tabsU==tabID){
				//Options
				chrome.storage.sync.get("favoriteBadge", function(items) {
					if (!chrome.runtime.error) {
						status = items.favoriteBadge;
						//console.log(status);
					} else console.log('runtime error');
				});				
				readTitle = tabs[0].title;
				//console.log('Title='+readTitle);
				if(readTitle.length > 0 && status == 'contact'){
                    var f = readTitle.indexOf("(");
				    var e = readTitle.indexOf(")");
				    res = readTitle.substring(f+1, e);
				    if(res.length > 0){
				    	chrome.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					    chrome.browserAction.setBadgeText({ text: res });
					    chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
                                            
					}else{
                                            chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
                                            chrome.browserAction.setBadgeText({ text: "on" });
                                            chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
				    checkQR(); // Check QR & Alert
				}else if(readTitle.length > 0 && status == 'icontact'){
                    var f = readTitle.indexOf("(");
				    var e = readTitle.indexOf(")");
				    res = readTitle.substring(f+1, e);
				    if(res.length > 0){
				    	chrome.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					chrome.browserAction.setBadgeText({ text: "" });
					chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
                                            
                                    }else{
                                        chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
                                        chrome.browserAction.setBadgeText({ text: "" });
                                        chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
				    checkQR("ckicon"); // Check QR & Alert
				}else if(status == 'total'){
					var numChat;
					if(numChat.length > 0){
				    	chrome.browserAction.setTitle({title: 'New ' +res+ ' message(s) | Click to Launch'})
					    chrome.browserAction.setBadgeText({ text: numChat });
					    chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
					}else{
						chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
						chrome.browserAction.setBadgeText({ text: "on" });
				    	chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
					checkQR(); // Check QR & Alert
				}else if(status == 'none'){
					chrome.browserAction.setBadgeText({ text: "" });
					chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
				}else{
					//default = contact
					var f = readTitle.indexOf("(");
				    var e = readTitle.indexOf(")");
				    res = readTitle.substring(f+1, e);
				    if(res.length > 0){
				    	chrome.browserAction.setTitle({title: 'Chat from ' +res+ ' contact(s) | Click to Launch'})
					    chrome.browserAction.setBadgeText({ text: res });
					    chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
					}else{
						chrome.browserAction.setTitle({title: 'WhatsApp Launcher'})
						chrome.browserAction.setBadgeText({ text: "on" });
				    	chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
					}
				    checkQR(); // Check QR & Alert					
				}
				//Check connect network with read Element.
				checkQR(); // Check QR & Alert	
								
			}
        }
	});
	if (urlRegex.test(tab.url)) {
        // ...if it matches, send a message specifying a callback too
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    }
});

chrome.tabs.onRemoved.addListener(function (tabsR, removeInfo){
	if(tabsR==tabID){
		chrome.browserAction.setBadgeText({ text: "" });
		chrome.browserAction.setTitle({title: 'WhatsApp Launcher'});
                chrome.browserAction.setIcon({
                    path : "icons/whatsapp_48.png"
                });
		//console.log('log: Closed Window chat!');
	}
});


// A function to use as callback
function doStuffWithDom(domContent) {
    // console.log('I received the following DOM content:\n' + domContent);
	// var n = domContent.indexOf("icon-alert icon-alert-phone");
	// if(n>0){
	// 	console.log('network fail:'+n);
	// }
	if(domContent == 'icon-alert'){
		//console.log('bg: icon-alert');
	}else if(domContent == 'ok'){
		//console.log('bg: connected!');
	}else{
		//console.log('bg: none');
	}
}




