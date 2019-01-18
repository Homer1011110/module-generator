module.exports = (template, context) =>
    template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key])