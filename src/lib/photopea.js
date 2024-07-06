class Photopea {

    static async initEmbed(elem_to_append_to, config) {
        var iframe = document.createElement("iframe");
        iframe.style.border = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        if (config) iframe.src = "https://www.photopea.com#" + encodeURI(config);
        else iframe.src = "https://www.photopea.com";
        elem_to_append_to.appendChild(iframe);
        var myPromise = new Promise(function(resolve, reject) {
            var messageHandle = function(e) {
                //if (e.source == iframe.contentWindow && e.data == "done") {
                    resolve(iframe);
                    window.removeEventListener("message", messageHandle);
                //}
            };
            window.addEventListener("message", messageHandle);
        });
        return await myPromise;
    }

    static async runScript(contentWindow, script) {
        var myPromise = new Promise(function(resolve, reject) {
            var outputarray = [];
            var messageHandle = function(e) {
                if (e.source == contentWindow) {
                    outputarray.push(e.data);
                    if (e.data == "done") {
                        resolve(outputarray);
                        window.removeEventListener("message", messageHandle);
                    }
                }
            };
            window.addEventListener("message", messageHandle);
        });
        contentWindow.postMessage(script, "*");
        var returnedMessage = await myPromise;
        return returnedMessage;
    }

    static async addBinaryAsset(contentWindow, asset) {
        var myPromise = new Promise(function(resolve, reject) {
            var messageHandle = function(e) {
                if (e.source == contentWindow && e.data == "done") {
                    resolve(true);
                    window.removeEventListener("message", messageHandle);
                };
            };
            window.addEventListener("message", messageHandle);
        });
        contentWindow.postMessage(asset, "*");
        return await myPromise;
    }
    
}

export default Photopea;