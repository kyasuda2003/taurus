taurus
=========

<a href="https://travis-ci.org/kyasuda2003/taurus"><img src="https://travis-ci.org/kyasuda2003/taurus.svg?branch=master"></a>

Taurus chatting service. A Node JS chat service. Small, scalable and sturdy for your own organisational purpose.

<h3>Installation:</h3>

Taurus requires the installation via root/administaor account.
<pre>
sudo npm install taurus
</pre>

Taurus is default to port#3131.

<pre>
curl http://localhost:3131/<file_name>
</pre>

Taurus Project Page:
http://kyasuda2003.github.io/taurus/

Taurus client example
<a href="https://github.com/kyasuda2003/taurus-client">
https://github.com/kyasuda2003/taurus-client
</a>

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
