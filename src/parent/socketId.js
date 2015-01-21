// unique identifier for the socket
module.exports = function (l) {
    var text = "",
    	p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    	i;
    for (i=0; i < l; i += 1) {
        text += p.charAt(Math.floor(Math.random() * p.length));
    }
    return text;
};