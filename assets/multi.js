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
        },
        addRow: function () {
            this.settings.maxIndex++;
            var template = this.settings.template.replace(/#index#/g, this.settings.maxIndex);
            var newRow = $.parseHTML(template);
            $(newRow).removeClass('template');
            //var newRow = this._templateRow...replace('{$id}', this.maxIndex);
            $(this.element).append(newRow);
        },
        removeRow: function(element) {
            $(element).parent().remove();
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