modules.define('jquery', ['loader'], function(provide, loader) {

    function doProvide(preserveGlobal) {
        provide(preserveGlobal? jQuery : jQuery.noConflict(true));
    }

    typeof jQuery !== 'undefined' ? doProvide(true) : loader('https://yastatic.net/jquery/3.1.1/jquery.min.js', doProvide);

    // loader('https://yastatic.net/jquery/3.1.1/jquery.min.js', function() { provide($) });
});
