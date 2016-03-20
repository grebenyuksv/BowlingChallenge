var UpdateChecker = (function () {

    var SingleChecker = function (handler, getter) {
        if (typeof (getter) !== "function") {
            getter = function (getter) {
                return getter;
            }.bind(this, getter);
        }

        var cachedValue = getter();
        handler(cachedValue);

        this.update = function () {
            var newValue = getter();
            if (cachedValue !== newValue) {
                cachedValue = newValue;
                handler(cachedValue);
            }
        };

        this.forceUpdate = function () {
            cachedValue = getter();
            handler(cachedValue);
        };
    };

    var UpdateChecker = function () {

        var bindings = [];

        this.watch = function (handler, getter) {
            bindings.push(new SingleChecker(handler, getter));
        };

        this.update = function () {
            bindings.forEach(function (binding) {
                binding.update();
            });
        };

        this.forceUpdate = function () {
            bindings.forEach(function (binding) {
                binding.forceUpdate();
            });
        };
    };

    return UpdateChecker;
})();