## Update

I've since decided to stop using this because of issues with HipChat (No offence to them, it was bound to happen eventually. I was able to put in a work-around for Slack but I'd rather not keep chasing every client and there is no good reason to use node anymore) not in-lining my screenshots. I considered just setting up a cname record and making upshot append "/u/userId/Screenshot/" to the url but that would require breaking all previous links and making my links a little uglier. For now I've just added "rewrite ^(.*)$ https://dl.dropboxusercontent.com/u/2148004/Screenshots$1 break;" to the first line of the "location" block. If I come up with a more elegant solution than just redirecting (that doesn't require serving the images from the box) I'll update here.


# Screenshot

This is a NodeJS based version of the static-only version I previously created which can be found [here](https://github.com/joshstrange/screenshot)

Simple Dropbox-powered screenshot single page site originally forked from [sammarks/screenshot](https://github.com/sammarks/screenshot). Note at this time this setup is dependent on you installing a OS X app called [UpShot](http://upshot.it/). If you have windows/linux this guide will not work for you unless you use different software. If anyone that uses either of these OSes for personal computing would like to provide instructions for either/both then I will accept your pull request.

Example: [Screenshot of Github](http://s.joshstrange.com/VPmZ.png)


## Steps to setup

### Step 1

Clone this repo

````
git clone https://github.com/joshstrange/node-screenshot-server.git
````

cd into cloned repo

````
cd screenshot
````

Run npm install
````
npm install
````

edit the index.js file with your public dropbox userId

````
nano index.js
````

Near the top of the file you will see the following which you will replace with your public dropbox userId

````
var userId = 2148004;
````

You can get your userId by right clicking any file in your public folder and selecting "Copy Public Link". The public link will look like this:

````
https://dl.dropboxusercontent.com/u/XXXXXXX/filename.png
````

Where the `XXXXXXX` is your userId

In the same file pick where you want to redirect users to if they visit your screenshot domain without a passing an image filename by editing the variable named:

````
var redirectRoot = 'http://joshstrange.com';
````

### Step 2

Install NodeJS and nginx on your server (instruction not included at this time).

### Step 3

Create a new file in `/etc/nginx/sites-available` named 'screenshot'
````
sudo nano /etc/nginx/sites-available/screenshot
````

and paste in the following

````
upstream screenshot {
    server 127.0.0.1:19910;
    keepalive 8;
}

# the nginx server instance
server {
    listen 0.0.0.0:80;
    server_name s.joshstrange.com;
    access_log /var/log/nginx/screenshot.log;

    # pass the request to the node.js server with the correct headers and much more can be added, see nginx config options
    location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;

      proxy_pass http://screenshot/;
      proxy_redirect off;
    }
 }
````

Then link the file into your sites-enabled folder

````
ln -s /etc/nginx/sites-available/screenshot /etc/nginx/sites-enabled/screenshot
````


### Step 4

Run `node index.js` in the directory you have this installed. You can put this in a screen if you want to keep it running after you've disconnected.

### Optional

Setup this up as a service

````
sudo nano /etc/init/screenshot.conf
````

Paste in the following editing as need

````
description "node.js screenshot server"
author      "Josh Strange"

# used to be: start on startup
# until we found some mounts weren't ready yet while booting:
start on started mountall
stop on shutdown

# Automatically Respawn:
respawn
respawn limit 99 5

script
    # Not sure why $HOME is needed, but we found that it is:
    export HOME="/root"

    exec /usr/local/bin/node /root/node-screenshot-server/index.js >> /var/log/screenshot.log 2>&1
end script

post-start script
   # Optionally put a script here that will notifiy you node has (re)started
   # /root/bin/hoptoad.sh "node.js has started!"
end script
````

Now you can `sudo service screenshot start` and it will run in the background (it will also start at boot).


### Step 5 (OS X)

Install [UpShot](http://upshot.it/)

* Download and install [UpShot](http://upshot.it/)
* Launch UpShot
* Follow UpShot instructions for retrieving your dropbox public userId
* Click on the UpShot icon in your status bar and select "Preferences..."
* In the last section select "Use custom URL"
* Enter your URL from before with "http://" and the trailing "/"
* Hit the enter key to save your URL
* Now when you take a screenshot UpShot will copy the URL into your Copy/Paste buffer for you to share
