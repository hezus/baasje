var Baasje = function(element, loader, json_url){
    var _json_url = json_url;
    var _loader = loader;
    var self = this;
    var hammer;
    var dogs;
    var _element = $(element);
    var _new_element;
    var pane_width = 0;
    var pane_count = 1;
    var moved_x = 0;
    var moved_y = 0;
    var element_name = '.image-and-info';
    var detail_view = false;

    this.init = function() {
        //load data

            setPaneDimensions();


//            $(window).on("resize orientationchange", function() {
//                setPaneDimensions();
//            })
        loadData();
    };

    function loadData(){
        $.getJSON(json_url)
          .done(function( json ) {
            console.log( ["JSON Data", json]);
            buildUI(json.dogs);
          })
          .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
          });

    };
    function buildUI(dogs){
        setTimeout(hideLoader, (2000));
        //set first element
        self.dogs = dogs;

        var dog = dogs[0];

        _element.find('.image').css('background-image', 'url(' + dog.images[0].url + ')');
        _element.find('.name').text( dog.name);
        _element.find('.age').text( dog.age);
        _element.find('.pic_amount').text( dog.images.length);

        var length = dogs.length;
        for(var i = 1; i < dogs.length; i++){
            var dog = dogs[i];
            //dont clone if its the last one
            var new_element = _element.clone().insertAfter(element_name+":last");
            new_element.addClass('level_'+(i+1));
            new_element.find('.image').css('background-image', 'url(' + dog.images[0].url + ')');
            new_element.find('.name').text( dog.name);
            new_element.find('.age').text( dog.age);
            new_element.find('.pic_amount').text( dog.images.length);
        }
        _element.addClass('level_1');
        hammer = new Hammer(_element[0]).on("release drag swipe tap", handleHammer);

    };
    function hideLoader(){
         $('#ui').show();
         $('#loader').hide();
    };

    function setPaneDimensions() {
        pane_width = $('body').width();
    };

    function setContainerOffset(x, y, reset) {
        _element.removeClass("animate");
        //god knows what animate does
        if(reset) {
            _element.addClass("animate");
            _element.css("transform", "translate(-"+ x +"px, -" + y + "px)");

        }
        else{
            if(Modernizr.csstransforms) {
                _element.css("transform", "translate("+ x +"px, " + y + "px)");

            }
            else {
                console.log('else');
                _element.css("left", x + "px");
            }
        }
    };
    function rebindHammer(new_element){
        hammer.dispose();
        hammer = new Hammer(new_element[0]).on("release drag swipe tap", handleHammer);
        _element = new_element;
    }
    function disableDragOnHammer(){
        hammer.dispose();
        hammer = new Hammer(_element[0]).on("tap", handleHammer);
    }

    function toggleDetails(){
        var dog = self.dogs[0];

        if(self.detail_view){
            //detail view was toggled. set values
            hideDetails()
            rebindHammer(_element)
        }else{
            disableDragOnHammer();
            showDetails(dog)
        }
        self.detail_view = !self.detail_view;

    }
    function showDetails(dog){
        var infoContainer = $('#info-extended');
        infoContainer.show();
        _element.find('.info').hide();
        $('#controls').hide();
        $('#ui').addClass('details');

        //hide the image aswell after it is shown.

        //replace it with a carrousel



    }
    function hideDetails(){
        var infoContainer = $('#info-extended');
        infoContainer.hide();
        //show the image again

        //remove the carrousel


        _element.find('.info').show();
        $('#controls').show();
        $('#ui').removeClass('details');
    }
    function handleHammer(ev) {
        ev.gesture.preventDefault();
//        console.log(ev.type);
        var bodyBoundryLeft = $('body').offset().left;
        var elementOffsetLeft = _element.offset().left;
        var bodyBoundryRight =  $('body').offset().left + $('body').width();
        var elementOffsetRight =  _element.offset().left + _element.width();

        var pastRightBoundry = (elementOffsetRight > bodyBoundryRight);
        var pastLeftBoundry = (elementOffsetLeft < bodyBoundryLeft);

        if(pastRightBoundry){
            //display love
            _element.find('.love').show();

        }else{
            _element.find('.love').hide();
        }
        if(pastLeftBoundry){
            _element.find('.kill').show();
        }else{
            _element.find('.kill').hide();
        }

        console.log(ev.type);
        switch(ev.type) {
            case 'drag':
                setContainerOffset(ev.gesture.deltaX, ev.gesture.deltaY, false)
                moved_x = ev.gesture.deltaX;
                moved_y = ev.gesture.deltaY;

                break;
            case 'tap':
                //show details
                toggleDetails();
                break;
            case 'release':
                _element.find('.love').hide();
                _element.find('.kill').hide();
                if(pastLeftBoundry || pastRightBoundry){
                    _element.hide();
                    hideDetails();
                    $('body').find(element_name+':visible').each(function(index, element_ref) {
                        var loop_element = $(element_ref);
                        var cloned_element = loop_element.clone().insertBefore(loop_element);
                        //clone it. and give it the new class
                        cloned_element.addClass('level_'+ (index + 1) );
                        cloned_element.removeClass('level_'+ (index + 2));
                        loop_element.remove();
                        if(index === 0){
                            self._new_element = cloned_element;
                        }
                    });
                    rebindHammer(self._new_element); //this also sets the _element variable
                    moved_x = 0;
                    moved_y = 0;
                }else{

//                    moved_x = 0;
//                    moved_y = 0;
                    //I like to move it
//                    console.log([{movedX: moved_x, movedY: moved_y}])
//                    setContainerOffset(moved_x, moved_y, true);
                    //move it
                }
                setContainerOffset(moved_x, moved_y, true);
                moved_x = 0;
                moved_y = 0;

                break;
        }

    };
};