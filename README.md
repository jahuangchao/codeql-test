<h1 align="center">shopback-seo-quiz</h1>
<h5 align="center">A Node.js package to let user scan a HTML content and show all of the SEO defects.</h5>

<br />

```js
const sb = require('shopback-seo-quiz');

sb.load_html(sb.io_types.FILE, `${__dirname}/test.html`).then(() => {
    // add first custom SEO rule
    var new_rule_1 = new sb.rules.rule_tag_exceed_max(["img"], 1);
    sb.add_seo_rule(new_rule_1);

    // add second custom SEO rule
    var new_rule_2 = new sb.rules.rule_no_attr_value(["head", "meta"], "name", "robots");
    sb.add_seo_rule(new_rule_2);

    // rule indices less than 8 are pre-defined rules
    // skip pre-defined SEO rule 5
    sb.skip_seo_rule(5, true);

    // skip first custom SEO rule
    sb.skip_seo_rule(new_rule_1, true);

    // get test report and show on console
    sb.report(sb.io_types.CONSOLE);
}).catch((err) => {
    console.error(err);
})
```

## Requirements
Node.js 8.0 or greater

## Installation
`npm install shopback-seo-quiz`

## Predefined Rules
1. Detect if there are any `<img />` tags without `alt` attribute<br />
2. Detect if there are any `<a />` tags without `rel` attribute<br />
3. Detect if there is any header that doesn’t have `<title>` tag<br />
4. Detect if there is any header that doesn’t have `<meta name="descriptions" … />` tag<br />
5. Detect if there is any header that doesn’t have `<meta name="keywords" … />` tag<br />
6. Detect if there are more than 15 `<strong>` tag in HTML <br />
7. Detect if a HTML have more than 1 `<h1>` tag<br />

## API

### Custom pre-defined rule arguments
Use third argument of load_html method to customize pre-defined rule arguments.<br/>
Two options can be set by user: `tag_strong_max` and `tag_h1_max`.

```js
const sb = require('shopback-seo-quiz');

var options = {"tag_strong_max": 8, "tag_h1_max": 2};
sb.load_html(sb.io_types.FILE, `${__dirname}/test.html`, options).then(() => {
  ...
}).catch((err) => {
  ...
})
```

### Rules
There are 4 different types of rule can be add to SEO rules: `rule_no_attr_count`, `rule_no_child_tag`,
`rule_no_attr_value` and `rule_tag_exceed_max`.<br/>
Use `add_seo_rule` method to add new SEO rule.

```js
const sb = require('shopback-seo-quiz');
const rules = sb.rules;

// create rules
var pre_def_rule_1 = new rules.rule_no_attr_count(["img"], "alt");
var pre_def_rule_3 = new rules.rule_no_child_tag(["head", "title"]);
var pre_def_rule_4 = new rules.rule_no_attr_value(["head", "meta"], "name", "descriptions");
var pre_def_rule_6 = new rules.rule_tag_exceed_max(["strong"], 15);

// Add rules
sb.add_seo_rule(pre_def_rule_1);
sb.add_seo_rule(pre_def_rule_3);
sb.add_seo_rule(pre_def_rule_4);
sb.add_seo_rule(pre_def_rule_6);
sb.add_seo_rule(new rules.rule_no_attr_count(["a"], "rel"));
```

### Skip rules
Use `skip_seo_rule` method to enable/disable skip flag of rules.<br/>
The first parameter can be a rule object or rule index.<br />
Skip the rule if second parameter is set to `true`.<br />
(rule indices less than 8 are pre-defined rules)

```js
const sb = require('shopback-seo-quiz');

sb.load_html(sb.io_types.FILE, `${__dirname}/test.html`).then(() => {
    // add first custom SEO rule
    var new_rule_1 = new sb.rules.rule_tag_exceed_max(["img"], 1);
    sb.add_seo_rule(new_rule_1);

    // skip pre-defined SEO rule 5
    sb.skip_seo_rule(5, true);

    // skip first custom SEO rule
    sb.skip_seo_rule(new_rule_1, true);

    // get test report and show on console
    sb.report(sb.io_types.CONSOLE);
}).catch((err) => {
    ...
})
```

### Input
There are 2 input types: `sb.io_types.FILE` and `sb.io_types.STREAM`.<br/>
Use `load_html` method to load input HTML.

```js
const sb = require('shopback-seo-quiz');
sb.load_html(sb.io_types.FILE, `${__dirname}/test.html`).then(() => {
  ...
}).catch((err) => {
  ...
})
```

### Output
There are 3 output types: `sb.io_types.FILE`, `sb.io_types.STREAM` and `sb.io_types.CONSOLE`.<br/>
Use `report` method to get SEO verification report.

```js
const sb = require('shopback-seo-quiz');
sb.load_html(sb.io_types.FILE, `${__dirname}/test.html`).then(() => {
  ...
  sb.report(sb.io_types.FILE, `${__dirname}/test.log`);
}).catch((err) => {
  ...
})
```

## Test package
Run `npm test` in the shopback-seo-quiz module.