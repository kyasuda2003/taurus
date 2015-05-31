taurus
=========

Taurus chatting service. A Node JS chat service. Small, scalable and sturdy for your own organisational purpose.

<h3>Installation:</h3>

<pre>
npm install taurus
</pre>

The Taurus is default to port#3131.

<pre>
curl http://localhost:3131/<file_name>
</pre>

Taurus client example
<pre>
https://github.com/kyasuda2003/taurus-client
</pre>

<h3>Usage</h3>
Adding taurus in client application:

<pre>
var tau=required('taurus');
</pre>


2. To initial taurus - TBD
<pre>
var option={port:3131};
tau.init(option);
</pre>

3. To start taurus - TBD
<pre>
tau.start();
</pre>
