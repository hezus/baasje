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
    var moved_x;
    var moved_y;
    var element_name = '.image-and-info';
    var detail_view = false;

    this.init = function() {
        setPaneDimensions();
        loadData();
        clickHandlers();
    };



    function loadData(){
        $.getJSON(json_url)
          .done(function( json ) {
//            console.log( ["JSON Data", json]);
            buildUI(json);
          })
          .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
//            console.log( "Request Failed: " + err );
          });

    };
    function buildUI(dogs){
        setTimeout(hideLoader, (2000));
        //set first element
        self.dogs = dogs;

        var dog = dogs[0];

        setDogBasicInfo(_element, dog)


        var length = dogs.length;
        for(var i = 1; i < 3; i++){
            var dog = dogs[i];
            //dont clone if its the last one
            var new_element = _element.clone().insertAfter(element_name+":last");
            new_element.addClass('level_'+(i+1));

            setDogBasicInfo(new_element, dog)
        }
        _element.addClass('level_1');
        hammer = new Hammer(_element[0]).on("release drag swipe tap", handleHammer);


    };

    function hideLoader(){
         $('#ui').show();
        $('body').css('width', '320px')
         $('#loader').remove();
    };

    function setPaneDimensions() {
        pane_width = 320;
    };

    function setContainerOffset(x, y, reset) {
//        console.log(['reset', x, y])
        _element.removeClass("animate");
        //god knows what animate does
        if(reset) {
            console.log(['reset', x, y])
            _element.addClass("animate");
            if(x > 0 && y > 0){
                _element.css("transform", "translate(0, 0)");
            }else{
                _element.css("transform", "translate(-"+ x +"px, -" + y + "px)");
            }


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

            showDetails(dog)
        }
        self.detail_view = !self.detail_view;

    }
    function setDogBasicInfo(element, dog){
        element.find('.image').css('background-image', 'url(' + dog.image + ')');
        element.find('.name').text( dog.name);
        element.find('.age').text( dog.age);
        element.find('.pic_amount').text( 1);
    }

    function showDetails(dog){
        disableDragOnHammer();

        var infoContainer = $('#info-extended');
        infoContainer.show();
        _element.find('.info').hide();
        $('#controls').hide();
        $('#ui').addClass('details');
        //update values
        infoContainer.find('.name').text( dog.name);
        infoContainer.find('.age').text( dog.age );
        infoContainer.find('.race').text( 'Ras: '+dog.race );
        infoContainer.find('.shelter_name').text( dog.shelter_name);
        infoContainer.find('.shelter_city').text( dog.shelter_city);
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
//                    debugger;

                   next(ev.gesture.direction);
                    //if there are still more then 3 dogs
                        //add a 4th, maybe
                        // TODO: do some loading here if only 5 dogs left

                }else{
                    setContainerOffset(moved_x, moved_y, true);
//                    moved_x = 0;
//                    moved_y = 0;
                }


                break;
        }

    };
    function next(direction){
        hideDetails();
        //instead of remove. add css animation in this direction

        _element.remove();
        self.dogs.shift();
        if(self.dogs.length > 3){
            new_dog = $(element_name+":last").clone().insertAfter(element_name+":last");
            new_dog.addClass('level_4');
            new_dog.removeClass('level_3')
            setDogBasicInfo(new_dog, self.dogs[3])
        }
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
        //maybe add a new dawg!


        rebindHammer(self._new_element); //this also sets the _element variable
        moved_x = 0;
        moved_y = 0;
    }
    function clickHandlers(){
        $('#like').click(function() {
          next('left');
        });
        $('#dislike').click(function() {
          next('right');
        });
        $('#info').click(function(){
            showDetails(self.dogs[0])
            self.detail_view = true;
        });
    }

};