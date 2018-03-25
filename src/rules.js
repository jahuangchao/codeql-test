/**
 * SEO rule: count the number of tags without specified attribute
 */
function rule_no_attr_count(tags, attr_name) {
    var count = -1;
    var is_skip = false;

    // rule description
    this.get_desc = function() {
        return `Count the number of <${tags.join(" -> ")}> tag without "${attr_name}" attribute.`;
    };

    // enable or disable skip flag
    this.set_skip = function(is_skip_rule) {
        is_skip = is_skip_rule;
    };

    // return skip flag value
    this.get_skip = function() {
        return is_skip;
    };

    // verify SEO rule on ${import_html}
    this.verify = function(import_html) {
        var tag_path = tags.join(' ');
        count = import_html(`${tag_path}:not([${attr_name}])`).length;
    };

    // return the verification result
    this.get_report = function(import_html) {
        if(count < 0) {
            // no test report available, call verify to create one
            this.verify(import_html);
        }

        var msg = `There are ${count} <${tags.join(" -> ")}> tag without "${attr_name}" attribute.`;
        return (count)? msg : "";
    };

    return this;
}

/**
 * SEO rule: check if specified tag exists
 */
function rule_no_child_tag(tags) {
    var is_no_child_tag = null;
    var is_skip = false;

    // rule description
    this.get_desc = function() {
        return `Check if the <${tags.join(" -> ")}> tag exists.`;
    };

    // enable or disable skip flag
    this.set_skip = function(is_skip_rule) {
        is_skip = is_skip_rule;
    };

    // return skip flag value
    this.get_skip = function() {
        return is_skip;
    };

    // verify SEO rule on ${import_html}
    this.verify = function(import_html) {
        var tag_path = tags.join(' ');
        is_no_child_tag = (import_html(`${tag_path}`).length == 0);
    };

    // return the verification result
    this.get_report = function(import_html) {
        if(is_no_child_tag === null) {
            // no test report available, call verify to create one
            this.verify(import_html);
        }

        var msg = `This HTML doesn't have <${tags.join(" -> ")}> tag.`;
        return (is_no_child_tag)? msg : "";
    };

    return this;
}

/**
 * SEO rule: check if the tag contains specific attribute value exists
 */
function rule_no_attr_value(tags, attr_name, attr_value) {
    var is_no_attr_value = null;
    var is_skip = false;

    // rule description
    this.get_desc = function() {
        return `Check if the <${tags.join(" -> ")}> tag contains "${attr_name}=${attr_value}" attribute.`;
    };

    // enable or disable skip flag
    this.set_skip = function(is_skip_rule) {
        is_skip = is_skip_rule;
    };

    // return skip flag value
    this.get_skip = function() {
        return is_skip;
    };

    // verify SEO rule on ${import_html}
    this.verify = function(import_html) {
        var tag_path = tags.join(' ');
        is_no_attr_value = (import_html(`${tag_path}[${attr_name}*=${attr_value}]`).length == 0);
    };

    // return the verification result
    this.get_report = function(import_html) {
        if(is_no_attr_value === null) {
            // no test report available, call verify to create one
            this.verify(import_html);
        }

        var msg = `No <${tags.join(" -> ")}> tag contains "${attr_name}=${attr_value}" attribute.`;
        return (is_no_attr_value)? msg : "";
    };

    return this;
}

/**
 * SEO rule: check if the number of specified tag is larger than ${maximum}
 */
function rule_tag_exceed_max(tags, maximum) {
    var is_exceeded = null;
    var is_skip = false;

    // rule description
    this.get_desc = function() {
        return `Check if the number of <${tags.join(" -> ")}> tags exceed ${maximum}.`;
    };

    // enable or disable skip flag
    this.set_skip = function(is_skip_rule) {
        is_skip = is_skip_rule;
    };

    // return skip flag value
    this.get_skip = function() {
        return is_skip;
    };

    // verify SEO rule on ${import_html}
    this.verify = function(import_html) {
        var tag_path = tags.join(' ');
        is_exceeded = import_html(`${tag_path}`).length > maximum;
    };

    // return the verification result
    this.get_report = function(import_html) {
        if(is_exceeded === null) {
            // no test report available, call verify to create one
            this.verify(import_html);
        }

        var msg = `This HTML has more than ${maximum} <${tags.join(" -> ")}> tag.`;
        return (is_exceeded)? msg : "";
    };

    return this;
}

module.exports = {
    "rule_no_attr_count" : rule_no_attr_count,
    "rule_no_child_tag"  : rule_no_child_tag,
    "rule_no_attr_value" : rule_no_attr_value,
    "rule_tag_exceed_max": rule_tag_exceed_max
};