taurus
=========

<a href="https://travis-ci.org/kyasuda2003/taurus"><img src="https://travis-ci.org/kyasuda2003/taurus.svg?branch=master"></a>

taurus chat embraces Node JS's spirit of scalablity, sturdiness, and security. taurus realises how imperative of #<b>long-poll</b> http request is when websocket is a no-go in a complex production environment.

taurus loves charity works and is ready to be commissioned in non-profit communities.

<h3>Installation:</h3>

taurus recommend to install package through --save-dev.
<pre>
npm install taurus --save-dev
</pre>

taurus is default to port#3131.

<pre>
curl http://localhost:3131/<file_name>
</pre>

<a href="http://kyasuda2003.github.io/taurus/">taurus Project Page</a>

taurus client example
<a href="https://github.com/kyasuda2003/taurus-client">
https://github.com/kyasuda2003/taurus-client
</a>

<h3>Usage</h3>
Adding taurus in client application:
<pre>
var tau=required('taurus');
</pre>


1) To initial taurus - TBD.
<pre>
var option={port:3131};
tau.init(option);
</pre>

2) To start taurus - TBD.
<pre>
tau.start();
</pre>

3) To run taurus through Grunt you would need a <a href="http://gruntjs.com/getting-started">grunt install</a>.
<pre>
$grunt start (start-dev for dev env)
</pre>

4) Before running taurus unit test, you also need <a href="https://www.npmjs.com/package/istanbul">to install istanbul</a> and <a href="http://mochajs.org/"> to install mocha</a>.
<pre>
$grunt test
</pre>

