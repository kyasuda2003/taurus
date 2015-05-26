tau-server
=========

Tau chatting service server

<h3>Installation:</h3>

<pre>
npm install tau-client
</pre>

The AAE-Plugin will be default to port#3131 and loaded automatically following the above grunt command.


<pre>
curl http://localhost:3131/<file_name>
</pre>

Launch aae-plugin example
<pre>
http://localhost:3131/examples/basic.html
</pre>

<h3>Browser Compatibility</h3>
chromium 32.x.x.
IE 7.Safari.Firefox 3x.x

<h3>Server Usage</h3>
Run the standalone Plugin:
-nomin: Do not minimise.
-dev: Load original files.
-apm: APM app.
-mqchat: mqchat/xmpp.

<pre>
node ./test/mock/index [-p port# [-h host [-nomin [-dev]]]]
</pre>



 
<h3>Client Usage</h3>
1. Adding the following script in your html template
<pre>
&lt;script src='https://tau/tau.main.js'&gt;&lt;/script&gt;
</pre>

2. To initial Ask an Expert - TBD
<pre>
aaeobj.initAAE([username],
                [invite receiving callback],
                [done with chat service initialising callback])
</pre>

3. To start Tau - TBD
<pre>
tauobj.launchAAE([workspacename],[done with launchTau callback])
</pre>
