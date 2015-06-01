taurus
=========

<a href="https://travis-ci.org/kyasuda2003/taurus"><img src="https://travis-ci.org/kyasuda2003/taurus.svg?branch=master"></a>

Taurus chatting service. A Node JS chat service. Small, scalable and sturdy for your own organisational purpose.

<h3>Installation:</h3>

Taurus recommend to install package through --save-dev.
<pre>
npm install taurus --save-dev
</pre>

Taurus is default to port#3131.

<pre>
curl http://localhost:3131/<file_name>
</pre>

<a href="http://kyasuda2003.github.io/taurus/">Taurus Project Page</a>

Taurus client example
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

3) To run Taurus through Grunt you would need a <a href="http://gruntjs.com/getting-started">grunt install</a>.
<pre>
$grunt start (start-dev for dev env)
</pre>

4) Before running Taurus unit test, you also need <a href="https://www.npmjs.com/package/istanbul">to install istanbul</a> and <a href="http://mochajs.org/"> to install mocha</a>.
<pre>
$grunt test
</pre>

