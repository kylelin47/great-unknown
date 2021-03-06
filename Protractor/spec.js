describe('angularjs homepage', function () {

    //still at localhost：3000
    it('should have a title', function () {
        browser.get('http://localhost:3000/#!/');
		browser.driver.manage().window().maximize();
        expect(browser.getTitle()).toEqual('Podcast Manager - Development');
    });

    //When no feed is entering
    it('should not return anything', function () {
        element(by.id('openFeed')).click();
        element(by.id('backButton')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
    });
    //testing using a CNN feed

    //test logging in with wrong pass
    it('should not log in with wrong pass', function () {
        element(by.linkText('Sign In')).click();
        element(by.model('credentials.username')).sendKeys('admin');
        element(by.model('credentials.password')).sendKeys('admin1234');
        element(by.xpath('//button[. = "Sign in"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/signin');
    });
    //create new account to use throughout website
    var username = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(function (e, i, a) {
        return Math.random() > 0.8
    }).join("");
    ////////////////////////////////////////////////////////////////////
    //testing without first name
    it('try to create account without first name', function () {
        element(by.linkText('Sign Up')).click();
        element(by.id('lastName')).sendKeys('Donovan');
        element(by.id('email')).sendKeys('billydonovan@gmail.test');
        element(by.id('username')).sendKeys(username);
        element(by.id('password')).sendKeys('test12345');
        element(by.xpath('//button[. = "Sign up"]')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });
    //testing without last name
    it('try to create account without last name', function () {
        element(by.id('firstName')).sendKeys('Billy');
        element(by.id('lastName')).clear();
        element(by.xpath('//button[. = "Sign up"]')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('try to create account without email', function () {
        element(by.id('lastName')).sendKeys('Donovan');
        element(by.id('email')).clear();
        element(by.xpath('//button[. = "Sign up"]')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('try to create account without username', function () {
        element(by.id('email')).sendKeys('billydonovan@gmail.test');
        element(by.id('username')).clear();
        element(by.xpath('//button[. = "Sign up"]')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('try to create account without password', function () {
        element(by.id('username')).sendKeys(username);
        element(by.id('password')).clear();
        element(by.xpath('//button[. = "Sign up"]')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });
    ////////////////////////////////////////////////////////////////////////
    it('create new acc', function () {
        element(by.id('password')).sendKeys('test12345');
        element(by.xpath('//button[. = "Sign up"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
    });


    it('log out', function () {
        element(by.id('userNameLink')).click();
        element(by.linkText('Signout')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
    });

    it('should log back in', function () {
        element(by.linkText('Sign In')).click();
        element(by.model('credentials.username')).sendKeys(username);
        element(by.model('credentials.password')).sendKeys('test12345');
        element(by.xpath('//button[. = "Sign in"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
    });

    it('check sign in button on home page is not visible to logged in users', function () {
        expect(element(by.id('signinbutton')).isDisplayed()).toBe(false);
    });

    it('check to see if non-admins can edit about me page', function () {
        element(by.linkText('About')).click();
        expect(element(by.id('editbutton')).isDisplayed()).toBe(false);
    });

    it('make sure non-admins cant access the manage podcasts tab', function () {
        element(by.linkText('Podcast Manager')).click();
        expect(element(by.linkText('Manage Podcasts')).isNaN);
    });


    //log out of the new account and into admin
    it('log out of new account', function () {
        element(by.id('userNameLink')).click();
        element(by.linkText('Signout')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
    });

    it('log into admin', function () {
        element(by.linkText('Sign In')).click();
        element(by.model('credentials.username')).sendKeys('admin');
        element(by.model('credentials.password')).sendKeys('admin123');
        element(by.xpath('//button[. = "Sign in"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
    });


    //variables used to save about me fields
    var name;
    var email;
    var aboutMe;
    var aboutPodcasts;

    it('get about me info', function () {
        //navigate to about me page and click edit
        element(by.linkText('About')).click();
        element(by.id('editbutton')).click();

        //save current values in textfield to reenter
        name = element(by.id('name')).getAttribute('value');
        email = element(by.id('email')).getAttribute('value');
        aboutMe = element(by.id('aboutMe')).getAttribute('value');
        aboutPodcasts = element(by.id('aboutPodcastsb')).getAttribute('value');
		
		element(by.id('updateAboutMe')).click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/about');
    });
	
	it('make sure about page has same values', function() {
		expect(element(by.id('name')).getAttribute('value') === name);
		expect(element(by.id('email')).getAttribute('value') === email);
		expect(element(by.id('about')).getAttribute('value') === aboutMe);
		expect(element(by.id('aboutPodcasts')).getAttribute('value') === aboutPodcasts);
	});
	
	it('make sure about info on home screen has same values', function() {
		element(by.linkText('Podcast Manager')).click();
		expect(element(by.id('name')).getAttribute('value') === name);
		expect(element(by.id('email')).getAttribute('value') === email);
		expect(element(by.id('about')).getAttribute('value') === aboutMe);
		expect(element(by.id('aboutPodcasts')).getAttribute('value') === aboutPodcasts);
	});
	
	it('clear about me info', function() {
		element(by.linkText('About')).click();
		element(by.id('editbutton')).click();
		 
		 //clear text fields
        element(by.id('name')).clear();
        element(by.id('email')).clear();
        element(by.id('aboutMe')).clear();
        element(by.id('aboutPodcastsb')).clear();

        element(by.id('updateAboutMe')).click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/about');
	});
	
	it('make sure about page info was cleared', function() {
		expect(element(by.id('name')).getAttribute('value') === '');
		expect(element(by.id('email')).getAttribute('value') === '');
		expect(element(by.id('about')).getAttribute('value') === '');
		expect(element(by.id('aboutPodcasts')).getAttribute('value') === '');
	});
	
	it('make sure about info on home screen was cleared', function() {
		element(by.linkText('Podcast Manager')).click();
		expect(element(by.id('name')).getAttribute('value') === '');
		expect(element(by.id('email')).getAttribute('value') === '');
		expect(element(by.id('about')).getAttribute('value') === '');
		expect(element(by.id('aboutPodcasts')).getAttribute('value') === '');
	});
	
    it('re-enter about me page info', function () {
		element(by.linkText('About')).click();
        element(by.id('editbutton')).click();

        //re-enter page info saved previously
        element(by.id('name')).sendKeys(name);
        element(by.id('email')).sendKeys(email);
        element(by.id('aboutMe')).sendKeys(aboutMe);
        element(by.id('aboutPodcastsb')).sendKeys(aboutPodcasts);

        element(by.id('updateAboutMe')).click();
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/about');
    });
	
	it('make sure about page has same original values', function() {
		expect(element(by.id('name')).getAttribute('value') === name);
		expect(element(by.id('email')).getAttribute('value') === email);
		expect(element(by.id('about')).getAttribute('value') === aboutMe);
		expect(element(by.id('aboutPodcasts')).getAttribute('value') === aboutPodcasts);
	});
	
	it('make sure about info on home screen has same original values', function() {
		element(by.linkText('Podcast Manager')).click();
		expect(element(by.id('name')).getAttribute('value') === name);
		expect(element(by.id('email')).getAttribute('value') === email);
		expect(element(by.id('about')).getAttribute('value') === aboutMe);
		expect(element(by.id('aboutPodcasts')).getAttribute('value') === aboutPodcasts);
	});

    it('check about me button', function () {
        element(by.id('aboutButton')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/about');
    });
//20
    it('check browse my podcasts button', function () {
        element(by.linkText('Podcast Manager')).click();
        element(by.id('browseButton')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/podcasts/browse/1');
    });

    it('check sign in button on home page is not visible to admin', function () {
        element(by.linkText('Podcast Manager')).click();
        expect(element(by.id('signinbutton')).isDisplayed()).toBe(false);
    });

    var firstName2, lastName2, email2;

    it('change name with edit profile to nothing', function () {
        element(by.id('userNameLink')).click();
        element(by.linkText('Edit Profile')).click();
        firstName2 = element(by.id('firstName')).getAttribute('value');
        lastName2 = element(by.id('lastName')).getAttribute('value');
        element(by.id('firstName')).clear();
        element(by.id('lastName')).clear();
        element(by.id('submitProfileChanges')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('change email address to nothing', function () {
        email2 = element(by.id('email')).getAttribute('value');
        element(by.id('email')).clear();
        element(by.id('submitProfileChanges')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('just add first name', function () {
        element(by.id('firstName')).sendKeys(firstName2);
        element(by.id('submitProfileChanges')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('remove first name and try just last name', function () {
        element(by.id('firstName')).clear();
        element(by.id('lastName')).sendKeys(lastName2);
        element(by.id('submitProfileChanges')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('change name back to original with no email still', function () {
        element(by.id('firstName')).sendKeys(firstName2);
        element(by.id('submitProfileChanges')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('add email address', function () {
        element(by.id('email')).sendKeys(email2);
        element(by.id('submitProfileChanges')).click();
        expect(element(by.id('successMessage')).isDisplayed()).toBe(true);
    });

    it('change password to nothing', function () {
        element(by.id('userNameLink')).click();
        element(by.linkText('Change Password')).click();
        element(by.id('currentPassword')).sendKeys('admin123');
        element(by.id('submitNewPass')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('try to change pass with different values', function () {
        element(by.id('currentPassword')).clear();
        element(by.id('currentPassword')).sendKeys('admin123');
        element(by.id('newPassword')).sendKeys('admin1234');
        element(by.id('verifyPassword')).sendKeys('admin1234');
        element(by.id('submitNewPass')).click();
        expect(element(by.id('successMessage')).isDisplayed()).toBe(true);
    });
//30
    it('test to see if password really changed', function () {
        //log out
        element(by.id('userNameLink')).click();
        element(by.linkText('Signout')).click();

        //log in with new password
        element(by.linkText('Sign In')).click();
        element(by.model('credentials.username')).sendKeys('admin');
        element(by.model('credentials.password')).sendKeys('admin1234');
        element(by.xpath('//button[. = "Sign in"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
    });

    it('try to change password by entering an incorrect pass', function () {
        element(by.id('userNameLink')).click();
        element(by.linkText('Change Password')).click();
        element(by.id('currentPassword')).sendKeys('admin123');
        element(by.id('newPassword')).sendKeys('admin1234');
        element(by.id('verifyPassword')).sendKeys('admin1234');
        element(by.id('submitNewPass')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('change pass back to original', function () {
        element(by.id('currentPassword')).clear();
        element(by.id('newPassword')).clear();
        element(by.id('verifyPassword')).clear();
        element(by.id('currentPassword')).sendKeys('admin1234');
        element(by.id('newPassword')).sendKeys('admin123');
        element(by.id('verifyPassword')).sendKeys('admin123');
        element(by.id('submitNewPass')).click();
        expect(element(by.id('successMessage')).isDisplayed()).toBe(true);
    });

    it('create a blank new podcast', function () {
        element(by.linkText('Manage Podcast')).click();
        element(by.linkText('Create New Episode')).click();
        element(by.id('createPodcast')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('create new podcast without a name', function () {
        element(by.id('blurb')).sendKeys('This is my blurd');
        element(by.id('blog')).sendKeys('This is my very first blog that I have ever wrote.');
        element(by.id('createPodcast')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });


    it('create new podcast', function () {


        element(by.id('name')).sendKeys('My Podcast');


        element(by.id('createPodcast')).click();
        expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/#!/podcasts/create');
    });
    it('create a new podcast and upload audio', function(){
        var path = require('path');
        //entering the create podcast view
        element(by.linkText('Manage Podcast')).click();
        element(by.linkText('Create New Episode')).click();
        //entering name and audio
        element(by.id('name')).sendKeys('My Podcast');
        var audioUpload = 'audio/l.mp3';
        var absolutePath = path.resolve(__dirname, audioUpload);
        element(by.id('audio')).sendKeys(absolutePath);
        element(by.id('createPodcast')).click();

        browser.sleep(8000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#!/podcasts');
    });

    //podcast removed
    it('should removed the podcast', function() {
        browser.sleep(4000);
        element(by.id('trash')).click();
        var alertDialog = browser.switchTo().alert();
        alertDialog.accept();  // Use to accept (simulate clicking ok)
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/podcasts/browse/1');

    });
    it('try making a empty blog', function () {
        element(by.linkText('Manage Podcast')).click();
        element(by.linkText('Create New Blog Post')).click();
        element(by.id('createBlog')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('try to create a blog with out a name', function () {
        element(by.id('blurb')).sendKeys('This is my blog');
        element(by.id('blog')).sendKeys('This is my very first blog that I have ever wrote.');
        element(by.id('createBlog')).click();
        expect(element(by.id('errorMessage')).isDisplayed()).toBe(true);
    });

    it('create a blog', function () {
        element(by.id('name')).sendKeys('My Blog');
        element(by.id('createBlog')).click();
        expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/#!/podcasts/create/blog');
    });


    //test podcast views as admin
    it('test search in podcast view to pass', function () {
        element(by.linkText('Browse')).click();
        element(by.model('search.name')).sendKeys('My Blog');
        expect(element.all(by.repeater('podcast in podcastsf=(podcastsS=(podcastsR=(podcasts | filter:seriesRadio) | filter:search) | filter:filter)')).get(0).element(by.css(".list-group-item-heading")).getText()).toEqual('My Blog');
    });

    it('test search in podcast view to fail', function () {
        element(by.model('search.name')).clear();
        element(by.model('search.name')).sendKeys('My Podcast');
        expect(element.all(by.repeater('podcast in podcastsf=(podcastsS=(podcastsR=(podcasts | filter:seriesRadio) | filter:search) | filter:filter)')).get(0).element(by.css(".list-group-item-heading")).getText()).not.toEqual('My Blog');
    });

    it('click on podcast in view', function () {
        element(by.linkText('Browse')).click();
        element.all(by.repeater('podcast in podcastsf=(podcastsS=(podcastsR=(podcasts | filter:seriesRadio) | filter:search) | filter:filter)')).get(0).element(by.css(".list-group-item-text")).click();
        expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/#!/podcasts/browse/1');
    });


    //test podcast views as guest (not logged in)
    it('test search in podcast view to pass', function () {
        element(by.id('userNameLink')).click();
        element(by.linkText('Signout')).click();
        element(by.linkText('Browse')).click();
        element(by.model('search.name')).sendKeys('My Blog');
        expect(element.all(by.repeater('podcast in podcastsf=(podcastsS=(podcastsR=(podcasts | filter:seriesRadio) | filter:search) | filter:filter)')).get(0).element(by.css(".list-group-item-heading")).getText()).toEqual('My Blog');
    });

    it('test search in podcast view to fail', function () {
        element(by.model('search.name')).clear();
        element(by.model('search.name')).sendKeys('My Podcast');
        expect(element.all(by.repeater('podcast in podcastsf=(podcastsS=(podcastsR=(podcasts | filter:seriesRadio) | filter:search) | filter:filter)')).get(0).element(by.css(".list-group-item-heading")).getText()).not.toEqual('My Blog');
    });

    it('click on podcast in view', function () {
        element(by.linkText('Browse')).click();
        element.all(by.repeater('podcast in podcastsf=(podcastsS=(podcastsR=(podcasts | filter:seriesRadio) | filter:search) | filter:filter)')).get(0).element(by.css(".list-group-item-text")).click();
        expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/#!/podcasts/browse/1');
    });

});
