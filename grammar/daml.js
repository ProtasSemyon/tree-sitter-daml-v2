const {
  layout,
  sep1,
  context,
  optional_where,
} = require('./util.js');

const with_separator = $ => choice(repeat1(choice(';', ',')), $._cond_layout_semicolon);

const with_separator_opt = $ => optional(with_separator($));

const sep_by_with_separator = ($, rule) => sep1(with_separator($), rule);

const with_layout_sort = ($, start, rule) => seq(
  choice(start, alias($._cmd_layout_start_explicit, '{')),
  optional(seq(
    with_separator_opt($),
    sep_by_with_separator($, rule),
    with_separator_opt($),
  )),
  $._layout_end,
);

const with_layout = ($, rule) => with_layout_sort($, $._cmd_layout_start, rule);

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
    $.choice,
    $.interface_instance
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

  with_fields: $ => with_layout($, alias($.with_field, $.field)),

  with_field: $ => choice(
    seq($.variable, '=', $._exp),
    alias($.variable, $.punned_field),
    alias('..', $.wildcard)
  ),

  interface: $ => seq(
    'interface',
    context($),
    field('name', $._type_head),
    optional_where($, field('body', $.interface_body)),
  ),

  interface_body: $ => layout($, field('item', $.interface_item)),

  interface_item: $ => choice(
    $.viewtype,
    $.signature,
    $.choice,
    $.interface_instance,
  ),

  viewtype: $ => seq(
    'viewtype',
    field('type', $.quantified_type)
  ),

  interface_instance: $ => seq(
    'interface',
    'instance',
    field('interface', $.quantified_type),
    'for',
    field('for_type', $.quantified_type),
    optional_where($, field('body', $.interface_instance_body))
  ),

  interface_instance_body: $ => layout($, field('item', $.interface_instance_item)),

  interface_instance_item: $ => choice(
    $.view_definition,
    $.function,
    $.bind,
  ),

  view_definition: $ => seq(
    'view',
    '=',
    $._exp,
  ),
};
