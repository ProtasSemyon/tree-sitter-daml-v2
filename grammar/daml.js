const {
  layout,
  sep1
} = require('./util.js');

module.exports = {
  template: $ => seq(
    'template',
    $._constructor,
    optional(
      seq(
        'with',
        field('fields', alias($._record_fields_layout, $.fields))
      )
    ),
    'where',
    field('body', $.template_body)
  ),

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
    optional(
      seq(
        'with',
        field('arguments', alias($._record_fields_layout, $.arguments))
      )
    ),
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
    alias($.with_fields, $.fields)
  )),

  with_fields: $ => layout($, alias($.with_field, $.field)),

  with_field: $ => choice(
    seq($.variable, '=', $._exp),
    alias($.variable, $.punned_field),
    alias('..', $.wildcard)
  ),
};
