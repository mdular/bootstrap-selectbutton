/**
 * bootstrap dropdown button form proxy
 * @author Markus J Doetsch
 *
 * @depends jQuery
 * @param options
 */
/* global $, jQuery */

jQuery.selectButtonDefaults = {
    template: '<div class="btn-group select-dropdown btn-group-justified"><div class="btn-group"><button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button"><span class="selected-option"></span><i class="icon-caret"></i></button><ul class="dropdown-menu" role="menu"></ul></div><input type="hidden"></div>',
    templateItem: '<li><a></a></li>'
};

jQuery.fn.selectButton = function (options) {
    "use strict";

    // merge options over default settings
    var settings = $.extend({
        initOnly     : false,
        template     : $.selectButtonDefaults.template,
        templateItem : $.selectButtonDefaults.templateItem
    }, options);

    // populate button label from hidden field (browser back-button)
    this.each(function () {
        var $this = $(this);

        if ($this.is('select')) {
            var view = $(settings.template).clone();

            $this.children('option').each(function () {
                var $option = $(this),
                    viewItem = $(settings.templateItem).clone();
                viewItem.find('a').html($option.html()).attr('data-val', $option.val());
                viewItem.appendTo(view.find('.dropdown-menu'));
            });

            view.find('.selected-option').text($this.children('option:selected').text());
            view.find('input[type=hidden]').attr('name', $this.attr('name')).val($this.val());

            $this.replaceWith(view);
        }
            
        var $field   = $this.find('input[type=hidden]'),
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
