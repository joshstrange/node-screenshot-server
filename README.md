# Screenshot

Simple Dropbox-powered screenshot single page site originally forked from [sammarks/screenshot](https://github.com/sammarks/screenshot). Note at this time this setup is dependent on you installing a OS X app called [UpShot](http://upshot.it/). If you have windows/linux this guide will not work for you unless you use different software. If anyone that uses either of these OSes for personal computing would like to provide instructions for either/both then I will accept your pull request.

Example: [Screenshot of Github](http://s.joshstrange.com/VPmZ.png)


## Steps to setup

### Step 1

Clone this repo

````
git clone https://github.com/joshstrange/screenshot.git
````

cd into cloned repo

````
cd screenshot
````

edit the index.html file with your public dropbox userId

````
nano index.html
````

Near the top of the page you will see the following which you will replace with your public dropbox userId

````
var userId = 2148004;
````

You can get your userId by right clicking any file in your public folder and selecting "Copy Public Link". The public link will look like this:

````
https://dl.dropboxusercontent.com/u/XXXXXXX/filename.png
````

Where the `XXXXXXX` is your userId

### Step 2

Setup your [S3](http://aws.amazon.com/s3) bucket. 

* Login to your [AWS account management console](https://console.aws.amazon.com/console/home)
* Go to the [S3 Page](https://console.aws.amazon.com/s3/home)
* Click "Create bucket"
* Name the bucket the same as the URL you want to put this on (ex: s.joshstrange.com). If you want to put this on the root then you will need to setup both a www.yourdomainname.com and yourdomain.com bucket covered [here](http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html).
* Click "Create"
* Expand the "Permissions" section on your newly created bucket
* Click "Add Bucket Policy"
* Copy the following into the policy pop-up and edit it to your bucket name:

````
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AddPerm",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::s.joshstrange.com/*"
		}
	]
}
````
* Click "Save" then "Close"
* Now expand the "Static Website Hosting" section
* Click the radio box next to "Enable Website Hosting"
* Set both the Index and Error document to "index.html"
* Click "Save"
* Now click on your bucket name on the left pane which will open your bucket
* Click the "Upload" button and browse to where you cloned the repo and select the `index.html` file


### Step 3

Setup your DNS.

#### AWS Route 53

* Go to the [Route 53 control panel](https://console.aws.amazon.com/route53/home)
* Select your root domain name
* Click "Go to Record Sets"
* Click "Create Record Set"
* Type in the name, in my previous example this would simply be "s"
* Leave "Type" as "A - IPv4 address"
* Select the "Yes" radio checkbox for "Alias"
* Start typing the name of your S3 bucket and it should autocomplete it for you
* Click "Create"

#### Other DNS provider

* Log into your DNS Provider
* Navigate to the DNS settings for your domain
* Add a new record of type "CNAME"
* Fill out the "Name" box with your domain (ex: s.joshstrange.com)
* Fill out the "Value" box with your domain name plus ".s3.amazonaws.com." (ex: s.joshstrange.com.s3.amazonaws.com.)
* Save the Record/Zone
* AWS provided guide for this is [here](http://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html#VirtualHostingCustomURLs)

### Step 4 (OS X)

Install [UpShot](http://upshot.it/)

* Download and install [UpShot](http://upshot.it/)
* Launch UpShot
* Follow UpShot instructions for retrieving your dropbox public userId
* Click on the UpShot icon in your status bar and select "Preferences..."
* In the last section select "Use custom URL"
* Enter your URL from before with "http://" and the trailing "/"
* Hit the enter key to save your URL
* Now when you take a screenshot UpShot will copy the URL into your Copy/Paste buffer for you to share

