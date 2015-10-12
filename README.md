#Django Frontend
User data visualization platform for our setup postgres db.

The service can be started using the init script installed via Puppet:
```sh
$ sudo service seadssite start
```
The frontend is supposed to be the way users can interact and view data that devices are collecting, and sending to the server.

##Installation

Installation of the Go Landing Zone, Python API, and Django Frontend can be automated by using the Puppet modules included in the repository. The puppet modules are written for and assume to be executed on an Ubuntu 14.04 x64 Linux server. First you must install the prerequisites for running Puppet. From the terminal, execute:
```sh
$ sudo apt-get install puppet git
```
It is recommended that you also install fail2ban with the following command:
```sh
$ sudo apt-get install fail2ban
```

Copy the Puppet files onto the server (for example, by cloning the repository) and change to the DB directory.
```sh
$ cd Seads-Front-Back/
```
If desired, configure the UNIX application user’s password in puppet/modules/config. First add the user credentials to manifests/credentials.pp, then uncomment the password definitions in config/manifests/init.pp.
```sh
$ cd puppet/modules/config
$ nano manifests/credentials.pp
$ nano manifests/init.pp
$ cd ../../..
```

Copy the files to the /etc/puppet directory, and execute Puppet:
```sh
$ sudo rsync -avc puppet/ /etc/puppet/
$ sudo puppet apply puppet/manifests/site.pp
```
After Puppet has executed the modules correctly, the server should be listening on ports 8080 and 9000. Verify with netstat:
```sh
$ netstat -tln | egrep ':(8080|9000|8000)'
```
