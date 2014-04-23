var Baasje = function(element){
  var self = this;
    var _element = $(element);
    var pane_width = 0;
    var pane_count = 1;
    var moved_x = 0;
    var moved_y = 0;
    this.init = function() {
            setPaneDimensions();

            $(window).on("load resize orientationchange", function() {
                setPaneDimensions();
            })
        };

    function setPaneDimensions() {
            pane_width = $('body').width();
//            panes.each(function() {
//                $(this).width(pane_width);
//            });
//            container.width(pane_width*pane_count);
        };

    function setContainerOffset(x, y, animate) {
        moved_x += x;
        moved_y += y;
        _element.removeClass("animate");
        //god knows what animate does
        if(animate) {
            _element.addClass("animate");
        }
        if(Modernizr.csstransforms) {
            _element.css("transform", "translate("+ x +"px, " + y + "px)");

        }
        else {
            console.log('else');
            _element.css("left", x + "px");
        }
    }
    function handleHammer(ev) {
        ev.gesture.preventDefault();
        console.log(ev.type);
        var bodyBoundryLeft = $('body').offset().left;
        var elementOffsetLeft = _element.offset().left;

        var bodyBoundryRight =  $('body').offset().left + $('body').width();
        var elementOffsetRight =  _element.offset().left + _element.width();

        switch(ev.type) {
            case 'dragright':
                //move the image right
                var drag_offset = ((100/pane_width)*ev.gesture.deltaX)
                setContainerOffset(ev.gesture.deltaX, ev.gesture.deltaY)
                //if border of image touches the screen, layover LIKE

                if(elementOffsetRight > bodyBoundryRight){
                    //display love
                    $('#love').show();
                }else{
                    //hide the love
                }

            case 'dragleft':
                var drag_offset = ((100/pane_width)*ev.gesture.deltaX)
                setContainerOffset(ev.gesture.deltaX, ev.gesture.deltaY)
                break;
                //if border of image touches the screen, layover KILL
            case 'swipeleft':
                break;

            case 'swiperight':
                break;

            case 'release':
                debugger;

                // more then 50% moved, navigate
                //fix this shit
//                if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
//                    $('body').addClass('red-alert');
//                    if(ev.gesture.direction == 'right') {
//                        self.prev();
//                    } else {
//                        self.next();
//                        //AFTER 3x next without like..show a dead or unhappy puppy?
//                    }
//                }
                //else, move it back
//                else {
//                    $('body').addClass('red-alert');
//                    _element.css("transform", "translate("+ 0 +"%,0)");
//                }
                break;
        }
    };
    new Hammer(_element[0]).on("release dragleft dragright swipeleft swiperight", handleHammer);
};