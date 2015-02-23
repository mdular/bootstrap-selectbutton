/**
 * bootstrap dropdown button form proxy
 * @author Markus J Doetsch
 *
 *
 * TODO: detect hidden field (current behaviour) or select input (would create better accessibility)
 *       as proxy and use accordingly.
 *
 * @depends jQuery
 * @param options
 */
/* global $, jQuery */

jQuery.fn.selectButton = function (options) {
    "use strict";

    // merge options over default settings
    var settings = $.extend({
        initOnly    : false
    }, options );

    // populate button label from hidden field (browser back-button)
    this.each(function () {
        var $this    = $(this),
            $field   = $this.find('input[type=hidden]'),
            val      = $field.val(),
            text     = $this.find('[data-val="' + val + '"]').text();

        $this.originalLabel = $this.find('.selected-option').text();

        $this.on('reset', function () {
            $this.find('.selected-option').text($this.originalLabel);
        });

        if (val) {
            $this.find('.selected-option').text(text);
        }
    });

    // initialise only -- when re-initialising the plugin
    // TODO: i guess there probably is a way to detect / store if the plugin
    //       has already been initialised
    if (settings.initOnly) {
        return;
    }

    // populate button label, set hidden field on selection
    $('body').on('click', '.select-dropdown .dropdown-menu a', function (e) {
        var $this   = $(this),
            $option = $(this).parents('.select-dropdown'),
            $fields = $option.find('input[type=hidden]');

        if ($option.length > 0) {
            var val = $this.data('val');

            if (!val) {
                return;
            }

            $option.find('.selected-option').text($this.text());

            // output to single hidden field proxy
            $fields.val(val.toString());
            $fields.trigger('change');
            e.preventDefault();
        }
    });

    // update button label on update
    $('body').on('update', '.select-dropdown input', function (e) {
        var $field = $(this),
            $dropdown = $field.parents('.select-dropdown');

        if ($field.val()) {
            var $option = $dropdown.find('a[data-val=' + $field.val() + ']');

            if($option) {
                $dropdown.find('.selected-option').text($option.text());
            }
        }
    });
};
