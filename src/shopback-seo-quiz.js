const cheerio = require("cheerio");
const fs = require("fs");
const rules = require("./rules.js");

const IO_TYPE_FILE    = 0;
const IO_TYPE_STREAM  = 1;
const IO_TYPE_CONSOLE = 2;

const IO_TYPES = {
    "FILE": IO_TYPE_FILE,
    "STREAM": IO_TYPE_STREAM,
    "CONSOLE": IO_TYPE_CONSOLE
};

var doc = null;
var reports = null;
var seo_rules = [];

/**
 * load html file from file
 */
function load_html_by_file(fp) {
    return new Promise((resolve, reject) => {
        fs.readFile(fp, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

/**
 * load html file from readable stream
 */
function load_html_by_stream(rs) {
    return new Promise((resolve, reject) => {
        var html = "";
        rs.on('data', (chunk) => {
            html += chunk;
        });

        rs.on('error', (err) => {
            reject(err);
        })

        rs.on('end', () => {
            resolve(html);
        });
    })
}

/**
 * load html file
 */
async function load_html(load_type, src, options) {
    var html = null;
    if(load_type == IO_TYPE_FILE) {
        html = await load_html_by_file(src);
    } else if(load_type == IO_TYPE_STREAM){
        html = await load_html_by_stream(src);
    } else {
        throw new Error(`Unsupport input type: ${load_type}`);
    }

    if(html) {
        doc = cheerio.load(html);

        // add pre-defined rules
        seo_rules = [
            new rules.rule_no_attr_count(["img"], "alt"),
            new rules.rule_no_attr_count(["a"], "rel"),
            new rules.rule_no_child_tag(["head", "title"]),
            new rules.rule_no_attr_value(["head", "meta"], "name", "descriptions"),
            new rules.rule_no_attr_value(["head", "meta"], "name", "keywords")
        ];
        var max_strong = 15;
        var max_h1 = 1;
        if(options) {
            if("tag_strong_max" in options) {
                try {
                    // set to user specified value
                    max_strong = parseInt(options.tag_strong_max);
                } catch(ex) {
                    max_strong = 15;
                };
            }

            if("tag_h1_max" in options) {
                try {
                    // set to user specified value
                    max_h1 = parseInt(options.tag_h1_max);
                } catch(ex) {
                    max_h1 = 1;
                };
            }
        }
        add_seo_rule(new rules.rule_tag_exceed_max(["strong"], max_strong));
        add_seo_rule(new rules.rule_tag_exceed_max(["h1"], max_h1));
    } else {
        throw new Error(`Fail to load html, load type: ${load_type})`);
    }
}

/**
 * verify rules in ${seo_rules}
 */
function verify() {
    reports = [];
    for(var idx in seo_rules) {
        var rule_idx = parseInt(idx) + 1; // rule index starts from 1
        if(!seo_rules[idx].get_skip()) {
            console.log(`Rule ${rule_idx}: ${seo_rules[idx].get_desc()}`);
            var rpt = seo_rules[idx].get_report(doc);
            if(rpt) {
                reports.push(`Rule ${rule_idx}: ${rpt}`);
            }
        } else {
            // skip rule
            console.log(`SKIP rule ${rule_idx}`);
        }
    }
}

/**
 * add a rule to ${seo_rules}
 */
function add_seo_rule(new_rule) {
    seo_rules.push(new_rule);
}

/**
 * enable(${is_skip}: true) or disable(${is_skip}: false) rule's skip flag,
 * ${skip_rule} can be a rule object or the rule-index value
 * rule-index = 1 + ${seo_rules}.indexOf(rule) + 1 (from 1 to ${seo_rules}.length)
 */
function skip_seo_rule(skip_rule, is_skip) {
    try {
        var idx = parseInt(skip_rule);
        if(isNaN(idx)) {
            if("set_skip" in skip_rule) {
                // set skip flag through rule object
                skip_rule.set_skip(is_skip);
            } else {
                throw new Error(`Invalid rule object: ${skip_rule}`);
            }
        } else {
            if((idx < 1) || (idx > seo_rules.length)) {
                throw new Error(`Invalid rule index value: ${idx}`);
            } else {
                // set skip flag through rule index
                seo_rules[idx - 1].set_skip(is_skip);
            }
        }
    } catch(ex) {
        console.error(ex);
    }
}

/**
 * call verify function to get report and output to file, writable stream or console
 */
function report(report_type, dest) {
    console.log("==========    SEO  RULES    ==========");
    verify(seo_rules);  // run verify to get the latest report

    var output = "========== SEO REPORT BEGIN ==========\n";
    output += (reports.length? reports.join("\n") : "No SEO defects are detected.");
    output += "\n==========  SEO REPORT END  ==========\n";

    try {
        if(report_type == IO_TYPE_FILE) {
            fs.writeFileSync(dest, output, "utf8");
            console.log(`\nOutput report to file "${dest}".`);
        } else if(report_type == IO_TYPE_STREAM) {
            dest.write(output);
            dest.end();

            dest.on('error', (err) => {
                throw new Error(err);
            })

            dest.on('finish', () => {
                console.log(`\nOutput report to writable stream.`);
            });
        } else if(report_type == IO_TYPE_CONSOLE) {
            console.log(`\n${output}`);
        } else {
            throw new Error(`Unsupport output type: ${report_type}`);
        }
    } catch(ex) {
        console.error(ex);
    }
}

module.exports = {
    "io_types" : IO_TYPES,
    "load_html": load_html,
    "report"   : report,

    "rules": rules,

    "add_seo_rule" : add_seo_rule,
    "skip_seo_rule": skip_seo_rule
};
