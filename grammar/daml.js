const {
  layout,
  sep1
} = require('./util.js');

module.exports = {
  template: $ => seq(
    'template',
    field('head', $._type_head),
    optional(seq('with', field('payload', $.daml_fields))),
    'where',
    field('body', $.template_body)
  ),

  daml_fields: $ => layout($, field('field', $.daml_field)),
  daml_field: $ => seq($.variable, ':', $.quantified_type),

  template_body: $ => layout($, field('item', $.template_item)),

  template_item: $ => choice(
    $.signatory,
    $.observer,
    $.ensure,
    $.agreement,
    $.choice
  ),

  choice: $ => seq(
    optional(choice('nonconsuming', 'preconsuming', 'postconsuming')),
    'choice',
    field('name', $._constructor),
    ':',
    field('return_type', $.quantified_type),
    optional(seq('with', field('arguments', $.daml_fields))),
    $.controller,
    optional($.observer),
    field('body', $._exp_do)
  ),

  signatory: $ => seq(
    'signatory', sep1(',', $.expression)
  ),
  observer: $ => seq(
    'observer', sep1(',', $.expression)
  ),
  controller: $ => seq(
    'controller', sep1(',', $.expression)
  ),
  ensure: $ => seq(
    'ensure', $._exp
  ),
  agreement: $ => seq(
    'agreement', $._exp
  ),

  daml_scenario: $ => seq(
    'scenario',
    field('body', $._exp)
  ),

  _exp_with: $ => prec.left('apply', seq(
    $.expression,
    'with',
    $.with_fields
  )),

  with_fields: $ => layout($, $.with_field),

  with_field: $ => choice(
    seq($.variable, '=', $._exp),
    alias($.variable, $.punned_field),
    alias('..', $.wildcard)
  ),
};
