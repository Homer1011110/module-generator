module.exports = (template, context) =>
    template.replace(/\[tpl\](.*?)\[\/tpl\]/g, (match, key) => context[key])