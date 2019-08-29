# Node Starter App

Quick start application setup.

## Goals
- Accessible out of the box
- Keep code routes / view(s) / schemas as portable (self-contained) as possible
- If code i.e custom validators from the routes can be re-used it should be pulled up to the `app` level
- App level code (app.js) should be touched a little as possible when building a new app based on the starter

## Adding Routes

1) Create a new route directory

2) Add a controller, view file and optionally a schema.js (if this is a form view)
```bash
step5.controller.js
step5.pug
schema.js
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
      name,
      nonce: generateNonce()
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

## Todo

- Current step validation ... "view access" based on Schema file for previous route.  Given a user tries to visit step 5 directly validation will be checked for step 4 first.
- Adding tests for sample routes
- Adding more tests for utility functions

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


## Notes

This project is based on the orginal code https://github.com/cds-snc/cra-claim-tax-benefits It was born out of wanting to use that code as a base without the need to remove the unused parts everytime a new project is started.

See: 
- https://github.com/cds-snc/notification-demo-service/commit/ab24e79268626e1431b301fb91614b40f9615086
- https://github.com/cds-snc/2620-passport-renewal/commit/eb41bf83825b9d8c4a56427e0cd199ccc23089eb
