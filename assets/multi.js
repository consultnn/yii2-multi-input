;(function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var multiInput = "multiInput",
        defaults = {
            maxIndex: 0
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = multiInput;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var plugin = this;

            $(this.element).on('click', '.add-row', function(){
                plugin.addRow();
                return false;
            });
            $(this.element).on('click', '.remove-row', function(){
                plugin.removeRow(this);
                return false;
            });

            $(this.element).on('click', '.clone-row', function(){
                plugin.cloneRow(this);
                return false;
            });
        },
        addRow: function () {
            this.settings.maxIndex++;
            var template = this.settings.template.replace(/#index#/g, this.settings.maxIndex);
            var newRow = $.parseHTML(template);
            $(newRow).removeClass('template');
            //var newRow = this._templateRow...replace('{$id}', this.maxIndex);
            $(this.element).append(newRow).trigger('multiInput:addRow', [newRow]);
        },
        removeRow: function(element) {
            $(element).parent().remove();
            $(this.element).trigger('multiInput:removeRow');
        },
        cloneRow: function(element) {
            var sourceRow = $(element).parent();
            this.settings.maxIndex++;
            var template = this.settings.template.replace(/#index#/g, this.settings.maxIndex);
            var newRow = $.parseHTML(template);
            $(newRow).removeClass('template');

            sourceRow.find('input[type="text"], input[type="hidden"]').each(function (i, el) {
                var match = $(el).attr('name').match(/\[\w+\]$/gi);
                var name = match[0];
                $(newRow).find('input[name*="' + name + '"]').val($(el).val());
            });

            sourceRow.find('input[type="checkbox"]').each(function (i, el) {
                var match = $(el).attr('name').match(/\[\w+\]$/gi);
                var name = match[0];
                $(newRow).find('input[name*="' + name + '"]').prop('checked', $(el).prop('checked'));
            });

            sourceRow.find('select').each(function (i, el) {
                if ($(el).prop('multiple')) {
                    var match = $(el).attr('name').match(/\[\w+\]\[\]$/gi);

                    var name = match[0];
                    $(el).find('option').each(function (i, op) {
                        $(newRow).find('select[name*="' + name + '"]')
                            .append($("<option></option>")
                                .attr({
                                    value:$(op).attr('value'),
                                    selected:'selected'
                                }).text($(op).text()));
                    });
                } else {
                    var match = $(el).attr('name').match(/\[\w+\]$/gi);
                    var name = match[0];
                    $(newRow).find('select[name*="' + name + '"]').val($(el).val());
                }
            });
            $(this.element).append(newRow).trigger('multiInput:addRow', [newRow]);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[multiInput] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + multiInput)) {
                $.data(this, "plugin_" + multiInput, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
