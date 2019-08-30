# Node Starter App

Quick start application setup with sensible defaults baked in.  

**Demo:** https://cds-node-starter.herokuapp.com

Should you use this?  It depends ;)

Don't like the way it's setup -> it's an Express server so do your thing `app.js`

## Install + Dev Mode

```bash
npm run install
npm run dev
```

## Adding Routes

1) Create a new route directory 
> ➡️ or copy past and rename the routes/_sample_route 

2) Add your route files
- controller
- view file 
- optionally schema.js (if this is a form view)

```bash
step5.controller.js //express route handler
step5.pug //the view file
schema.js //if this is a form
```

3) Register the route via routes.config.js

```javascript
// config/routes.config.js
... 

const routes = [
  { name: "step5", path: "/step5" },
];

...

//Add the path to your route code in configRoutes
const configRoutes = app => {
   ...
   require("../routes/step5/step5.controller")(app);
}
```

Note: Delete unused route(s) directories as needed.

## Passing data to views

Saved data is available via getSessionData(req)

```javascript
app.get(route.path, (req, res) => {
    res.render(name, {
      data: getSessionData(req),
      name
    });
  });
```

```pug
 +textInput('form.passport_expiry', null, 'form.passport_expiry.desc')(class='w-3-4', id='expiry' name='expiry', autofocus, value=data.expiry)
    
input(name='name', type='hidden', value=name)
input(name='nonce', type='hidden', value=nonce)
```

## Form step redirects

Redirects are handled via doRedirect based on a `name` value (the name of the current route) sent via in the req.body. The doRedirect function will do a look up for the next route based on the routes config. 

```javascript
// step5.controller post route
app.post(
    route.path,
    checkNonce,
    checkSchema(Schema),
    checkErrors(name),
    doRedirect
  );
```

For cases where the redirect is not straight forward you can handle manually.
```javascript
(req, res, next) => {
    const confirm = req.body.confirm;
    if (confirm === "Yes") {
      const nextRoute = getNextRoute(name);
      return res.redirect(nextRoute.path);
    }

    res.send("you said no");
}
```

## Locales

Text on pages is supplied via ids

```pug
block variables
  -var title = __('personal.title')

block content

  h1 #{title}

  div
    p #{__('personal.intro')}
  form.cra-form(method='post')
```

```json
// locales/en.json
"personal.title": "Personal Information",
"personal.intro": "Intro copy goes here",
"form.fullname": "Full name",
```

## Form Validation
- Form validation is built into the form schema files and use [validator.js](https://github.com/validatorjs/validator.js#validators) to validate input


## Goals
- Accessible out of the box
- Keep code routes / view(s) / schemas as portable (self-contained) as possible.
- If code i.e custom validators from the routes can be re-used it should be pulled up to the `app` level
- App level code (app.js) should be touched a little as possible when building a new app based on the starter
- Implement best practices from [Form design: from zero to hero all in one blog post](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post)

> Routes should act like a plugin.
i.e. Project B has a page you need, copy the route directory and add that route to your config.

## What this project is not
- This project aims to allow you to hit the ground running.  It's not meant to be a be all end all defacto solution.

## Todo
- Adding tests for sample routes
- Adding more tests for utility functions


## Notes
This project is based on the orginal code https://github.com/cds-snc/cra-claim-tax-benefits it was born out of wanting to use that code as a base without the need to remove the unused parts everytime a new project is started.

See: 
- https://github.com/cds-snc/notification-demo-service/commit/ab24e79268626e1431b301fb91614b40f9615086
- https://github.com/cds-snc/2620-passport-renewal/commit/eb41bf83825b9d8c4a56427e0cd199ccc23089eb
