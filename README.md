# great-unknown
Podcast Manager Web App
======================

Home Page & Team Member Information
--------------------
![Home Page](http://i.imgur.com/bjOJIQp.png)

**Members**|**Username**
-----------|-------------
Kyle Lin   | kylelin47
Joachim Jones|jonesguy14
Qian Wang|qianwang1013
Matthew Tschiggfrie|mtschiggfrie
Jinchi Liu|jliu8023

Helpful Information
-----------------------
**Setup**

1. git clone https://github.com/kylelin47/great-unknown.git
2. cd great-unknown
3. npm install
4. Download the folder 'codemwnci' from https://github.com/codemwnci/markdown-editpreview-ng.js/tree/master/lib/codemwnci and place it in public/lib
5. Set relevant environment variables: FACEBOOK_ID, FACEBOOK_SECRET, TWITTER_KEY, TWITTER_SECRET, NODE_ENV
6. Create a file called 'secretkey.js' in public\modules\podcasts\controllers containing your Amazon credentials for a properly configured IAM user in this format:
```
var amazon_credentials = 
		{
		  bucket: 'my-bucket',
		  access_key: 'my-access-key',
		  secret_key: 'my-secret-key',
		  region: 'my-region-1'
		};
```
If region is not provided, it will assume us-east-1, which is the default in Amazon S3 if you have not configured it.

Start mongodb, then 'grunt' starts the server, 'grunt test' runs tests, view at localhost:3000

**Development Information**

To emulate a website for things like Facebook sharing:

http://localtunnel.me/

To add new packages and have it added to package.json:
```
npm install <pkg> --save
```
or
```
bower install <pkg> --save
```

We're using tabs, not spaces

To use a new Bootstrap Theme:
- Copy this file over your current bootstrap.css in public/lib/bootstrap/dist/css
- http://bootswatch.com/flatly/bootstrap.css
- Then delete bootstrap-theme.css from that same folder
- Now it should look cool

**User Stories**

https://trello.com/b/zHEzMTHa/great-unknown-cen3031

**Protractor Testing**
- start grunt
- may need 'npm install -g protractor'
- in new cmd prompt enter "webdriver-manager start"
- in new cmd prompt cd to Protractor folder in great-unknown
- enter "protractor conf.js"
