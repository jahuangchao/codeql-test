const sb = require('shopback-seo-quiz');

sb.load_html(sb.io_types.FILE, `${__dirname}/no-defect.html`).then(() => {
    // add first custom SEO rule
    var new_rule_1 = new sb.rules.rule_tag_exceed_max(["img"], 1);
    sb.add_seo_rule(new_rule_1);

    // add second custom SEO rule
    var new_rule_2 = new sb.rules.rule_no_attr_value(["head", "meta"], "name", "robots");
    sb.add_seo_rule(new_rule_2);

    // get test report and save to file "no-defect.log"
    console.log('\n--------------> Test report of "no-defect.html"');
    sb.report(sb.io_types.FILE, `${__dirname}/no-defect.log`);
}).catch((err) => {
    console.error(err);
})

// change arguments of pre-defined SEO rule 6 and 7
var options = {"tag_strong_max": 8, "tag_h1_max": 1};
sb.load_html(sb.io_types.FILE, `${__dirname}/test.html`, options).then(() => {
    // add first custom SEO rule
    var new_rule_1 = new sb.rules.rule_tag_exceed_max(["img"], 1);
    sb.add_seo_rule(new_rule_1);

    // add second custom SEO rule
    var new_rule_2 = new sb.rules.rule_no_attr_value(["head", "meta"], "name", "robots");
    sb.add_seo_rule(new_rule_2);

    // skip pre-defined SEO rule 5
    sb.skip_seo_rule(5, true);

    // skip first custom SEO rule
    sb.skip_seo_rule(new_rule_1, true);

    // get test report and show on console
    console.log('\n--------------> Test report of "test.html"');
    sb.report(sb.io_types.CONSOLE);
}).catch((err) => {
    console.error(err);
})
